package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/ferdzzzzzzzz/ferdzz/business/auth"
	"github.com/ferdzzzzzzzz/ferdzz/core/hash"
	"github.com/ferdzzzzzzzz/ferdzz/core/rand"
	"github.com/ferdzzzzzzzz/ferdzz/core/web"
	"github.com/ferdzzzzzzzz/ferdzz/data/neo"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
	"go.uber.org/zap"
)

type authHandler struct {
	Log  *zap.SugaredLogger
	DB   neo4j.Driver
	Auth auth.Service
}

func (a authHandler) signInWithMagicLink(
	ctx context.Context,
	w http.ResponseWriter,
	r *http.Request,
) error {

	encryptedMagicLink, ok := web.QueryParam(r, "token")

	if !ok {
		// =====================================================================
		// User doesn't have a magic link yet, we need to create one and email
		// it to the user

		// check that post body contains user email
		// fmt.Println(r.Body)

		user := struct {
			Email string
		}{}

		// jsonStr, _ := ioutil.ReadAll(r.Body)
		// x := map[string]string{}

		// json.Unmarshal([]byte(jsonStr), &x)
		// fmt.Println(x)

		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil || user.Email == "" {
			return web.Respond(ctx, w, "Bad Request: user email required", http.StatusBadRequest)
		}

		// Create remember token
		rememberToken, err := rand.RememberToken()
		if err != nil {
			a.Log.Error(err)
			return err
		}

		// Hash remember token
		hashedRememberToken, err := hash.BcryptNew(rememberToken)
		a.Log.Info("token: ", hashedRememberToken)
		if err != nil {
			a.Log.Error(err)
			return err
		}

		// =====================================================================
		// Create a session in the database, if the user doesn't exist we create
		// them first using a MERGE command

		userSession := auth.NewSession(hashedRememberToken)

		session := a.DB.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
		defer session.Close()

		a.Log.Info("writing user session to neo4j")

		result, err := session.WriteTransaction(func(tx neo4j.Transaction) (interface{}, error) {
			result, err := tx.Run(`
		MERGE (u:User {Email: $Email})

		CREATE (s:Session)
		SET s.HashedRememberToken 	= $Token
		SET s.Start 				= $Start
		SET s.Exp 					= $Exp
		SET s.Activated 			= false

		CREATE (u)-[:HAS]->(s)
		RETURN id(u), id(s)
		`,

				map[string]interface{}{
					"Email": user.Email,
					"Token": userSession.HashedRememberToken,
					"Start": userSession.Start,
					"Exp":   userSession.Exp,
				},
			)

			if err != nil {
				return nil, err
			}

			if !result.Next() {
				return nil, result.Err()
			}

			return result.Record().Values, nil

		})

		if err != nil {
			return err
		}

		IDs, err := neo.UnmarshalIDSlice(result)
		if err != nil || len(IDs) < 2 {
			return errors.New("invalid read from DB")
		}

		userID := IDs[0]
		sessionID := IDs[1]

		// =====================================================================
		// Create Magic Link and email to user

		magicLink, err := a.Auth.GetNewMagicLink(userID, sessionID)
		if err != nil {
			return err
		}

		fmt.Println("================================")
		fmt.Println("Email this link")
		fmt.Println(magicLink)
		fmt.Println("================================")

		a.Log.Info("setting user cookie")

		http.SetCookie(w, &http.Cookie{
			Name:     "remember_token",
			Value:    rememberToken,
			Domain:   "http://localhost:8787",
			Expires:  time.Now().Add(auth.LinkExpirationTime),
			Secure:   true,
			HttpOnly: true,
		})

		return web.Respond(ctx, w, nil, http.StatusNoContent)
	}

	// =========================================================================
	// If we get here the user has clicked on the magic link

	a.Log.Info(encryptedMagicLink)
	rememberToken, err := r.Cookie("remember_token")
	if err != nil {
		a.Log.Error(err)
		return web.Respond(ctx, w, "You can only sign in with the link from the same browser you requested it.", http.StatusBadRequest)
	}

	magicLink, err := a.Auth.UnencryptMagicLink(encryptedMagicLink)
	if err != nil {
		return err
	}

	a.Log.Info(magicLink)
	// check if link has expired

	// Helper -> 	If the time that the magic link expires is before now, it
	// 				has expired
	linkIsExpired := time.Unix(magicLink.Exp, 0).Before(time.Now())

	if linkIsExpired {
		return web.Respond(ctx, w, "Sign In link has expired, please request a new one.", http.StatusBadRequest)
	}

	dbSession := a.DB.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
	defer dbSession.Close()

	result, err := dbSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		result, err := tx.Run(`
	MATCH (u:User)-[:HAS]->(s:Session)
	WHERE 
		id(u) = $UserID 		AND
		id(s) = $SessionID
	
	RETURN s
	`,
			map[string]interface{}{
				"UserID":    magicLink.UserID,
				"SessionID": magicLink.SessionID,
			},
		)

		if err != nil {
			return nil, err
		}

		if !result.Next() {
			return nil, result.Err()
		}

		return result.Record().Values[0], nil

	})

	if err != nil {
		return err
	}

	userSession, err := neo.UnmarshalAuthSession(result)
	if err != nil {
		a.Log.Errorw("error reading auth session from database, failed to convert struct", "sessionID", magicLink.SessionID)
		return errors.New("error reading from the database")
	}

	ok, err = hash.BcryptCompare(userSession.HashedRememberToken, rememberToken.Value)
	if err != nil {
		return err
	}

	if !ok {
		return web.Respond(ctx, w, "Failed to authenticate.", http.StatusBadRequest)
	}

	a.Log.Info(rememberToken)

	_, err = dbSession.WriteTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		_, err := tx.Run(`
	MATCH (s:Session)
	WHERE 
		s.id = $sessionID
	
	SET s.activated = true
	`,
			map[string]interface{}{
				"sessionID": magicLink.SessionID,
			},
		)

		if err != nil {
			return nil, err
		}

		return nil, nil

	})

	if err != nil {
		return err
	}

	authToken, err := a.Auth.EncryptAuthToken(magicLink.UserID, magicLink.SessionID, rememberToken.Value)
	if err != nil {
		return err
	}

	authCookie := http.Cookie{
		Name:     "auth_token",
		Value:    authToken,
		Expires:  time.Now().Add(auth.SessionExpirationTime),
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	}

	http.SetCookie(w, &authCookie)

	return web.Respond(ctx, w, nil, http.StatusNoContent)
}
