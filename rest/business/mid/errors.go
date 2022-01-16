package mid

import (
	"context"
	"net/http"

	"github.com/ferdzzzzzzzz/ferdzz/foundation/web"
	"go.uber.org/zap"
)

// Errors handles errors coming out of the call chain. This middleware is only
// meant for UNEXPECTED errors. Application errors should be handled in the
// HTTP Handler
func Errors(log *zap.SugaredLogger) web.Middleware {

	// This is the actual middleware function to be executed.
	m := func(handler web.Handler) web.Handler {

		// Create the handler that will be attached in the middleware chain.
		h := func(ctx context.Context, w http.ResponseWriter, r *http.Request) error {

			// If the context is missing this value, request the service
			// to be shutdown gracefully.
			v, err := web.GetValues(ctx)
			if err != nil {
				return web.NewShutdownError("web value missing from context")
			}

			// Run the next handler and catch any propagated error.
			if err := handler(ctx, w, r); err != nil {

				// Log the error.
				log.Errorw("ERROR", "traceid", v.TraceID, "ERROR", err)

				// Respond with the error back to the client.
				err := web.Respond(ctx, w, "Internal Server Error", http.StatusInternalServerError)
				if err != nil {
					return err
				}

				// If we receive the shutdown err we need to return it
				// back to the base handler to shut down the service.
				if ok := web.IsShutdown(err); ok {
					return err
				}
			}

			// The error has been handled so we can stop propagating it.
			return nil
		}

		return h
	}

	return m
}
