package handlers

import (
	"context"
	"net/http"

	"github.com/ferdzzzzzzzz/ferdzz/core/web"
)

func userRoute(ctx context.Context, w http.ResponseWriter, r *http.Request) error {

	return web.Respond(ctx, w, "Hello World", http.StatusOK)
}
