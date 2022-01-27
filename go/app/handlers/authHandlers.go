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

	token, ok := web.QueryParam(r, "token")

	if !ok {
		// =====================================================================
		// User doesn't have a magic link yet, we need to create one and email
		// it to the user

		// check that post body contains user email
		// fmt.Println(r.Body)

		user := struct {
			Email string `json:"email"`
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

		userSession := auth.NewSession(rememberToken)

		session := a.DB.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
		defer session.Close()

		a.Log.Info("writing user session to neo4j")

		result, err := session.WriteTransaction(func(tx neo4j.Transaction) (interface{}, error) {
			result, err := tx.Run(`
		MERGE (u:User {email: $email})

		CREATE (s:Session)
		SET s.hashedRememberToken 	= $token
		SET s.start 				= $start
		SET s.exp 					= $exp
		SET s.activated 			= false

		CREATE (u)-[:HAS]->(s)
		RETURN id(s)
		
		`,

				map[string]interface{}{
					"email": user.Email,
					"token": userSession.HashedRememberToken,
					"start": userSession.Start,
					"exp":   userSession.Exp,
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

		sessionID, ok := result.(int64)
		if !ok {
			return errors.New("invalid sessionID")
		}

		// =====================================================================
		// Create Magic Link and email to user

		magicLink, err := a.Auth.GetMagicLink(user.Email, sessionID)
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

	a.Log.Info("magiclink", token)

	return nil
}
