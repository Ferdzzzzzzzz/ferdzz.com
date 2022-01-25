package handlers

import (
	"context"
	"net/http"
	"os"

	"github.com/ferdzzzzzzzz/ferdzz/business/mid"
	"github.com/ferdzzzzzzzz/ferdzz/core/web"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
	"go.uber.org/zap"
)

type APIMuxConfig struct {
	Shutdown   chan os.Signal
	Log        *zap.SugaredLogger
	CorsOrigin string
	DevMode    bool
	DB         neo4j.Driver
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
		Log: conf.Log,
		DB:  conf.DB,
	}

	// this is a dummy route
	app.Handle(http.MethodGet, "/user/{userID}", userRoute)

	app.Handle(http.MethodPost, "/magicSignIn", authHandler.signInWithMagicLink)

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
