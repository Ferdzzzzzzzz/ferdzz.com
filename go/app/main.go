package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"syscall"
	"time"

	"github.com/ardanlabs/conf"
	"github.com/ferdzzzzzzzz/ferdzz/app/handlers"
	"github.com/ferdzzzzzzzz/ferdzz/business/auth"
	"github.com/ferdzzzzzzzz/ferdzz/core/encrypt"
	"github.com/ferdzzzzzzzz/ferdzz/core/logger"
	"github.com/ferdzzzzzzzz/ferdzz/data/neo"
	"go.uber.org/automaxprocs/maxprocs"
	"go.uber.org/zap"
)

// build is the git version of this program. It is set using build flags in the
// makefile.
var build = "develop"

func main() {
	// add flag to allow unstructured logs
	sugar := logger.NewDev("ferdzz.com")

	defer sugar.Sync()

	err := run(sugar)
	if err != nil {
		sugar.Errorw("startup error", "ERROR", err)
		os.Exit(1)
	}
}

func run(log *zap.SugaredLogger) error {

	// =========================================================================
	// GOMAXPROCS

	// Want to see what maxprocs reports.
	opt := maxprocs.Logger(log.Infof)

	// Set the correct number of threads for the service
	// based on what is available either by the machine or quotas.
	_, err := maxprocs.Set(opt)
	if err != nil {
		return fmt.Errorf("maxprocs: %w", err)
	}
	log.Infow("startup", "GOMAXPROCS", runtime.GOMAXPROCS(0))

	// =========================================================================
	// Open Encryption Secrets

	// =========================================================================
	// Configuration

	cfg := struct {
		Web struct {
			ReadTimeout     time.Duration `conf:"default:5s"`
			WriteTimeout    time.Duration `conf:"default:10s"`
			IdleTimeout     time.Duration `conf:"default:120s"`
			ShutdownTimeout time.Duration `conf:"default:20s"`
			APIHost         string        `conf:"default:0.0.0.0:3000"`
		}
		Auth struct {
			ClientAuthURL string `conf:"default:http://localhost:8787/signin?token="`
		}
		Neo4j struct {
			Host     string `conf:"default:bolt://localhost:7687"`
			User     string `conf:"default:neo4j"`
			Password string `conf:"default:password,mask"`
		}
	}{}

	devMode := flag.Bool("dev", false, "run application in development mode")
	flag.Parse()

	if *devMode {
		log.Warn("================================================================")
		log.Warn("Development Mode Enabled")
		log.Warn("================================================================")
	}

	const prefix = "FERDZZ"
	help, err := conf.ParseOSArgs(prefix, &cfg)
	if err != nil {
		if errors.Is(err, conf.ErrHelpWanted) {
			fmt.Println(help)
			return nil
		}
		return fmt.Errorf("parsing config: %w", err)
	}

	// =========================================================================
	// App Starting

	log.Infow("starting service", "version", build)
	defer log.Infow("shutdown complete")

	out, err := conf.String(&cfg)
	if err != nil {
		return fmt.Errorf("generating config for output: %w", err)
	}

	if *devMode {
		fmt.Printf("\n%s\n\n", out)
	} else {
		log.Infow("startup", "config", out)
	}

	// =========================================================================
	// Database Support

	// Create connectivity to the database.
	log.Infow("startup", "status", "initializing database support", "host", cfg.Neo4j.Host)

	// neoDriver, err := neo.NewDriver(cfg.Neo4j.Host, cfg.Neo4j.User, cfg.Neo4j.Password)
	neoDriver, err := neo.NewDriver(cfg.Neo4j.Host, cfg.Neo4j.User, cfg.Neo4j.Password)

	if err != nil {
		return fmt.Errorf("connecting to db: %w", err)
	}

	connectionErr := neoDriver.VerifyConnectivity()
	if connectionErr != nil {
		return fmt.Errorf("connecting to db: %w", connectionErr)
	}

	defer func() {
		log.Infow("shutdown", "status", "stopping database support", "host", cfg.Neo4j.Host)
		neoDriver.Close()
	}()

	// =========================================================================
	// Initialise Auth Service

	encrypt, err := encrypt.NewService(cfg.Auth.Secret)
	if err != nil {
		return err
	}

	authService := auth.NewService(encrypt, cfg.Auth.ClientAuthURL)

	// =========================================================================
	// Start API Service

	log.Infow("startup", "status", "initializing V1 API support")

	// Make a channel to listen for an interrupt or terminate signal from OS.
	// Use a buffered channel because the signal package requires it

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGINT, syscall.SIGTERM)

	// Construct a mux for the api calls.
	apiMux := handlers.APIMux(handlers.APIMuxConfig{
		Shutdown:    shutdown,
		Log:         log,
		CorsOrigin:  "*",
		DevMode:     *devMode,
		DB:          neoDriver,
		AuthService: authService,
	})

	// Construct a server to service the requests against the mux.
	api := http.Server{
		Addr:         cfg.Web.APIHost,
		Handler:      apiMux,
		ReadTimeout:  cfg.Web.ReadTimeout,
		WriteTimeout: cfg.Web.WriteTimeout,
		IdleTimeout:  cfg.Web.IdleTimeout,
		ErrorLog:     zap.NewStdLog(log.Desugar()),
	}

	// Make a channel to listen for errors coming from the listener. Use a
	// buffered channel so the goroutine can exit if we don't collect this
	// error.
	serverErrors := make(chan error, 1)

	// Start the service listening for api requests

	go func() {
		log.Infow("startup", "status", "api router started", "host", api.Addr)
		serverErrors <- api.ListenAndServe()
	}()

	// =========================================================================
	// Shutdown

	// Blocking main and waiting for shutdown.

	select {
	case err := <-serverErrors:
		return fmt.Errorf("server error: %w", err)

	case sig := <-shutdown:
		log.Infow("shutdown", "status", "shutdown started", "signal", sig)
		defer log.Infow("shutdown", "status", "shutdown complete", "signal", sig)

		// Give outstanding requests a deadline for completion.
		ctx, cancel := context.WithTimeout(context.Background(), cfg.Web.ShutdownTimeout)
		defer cancel()

		// Asking listener to shut down and shed load.
		err := api.Shutdown(ctx)
		if err != nil {
			api.Close()
			return fmt.Errorf("could not stop server gracefully: %w", err)
		}
	}

	return nil
}
