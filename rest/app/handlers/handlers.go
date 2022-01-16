package handlers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

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

	app.Handle(http.MethodGet, "/user/{userID}", func(ctx context.Context, w http.ResponseWriter, r *http.Request) error {

		q, ok := web.QueryParam(r, "filter")
		if !ok {
			fmt.Println("NOT OK")
		} else {
			fmt.Println(q)
		}

		id, ok := web.PathParam(r, "userID")
		if !ok {
			fmt.Println("wtf")
			return errors.New("housten, we have a big fuckin problem")
		}
		fmt.Println(id)

		time.Sleep(1 * time.Second)

		return web.Respond(ctx, w, "Hello World", http.StatusOK)
	})

	app.Handle(http.MethodPost, "/user/{userID}", func(ctx context.Context, w http.ResponseWriter, r *http.Request) error {

		return web.Respond(ctx, w, "Hello From Post World", http.StatusOK)
	})

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
