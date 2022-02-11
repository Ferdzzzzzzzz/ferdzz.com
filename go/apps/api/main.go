package main

import (
	"fmt"
	"net/http"
)

func main() {
	server := http.Server{
		Addr: ":8080",
		Handler: http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
			fmt.Fprint(rw, "<h1>Ferdzz is trying Fly</h1><p>Hello Stefan</p>")
		}),
	}

	server.ListenAndServe()
}
