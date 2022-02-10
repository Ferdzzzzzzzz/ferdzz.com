package handlers

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/ferdzzzzzzzz/ferdzz/business/auth"
	"github.com/ferdzzzzzzzz/ferdzz/business/mid"
	"github.com/ferdzzzzzzzz/ferdzz/core/web"
	"github.com/go-playground/validator/v10"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
	"go.uber.org/zap"
)

type APIMuxConfig struct {
	Shutdown    chan os.Signal
	Log         *zap.SugaredLogger
	CorsOrigin  string
	DevMode     bool
	DB          neo4j.Driver
	AuthService auth.Service
	V           *validator.Validate
}

func APIMux(conf APIMuxConfig) *web.App {

	app := web.NewApp(
		conf.Shutdown,
		conf.DevMode,
		mid.Logger(conf.Log),
		mid.Errors(conf.Log),
		mid.Panics(),
	)

	app.DevMiddleware(mid.Latency(conf.Log))

	// =========================================================================
	// Resource Routes

	authHandler := authHandler{
		Log:  conf.Log,
		DB:   conf.DB,
		Auth: conf.AuthService,
		V:    conf.V,
	}

	// this is a dummy route
	app.Handle(http.MethodGet, "/user/{userID}", userRoute)

	app.Handle(http.MethodGet, "/dummy", func(ctx context.Context, w http.ResponseWriter, r *http.Request) error {

		fmt.Println("Hello")
		fmt.Println(r.Cookies())

		return web.Respond(ctx, w, nil, http.StatusNoContent)
	})

	app.Handle(http.MethodPost, "/magicsignin", authHandler.signInWithMagicLink)
	app.Handle(http.MethodGet, "/usercontext", authHandler.userContext)
	app.Handle(http.MethodPost, "/signout", authHandler.deleteAuthSession)

	// Accept CORS 'OPTIONS' preflight requests if config has been provided.
	// Don't forget to apply the CORS middleware to the routes that need it.
	// Example Config: `conf:"default:https://MY_DOMAIN.COM"`
	if conf.CorsOrigin != "" {
		h := func(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
			return nil
		}
		app.Handle(http.MethodOptions, "/*", h, mid.Cors(conf.CorsOrigin))
	}

	return app
}
