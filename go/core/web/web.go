package web

import (
	"net/http"

	"github.com/dimfeld/httptreemux"
)

type App struct {
	*httptreemux.ContextMux
}

type AppOptions struct {
	StaticFileServer struct {
		StaticFilePath string
		PublicAPIRoute string
	}
}

func NewApp(options AppOptions) *App {

	router := httptreemux.NewContextMux()

	if options.StaticFileServer.StaticFilePath != "" {
		fs := http.FileServer(http.Dir(options.StaticFileServer.StaticFilePath))
		fs = http.StripPrefix("/"+options.StaticFileServer.PublicAPIRoute+"/", fs)

		router.GET("/"+options.StaticFileServer.PublicAPIRoute+"/:file", fs.ServeHTTP)
	}

	return &App{router}
}
