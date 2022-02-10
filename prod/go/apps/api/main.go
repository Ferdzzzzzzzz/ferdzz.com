package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

var build = "develop"

func main() {
	err := run()

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func run() error {
	fmt.Println(build)

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGINT, syscall.SIGTERM)

	server := http.Server{
		Addr: ":80",
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			fmt.Fprint(w, "Hello World")
		}),
	}

	fmt.Println("listening at :80")

	serverErrors := make(chan error, 1)

	go func() {
		serverErrors <- server.ListenAndServe()
	}()

	select {
	case err := <-serverErrors:
		return err

	case <-shutdown:
		ctx, cancel := context.WithTimeout(context.Background(), time.Second)
		defer cancel()

		err := server.Shutdown(ctx)
		if err != nil {
			server.Close()
			return err
		}
	}

	return nil
}
