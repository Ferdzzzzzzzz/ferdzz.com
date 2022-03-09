package main

import (
	"fmt"
	"net/http"
	"os"

	view "github.com/ferdzzzzzzzz/ferdzz.com/go/apps/webapp/views"
	"github.com/ferdzzzzzzzz/ferdzz.com/go/core/u"
)

var viewPath = "./apps/webapp/views/"
var layoutPath = viewPath + "layouts/"

const port = ":80"

var homeView *view.View
var contactView *view.View
var notFoundView *view.View

func main() {
	tempTemplateDir := os.Getenv("TEMPLATE_VIEWS_DIR")
	if tempTemplateDir != "" {
		viewPath = tempTemplateDir
		layoutPath = viewPath + "layouts/"
	}

	homeView = view.NewView(layoutPath, "default", viewPath+"home.html")
	contactView = view.NewView(layoutPath, "default", viewPath+"contact.html")
	notFoundView = view.NewView(layoutPath, "default", viewPath+"notFound.html")

	fmt.Printf("listening on port %s\n", port)

	server := http.Server{
		Addr:    port,
		Handler: http.HandlerFunc(router),
	}

	server.ListenAndServe()
}

func router(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/":
		home(w, r)
	case "/contact":
		contact(w, r)
	default:
		notFound(w, r)
	}

}

func home(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	err := homeView.Template.ExecuteTemplate(w, homeView.Layout, struct{ Name string }{
		Name: "Yass",
	})

	u.PanicIfErr(err)
}

func contact(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	err := contactView.Template.ExecuteTemplate(w, contactView.Layout, nil)

	u.PanicIfErr(err)
}

func notFound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	err := notFoundView.Template.ExecuteTemplate(w, notFoundView.Layout, nil)

	u.PanicIfErr(err)
}
