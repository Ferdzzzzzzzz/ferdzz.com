package z

import "html/template"

// ParseTemplateOrPanic parses an HTML template or panic's, this is useful when
// the parsing should happen at startup, and there absolutely should not be a
// failure
func ParseTemplateOrPanic(files ...string) *template.Template {
	t, err := template.ParseFiles(files...)
	if err != nil {
		panic("failed to parse files")
	}

	return t
}
