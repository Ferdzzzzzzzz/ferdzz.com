package handlers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/ferdzzzzzzzz/ferdzz/foundation/web"
)

func userRoute(ctx context.Context, w http.ResponseWriter, r *http.Request) error {

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
}
