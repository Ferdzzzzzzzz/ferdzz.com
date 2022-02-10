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
	"github.com/go-playground/validator/v10"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
	"go.uber.org/zap"
)

type authHandler struct {
	Log  *zap.SugaredLogger
	DB   neo4j.Driver
	Auth auth.Service
	V    *validator.Validate
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
			Email string `validate:"required,email"`
		}{}

		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			return web.Respond(ctx, w, "Bad Request: couldn't parse JSON", http.StatusBadRequest)
		}

		err = a.V.Struct(user)
		if err != nil {
			return web.Respond(ctx, w, "Bad Request: invalid user email", http.StatusBadRequest)
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

		mergeResult, err := neo.MergeUserAndSession(dbSession, user.Email, userSession)
		if err != nil {
			return err
		}

		userID := mergeResult.UserID
		sessionID := mergeResult.SessionID

		// =====================================================================
		// Create Magic Link and email to user

		magicLink, err := a.Auth.GetMagicLink(userID, sessionID)
		if err != nil {
			return err
		}

		fmt.Println("================================")
		fmt.Println("Email this link")
		fmt.Println(magicLink)
		fmt.Println("================================")

		a.Log.Info("setting user cookie")

		http.SetCookie(w, &http.Cookie{
			Name:     auth.RememberTokenCookie,
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
	rememberToken, err := r.Cookie(auth.RememberTokenCookie)
	if err != nil {
		a.Log.Error(err)
		return web.Respond(ctx, w, "You can only sign in with the link from the same browser you requested it.", http.StatusBadRequest)
	}

	magicLink, err := a.Auth.UnmarshalMagicLink(encryptedMagicLink)
	if errors.Is(err, auth.ErrExpiredMagicLink) {
		return web.Respond(ctx, w, "Sign In link has expired, please request a new one.", http.StatusUnauthorized)

	} else if errors.Is(err, auth.ErrInvalidMagicLink) {
		return web.Respond(ctx, w, "Invalid MagicLink.", http.StatusBadRequest)
	} else if err != nil {
		return err
	}

	a.Log.Info(magicLink)
	// check if link has expired

	authSession, err := neo.GetAuthSession(dbSession, magicLink)
	if err != nil {
		return err
	}

	ok, err = hash.BcryptCompare(authSession.HashedRememberToken, rememberToken.Value)
	if err != nil {
		return err
	}

	if !ok {
		a.Log.Info("bad link, could not validate rememberToken")
		return web.Respond(ctx, w, "Failed to authenticate.", http.StatusBadRequest)
	}

	err = neo.CreateAuthSession(dbSession, magicLink)
	if err != nil {
		return err
	}

	authToken, err := a.Auth.NewToken(
		magicLink.UserID,
		magicLink.SessionID,
		rememberToken.Value,
	)
	if err != nil {
		return err
	}

	authCookie := http.Cookie{
		Name:     auth.AuthTokenCookie,
		Value:    authToken,
		Expires:  time.Now().Add(auth.SessionExpirationTime),
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	}
	http.SetCookie(w, &authCookie)

	// =========================================================================
	// Return expired remember_token, this deletes the cookie from the browser
	expiredRememberTokenCookie := http.Cookie{
		Name:     auth.RememberTokenCookie,
		Value:    "",
		Expires:  time.Now().Add(time.Hour * -1),
		Secure:   true,
		HttpOnly: true,
	}

	http.SetCookie(w, &expiredRememberTokenCookie)

	return web.Respond(ctx, w, nil, http.StatusNoContent)
}

func (a authHandler) userContext(
	ctx context.Context,
	w http.ResponseWriter,
	r *http.Request,
) error {

	a.Log.Info("fetching user context")

	// =========================================================================
	// Get Auth Cookie and unencrypt it

	authTokenString, err := r.Cookie(auth.AuthTokenCookie)

	if err != nil {
		return web.Respond(ctx, w, "no auth_token cookie present on request", http.StatusUnauthorized)
	}

	authToken, err := a.Auth.UnencryptToken(authTokenString.Value)
	if err != nil {
		return web.Respond(ctx, w, "bad auth token", http.StatusUnauthorized)
	}

	// =========================================================================
	// Get session and User, check if session has expired, otherwise return user
	// context

	dbSession := a.DB.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeRead})
	defer dbSession.Close()

	user, authSession, err := neo.GetUserContext(dbSession, authToken.UserID, authToken.SessionID)
	if err != nil {
		return err
	}

	fmt.Println(user, authSession)

	return web.Respond(ctx, w, &user, http.StatusOK)
}

func (a authHandler) deleteAuthSession(
	ctx context.Context,
	w http.ResponseWriter,
	r *http.Request,
) error {
	authTokenString, err := r.Cookie(auth.AuthTokenCookie)
	if err != nil {
		return web.Respond(ctx, w, nil, http.StatusUnauthorized)
	}

	// =========================================================================
	// Get user and session from cookie
	authToken, err := a.Auth.UnencryptToken(authTokenString.Value)
	if err != nil {
		return web.Respond(ctx, w, nil, http.StatusUnauthorized)
	}

	// =========================================================================
	// Delete session
	a.Log.Info("deleting auth session")

	dbSession := a.DB.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
	defer dbSession.Close()

	_, err = dbSession.WriteTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		result, err := tx.Run(`
	MATCH (u:User)-[:HAS]->(s:Session)
	WHERE 
		id(u) = $UserID 		AND
		id(s) = $SessionID
	
	DETACH DELETE s
	`,
			map[string]interface{}{
				"UserID":    authToken.UserID,
				"SessionID": authToken.SessionID,
			},
		)

		if err != nil {
			return nil, err
		}

		if !result.Next() {
			return nil, result.Err()
		}

		return nil, nil
	})

	if err != nil {
		return err
	}

	// =========================================================================
	// Return expired auth_token, this deletes the cookie from the browser
	expiredAuthCookie := http.Cookie{
		Name:     auth.AuthTokenCookie,
		Value:    "",
		Expires:  time.Now().Add(time.Hour * -1),
		Secure:   true,
		HttpOnly: true,
	}

	http.SetCookie(w, &expiredAuthCookie)

	return nil
}
