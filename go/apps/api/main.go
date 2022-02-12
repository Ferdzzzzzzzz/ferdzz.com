package main

import (
	"fmt"
	"net/http"
)

func main() {
	server := http.Server{
		Addr: ":8080",
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			fmt.Println(r.Header.Get("X-Forwarded-Proto"))

			if r.Header.Get("X-Forwarded-Proto") == "http" {
				fmt.Println("redirect")
				http.Redirect(w, r, "https://"+r.Host+r.RequestURI, http.StatusMovedPermanently)
				return
			}

			fmt.Println("serving this")
			fmt.Fprint(w, "<h1>Ferdzz is trying Fly</h1><p>Hello Stefan</p>")

		}),
	}

	server.ListenAndServe()
}
