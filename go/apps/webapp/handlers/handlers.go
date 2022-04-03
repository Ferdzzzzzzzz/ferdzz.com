package handlers

import (
	"fmt"
	"net/http"
	"os"

	view "github.com/ferdzzzzzzzz/ferdzz.com/go/apps/webapp/views"
	"github.com/ferdzzzzzzzz/ferdzz.com/go/core/web"
)

var viewPath = "./apps/webapp/views/"
var staticFilePath = "./apps/webapp/public/"

var (
	homeView     *view.View
	writingView  *view.View
	contactView  *view.View
	signupView   *view.View
	notFoundView *view.View
)

func NewRouter() http.Handler {
	tempTemplateDir := os.Getenv("TEMPLATE_VIEWS_DIR")
	if tempTemplateDir != "" {
		viewPath = tempTemplateDir
	}

	homeView = view.NewView(viewPath, "default", viewPath+"home.html")
	writingView = view.NewView(viewPath, "default", viewPath+"writing.html")
	contactView = view.NewView(viewPath, "default", viewPath+"contact.html")
	signupView = view.NewView(viewPath, "default", viewPath+"signup.html")
	notFoundView = view.NewView(viewPath, "default", viewPath+"notFound.html")

	app := web.NewApp(web.AppOptions{
		StaticFileServer: struct {
			StaticFilePath string
			PublicAPIRoute string
		}{
			StaticFilePath: staticFilePath,
			PublicAPIRoute: "public",
		},
	})

	app.GET("/", home)
	app.GET("/blog", blog)
	app.GET("/writing", writing)
	app.GET("/contact", contact)

	app.GET("/signup", signupGET)
	app.POST("/signup", signupPOST)

	app.NotFoundHandler = notFound

	return app
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

var homePageData = homePage{
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

func home(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "text/html")
	homeView.Render(w, homePageData)
}

func writing(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	writingView.Render(w, homePageData)
}

func blog(w http.ResponseWriter, r *http.Request) {

	http.Redirect(w, r, "/wut", http.StatusMovedPermanently)
}

func signupPOST(w http.ResponseWriter, r *http.Request) {
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
}

func signupGET(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "text/html")
	signupView.Render(w, struct{ MyVal string }{})

}

func contact(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	contactView.Render(w, nil)
}

func notFound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	notFoundView.Render(w, nil)
}
