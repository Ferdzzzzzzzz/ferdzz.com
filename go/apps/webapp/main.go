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

var (
	homeView     *view.View
	contactView  *view.View
	signupView   *view.View
	notFoundView *view.View
)

func main() {
	tempTemplateDir := os.Getenv("TEMPLATE_VIEWS_DIR")
	if tempTemplateDir != "" {
		viewPath = tempTemplateDir
	}

	homeView = view.NewView(viewPath, "default", viewPath+"home.html")
	contactView = view.NewView(viewPath, "default", viewPath+"contact.html")
	signupView = view.NewView(viewPath, "default", viewPath+"signup.html")
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
	case "/blog":
		blog(w, r)
	case "/contact":
		contact(w, r)
	case "/signup":
		signup(w, r)
	default:
		notFound(w, r)
	}
}

type Post struct {
	ID          string
	Title       string
	Date        string
	Description string
}

type homePage struct {
	Posts []Post
}

func home(w http.ResponseWriter, r *http.Request) {
	homePage := homePage{
		Posts: []Post{{
			ID:          "1234",
			Title:       "From the server!!!",
			Date:        "15/03/2022",
			Description: "This describes the post in slightly more detail.",
		},
			{
				ID:          "2345",
				Title:       "Some other Post",
				Date:        "12/03/2022",
				Description: "This is a lorem ipsum type thing that says some things about the thing",
			},
			{
				ID:          "3456",
				Title:       "Some other Post",
				Date:        "01/03/2022",
				Description: "This is a lorem ipsum type thing that says some things about the thing",
			},
		},
	}

	w.Header().Set("Content-Type", "text/html")
	homeView.Render(w, homePage)
}

func blog(w http.ResponseWriter, r *http.Request) {

	http.Redirect(w, r, "/wut", http.StatusMovedPermanently)
}

func signup(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {

		err := r.ParseForm()
		if err != nil {
			fmt.Println(err)
			return
		}

		w.WriteHeader(302)

		w.Header().Add("Path", "/about")

		fmt.Fprint(w, "<p>ja ja</p>")

		formData := struct {
			Email    string `validate:"require,email"`
			Password string `validate:"require"`
		}{
			Email:    r.PostForm.Get("Email"),
			Password: r.PostForm.Get("Password"),
		}

		fmt.Println(formData)

	} else if r.Method == http.MethodGet {
		w.Header().Set("Content-Type", "text/html")
		signupView.Render(w, struct{ MyVal string }{})
	}
}

func contact(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	contactView.Render(w, nil)
}

func notFound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	notFoundView.Render(w, nil)
}
