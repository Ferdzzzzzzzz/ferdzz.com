package view

import (
	"html/template"
	"net/http"
	"path/filepath"

	"github.com/ferdzzzzzzzz/ferdzz.com/go/core/u"
)

const (
	LayoutDir   = "layouts/"
	TemplateExt = ".html"
)

type View struct {
	template *template.Template
	layout   string
}

func (v View) Render(w http.ResponseWriter, data interface{}) {
	err := v.template.ExecuteTemplate(w, v.layout, data)
	u.PanicIfErr(err)
}

func (v View) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	v.Render(w, nil)
}

func NewView(uiPath, layout string, files ...string) *View {
	files = append(files, layoutFiles(uiPath)...)
	t, err := template.ParseFiles(files...)
	u.PanicIfErr(err)

	return &View{
		template: t,
		layout:   layout,
	}
}

func layoutFiles(uiDir string) []string {
	files, err := filepath.Glob(uiDir + LayoutDir + "*" + TemplateExt)
	u.PanicIfErr(err)

	return files
}
