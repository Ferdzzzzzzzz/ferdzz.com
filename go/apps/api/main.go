package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// build is the git version of this program. It is set using build flags in the makefile.
var build = "develop"
var dateSA = "build_date"
var dateUTC = "build_date"
var semver = "semver"

func main() {
	server := http.Server{
		Addr: ":8080",
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			fmt.Println(r.Header.Get("X-Forwarded-Proto"))

			fmt.Println("=========================================")
			fmt.Println(r.Proto)
			if r.Proto == "http" {
				http.Redirect(w, r, "https://"+r.Host+r.RequestURI, http.StatusMovedPermanently)
				return
			}

			// if r.Header.Get("X-Forwarded-Proto") == "http" {
			// 	http.Redirect(w, r, "https://"+r.Host+r.RequestURI, http.StatusMovedPermanently)
			// 	return
			// }

			fmt.Println("serving this")

			out := struct {
				Build        string
				BuildDateSA  string
				BuildDateUTC string
				Version      string
			}{
				Build:        build,
				BuildDateSA:  dateSA,
				BuildDateUTC: dateUTC,
				Version:      semver,
			}

			jsonOut, err := json.Marshal(&out)

			if err != nil {
				fmt.Fprintf(w, "err: %s", err.Error())
			} else {
				fmt.Fprint(w, string(jsonOut))
			}

		}),
	}

	server.ListenAndServe()
}
