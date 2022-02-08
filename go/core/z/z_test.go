package z_test

import (
	"strings"
	"testing"

	"github.com/ferdzzzzzzzz/ferdzz/core/is"
	"github.com/ferdzzzzzzzz/ferdzz/core/z"
)

type User struct {
	Name      string
	Age       int
	Activated bool
}

const (
	userString = `{
		"Name": "Ferdz",
		"Age": 25,
		"Activated": true
	}`
)

func TestStrictJSONParse(t *testing.T) {
	t.Run("flat struct", func(t *testing.T) {

		reader := strings.NewReader(userString)

		u := User{}

		err := z.StrictJSONParse(reader, u)
		is.NotErr(t, err)

		want := User{
			Name:      "Ferdz",
			Age:       25,
			Activated: true,
		}

		is.Equal(t, want, &u)

	})
}

// benchmark compared to stdlib
