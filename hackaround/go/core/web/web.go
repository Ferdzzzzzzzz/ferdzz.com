// Package web contains a small web framework
package web

import (
	"context"
	"net/http"
	"os"
	"syscall"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type Handler = func(
	ctx context.Context,
	w http.ResponseWriter,
	r *http.Request,
) error

// App is the entrypoint into our application and what configures our context
// object for each of our http handlers.
type App struct {
	mux      *mux.Router
	shutdown chan os.Signal
	devMode  bool
	mw       []Middleware
	devMw    []Middleware
}

// NewApp creates an App value that handles a set of routes for the application.
func NewApp(shutdown chan os.Signal, devMode bool, mw ...Middleware) *App {
	return &App{
		mux:      mux.NewRouter(),
		shutdown: shutdown,
		devMode:  devMode,
		mw:       mw,
	}
}

// DevMiddleware adds dev helper middleware. The middleware only gets added if
// the app is in dev mode. Dev middleware is wrapped on the outer-most layer so
// as to not interfere with the internal middleware
func (a *App) DevMiddleware(mw ...Middleware) {
	a.devMw = mw
}

// SignalShutdown is used to gracefully shutdown the app when an integrity issue
// is identified.
func (a *App) SignalShutdown() {
	a.shutdown <- syscall.SIGTERM
}

// ServeHTTP implements the http.Handler interface. It's the entry point for
// all http traffic.
func (a *App) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	a.mux.ServeHTTP(w, r)
}

// Handle sets a handler function for a given HTTP method and path pair
// to the application server mux.
func (a *App) Handle(method string, path string, handler Handler, mw ...Middleware) {

	handler = wrapMiddleware(mw, handler)
	handler = wrapMiddleware(a.mw, handler)

	if a.devMode {
		handler = wrapMiddleware(a.devMw, handler)
	}

	h := func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		v := Values{
			TraceID: uuid.New().String(),
			Now:     time.Now(),
		}

		ctx = context.WithValue(ctx, key, &v)

		err := handler(ctx, w, r)
		if err != nil {
			a.SignalShutdown()
			return
		}
	}

	a.mux.HandleFunc(path, h).Methods(method)
}

func (a *App) ServeFiles(path string, mw ...Middleware) {

	handler := func(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
		fs := http.FileServer(http.Dir(path))
		fs.ServeHTTP(w, r)
		return nil
	}

	handler = wrapMiddleware(mw, handler)
	handler = wrapMiddleware(a.mw, handler)

	h := func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		v := Values{
			TraceID: uuid.New().String(),
			Now:     time.Now(),
		}

		ctx = context.WithValue(ctx, key, &v)

		err := handler(ctx, w, r)
		if err != nil {
			a.SignalShutdown()
			return
		}
	}

	a.mux.PathPrefix("/public").Handler(http.StripPrefix("/public/", http.HandlerFunc(h)))
}