package handlers

import (
	"context"
	"html/template"
	"net/http"
)

type viewRoutes struct {
	homeTemplate *template.Template
}

func newViewRoutes() viewRoutes {
	home := parseOrPanic("ui/views/home.html")

	return viewRoutes{
		homeTemplate: home,
	}
}

func (v viewRoutes) home(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	err := v.homeTemplate.Execute(w, nil)
	if err != nil {
		return err
	}

	return nil
}

func parseOrPanic(file string) *template.Template {
	t, err := template.ParseFiles(file)
	if err != nil {
		panic("failed to parse file " + file)
	}

	return t
}
