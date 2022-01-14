package handlers

import (
	"fmt"
	"net/http"
	"time"
)

type APIMuxConfig struct {
}

func APIMux(conf APIMuxConfig) *http.ServeMux {
	app := http.NewServeMux()

	app.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		time.Sleep(5 * time.Second)
		fmt.Fprint(rw, "Hello from the other side")
	})

	return app
}
