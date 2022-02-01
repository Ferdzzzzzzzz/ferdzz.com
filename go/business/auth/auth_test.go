package auth_test

import (
	"testing"

	"github.com/ferdzzzzzzzz/ferdzz/business/auth"
	"github.com/ferdzzzzzzzz/ferdzz/core/is"
)

const (
	TestFilePath = "./test.json"
)

var (
	want = map[string]string{
		"color": "blue",
		"city":  "cape town",
	}
)

func TestReadSecretsFromJson(t *testing.T) {
	got, err := auth.ReadSecretsFromJson(TestFilePath)
	is.NotErr(t, err)

	is.Equal(t, want, got)
}
