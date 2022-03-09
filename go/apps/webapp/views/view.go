package view

import (
	"html/template"

	"github.com/ferdzzzzzzzz/ferdzz.com/go/core/u"
)

type View struct {
	Template *template.Template
	Layout   string
}

func NewView(layoutPath, layout string, files ...string) *View {
	files = append(
		files,
		layoutPath+"footer.html",
		layoutPath+"default.html",
	)
	t, err := template.ParseFiles(files...)
	u.PanicIfErr(err)

	return &View{
		Template: t,
		Layout:   layout,
	}
}
