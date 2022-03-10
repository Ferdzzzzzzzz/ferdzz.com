package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	view "github.com/ferdzzzzzzzz/ferdzz.com/go/apps/webapp/views"
)

var viewPath = "./apps/webapp/views/"
var staticFilePath = "./apps/webapp/public/"

const port = ":80"

var homeView *view.View
var contactView *view.View
var notFoundView *view.View

func main() {
	tempTemplateDir := os.Getenv("TEMPLATE_VIEWS_DIR")
	if tempTemplateDir != "" {
		viewPath = tempTemplateDir
	}

	homeView = view.NewView(viewPath, "default", viewPath+"home.html")
	contactView = view.NewView(viewPath, "default", viewPath+"contact.html")
	notFoundView = view.NewView(viewPath, "default", viewPath+"notFound.html")

	fmt.Printf("listening on port %s\n", port)

	app := NewApp(staticFilePath)

	server := http.Server{
		Addr:    port,
		Handler: app,
	}

	server.ListenAndServe()
}

func NewApp(staticFilePath string) app {
	fs := http.FileServer(http.Dir(staticFilePath))
	fs = http.StripPrefix("/public/", fs)

	return app{
		fileServer: fs,
	}
}

type app struct {
	fileServer http.Handler
}

func (a app) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if strings.HasPrefix(r.URL.Path, "/public") {
		a.fileServer.ServeHTTP(w, r)
		return
	}

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
	homeView.Render(w, struct{ Name string }{
		Name: "Yass",
	})
}

func contact(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	contactView.Render(w, nil)
}

func notFound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	notFoundView.Render(w, nil)
}
