package handlers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/ferdzzzzzzzz/ferdzz/core/web"
)

func userRoute(ctx context.Context, w http.ResponseWriter, r *http.Request) error {

	fmt.Println(r.Cookie("AUTH"))
	fmt.Println("==========")

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
