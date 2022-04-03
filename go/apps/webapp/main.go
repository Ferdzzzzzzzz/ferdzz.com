package main

import (
	"net/http"
	"os"

	"github.com/ferdzzzzzzzz/ferdzz.com/go/apps/webapp/handlers"

	"github.com/ferdzzzzzzzz/ferdzz.com/go/core/logger"
	"go.uber.org/zap"
)

const port = ":80"

// build is the git version of this program. It is set using build flags in the makefile.
var build = "develop"

func main() {
	log := logger.New("FERDZZ")
	defer log.Sync()

	err := run(log)

	if err != nil {
		log.Errorw("startup", "ERROR", err)
		log.Sync()
		os.Exit(1)
	}
}

func run(log *zap.SugaredLogger) error {

	log.Infof("listening on port %s\n", port)

	app := handlers.NewRouter()

	server := http.Server{
		Addr:    port,
		Handler: app,
	}

	server.ListenAndServe()

	return nil
}
