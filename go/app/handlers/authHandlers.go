package handlers

import (
	"context"
	"encoding/json"
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

	dbSession := a.DB.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
	defer dbSession.Close()

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

		a.Log.Info("writing user session to neo4j")

		IDs, err := neo.MergeUserAndSession(dbSession, user.Email, userSession)
		if err != nil {
			return err
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

	// Helper Sentence -> 	If the time that the magic link expires is before
	// 						now, it has expired
	linkIsExpired := time.Unix(magicLink.Exp, 0).Before(time.Now())

	if linkIsExpired {
		return web.Respond(ctx, w, "Sign In link has expired, please request a new one.", http.StatusBadRequest)
	}

	userSession, err := neo.GetAuthSession(dbSession, magicLink)
	if err != nil {
		return err
	}

	ok, err = hash.BcryptCompare(userSession.HashedRememberToken, rememberToken.Value)
	if err != nil {
		return err
	}

	if !ok {
		return web.Respond(ctx, w, "Failed to authenticate.", http.StatusBadRequest)
	}

	a.Log.Info(rememberToken)

	err = neo.CreateAuthSession(dbSession, magicLink)
	if err != nil {
		return err
	}

	authToken, err := a.Auth.EncryptAuthToken(
		magicLink.UserID,
		magicLink.SessionID,
		rememberToken.Value,
	)
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

func (a authHandler) userContext(
	ctx context.Context,
	w http.ResponseWriter,
	r *http.Request,
) error {

	a.Log.Info("fetching user context")

	return nil
}
