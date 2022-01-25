package handlers

import (
	"context"
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
	Log           *zap.SugaredLogger
	DB            neo4j.Driver
	ClientBaseURL string
}

func (a authHandler) signInWithMagicLink(
	ctx context.Context,
	w http.ResponseWriter,
	r *http.Request,
) error {

	magicLink, ok := web.QueryParam(r, "magic")

	// =========================================================================
	// User doesn't have a magic link yet, we need to create one and email it

	if !ok {
		// TODO
		// =====================================================================
		// check that post body contains user email
		// =====================================================================

		// Create remember token
		rememberToken, err := rand.RememberToken()
		if err != nil {
			a.Log.Error(err)
			return err
		}

		// Hash remember token
		hashedRememberToken, err := hash.BcryptNew(rememberToken)
		a.Log.Info("token", hashedRememberToken)
		if err != nil {
			a.Log.Error(err)
			return err
		}

		// Create session in Database, storing remember_token hash and salt

		// create magic link, encrypted with HMAC: [email, session ID, link-exp] and email to user
		// Respond to browser with unhashed remember_token Cookie

		http.SetCookie(w, &http.Cookie{
			Name:     "remember_token",
			Value:    rememberToken,
			Domain:   "https://ferdzz.com",
			Expires:  time.Now().Add(auth.LinkExpirationTime),
			Secure:   true,
			HttpOnly: true,
		})

		return web.Respond(ctx, w, nil, http.StatusNoContent)
	}

	a.Log.Info("magiclink", magicLink)

	//  When user clicks on magic link, redirect to ?magicLink=“link” page
	//  Send magic link up with remember_token
	//  Unencrypt link then validate email/session_id matches remember_token hash
	//  Trade magic link for encrypted auth cookie: [email, session ID, remember_token]
	//  Now session is protected from me and I can lookup user by email
	//  Auth service should rotate encryption secrets smoothly

	return nil
}
