package auth_test

import (
	"encoding/base64"
	"strconv"
	"strings"
	"testing"

	"github.com/ferdzzzzzzzz/ferdzz/business/auth"
	"github.com/ferdzzzzzzzz/ferdzz/core/is"
)

const (
	TestFilePath     = "./test.json"
	BadTestFilePath  = "./bad_test_1.json"
	BadTestFilePath2 = "./bad_test_2.json"

	// key=2
	AuthToken     = "MiSEe-hcx-iwfdnF7t6VZfi04sqnqW8pQPpTENm5WRx6cfoSLDsR6f9eKUEAXjapMEB8-Pis8cQZfVSaOOxl5Gba_oo4vGFj1yXYpiATq4P76YjoyMm5MRWGSFY_5S30B7NGkssJcfl1nPPJmnxjyGnN-GGxPneZ"
	RememberToken = "4w_hILpzPiTPrgtp6qFoQPSBbLlo3GHyO4GoxItLjZA="
)

var (
	want = map[uint]string{
		1: "thishastobethirtytwobytestowork!",
		2: "thisalsohastobetheexactsamebytes",
	}
)

func TestReadSecretsFromJson(t *testing.T) {
	t.Log("Read secrets from JSON:")

	t.Run("File read success", func(t *testing.T) {
		got, err := auth.ReadSecretsFromJson(TestFilePath)
		is.NotErr(t, err)

		is.Equal(t, want, got)
	})

	t.Run("Should fail if the secret is not 32bytes", func(t *testing.T) {
		_, err := auth.ReadSecretsFromJson(BadTestFilePath)
		is.NotNil(t, err)
	})

	t.Run("Should fail if keys are not of type uint", func(t *testing.T) {
		_, err := auth.ReadSecretsFromJson(BadTestFilePath2)
		is.NotNil(t, err)
	})

}

func TestAuthService(t *testing.T) {
	t.Log("auth.Service")

	service, err := auth.NewService(want, "http://localhost:3000")
	is.NotErr(t, err)

	t.Run(
		"NewToken should return a new auth token encrypted with the latest key",
		func(t *testing.T) {
			is.NotErr(t, err)

			token, err := service.NewToken(1, 2, RememberToken)
			is.NotErr(t, err)

			unencodedToken, err := base64.URLEncoding.DecodeString(token)
			is.NotErr(t, err)

			result := strings.SplitN(string(unencodedToken), "$", 2)
			key, err := strconv.ParseUint(string(result[0]), 10, 32)
			is.NotErr(t, err)

			want := uint(2)
			got := uint(key)

			is.Equal(t, want, got)
		},
	)

	t.Run(
		"UnencryptToken should receive and encrypted & encoded token and return a Token struct",
		func(t *testing.T) {
			token, err := service.UnencryptToken(AuthToken)
			is.NotErr(t, err)

			is.Equal(t, RememberToken, token.RememberToken)
			is.Equal(t, int64(1), token.UserID)
			is.Equal(t, int64(2), token.SessionID)

		},
	)

	t.Run(
		"UnencryptToken should return ErrInvalidToken if the auth token is invalid",
		func(t *testing.T) {
			_, err = service.UnencryptToken(AuthToken[:len(AuthToken)-1])

			is.ErrIs(t, err, auth.ErrInvalidToken)
		},
	)

}
