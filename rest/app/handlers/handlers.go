package handlers

import (
	"context"
	"net/http"
	"os"

	"github.com/ferdzzzzzzzz/ferdzz/business/mid"
	"github.com/ferdzzzzzzzz/ferdzz/foundation/web"
	"go.uber.org/zap"
)

type APIMuxConfig struct {
	Shutdown   chan os.Signal
	Log        *zap.SugaredLogger
	CorsOrigin string
}

func APIMux(conf APIMuxConfig) *web.App {
	app := web.NewApp(
		conf.Shutdown,
		mid.Logger(conf.Log),
		mid.Errors(conf.Log),
		mid.Panics(),
	)

	//==========================================================================
	// File Server for /public route

	app.ServeFiles("./public/")

	// =========================================================================
	// Resources

	app.Handle(http.MethodGet, "/user/{userID}", userRoute)

	// =========================================================================
	// Views

	viewRoutes := newViewRoutes()

	app.Handle(http.MethodGet, "/", viewRoutes.home)

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
