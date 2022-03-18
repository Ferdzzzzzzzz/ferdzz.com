package encrypt_test

import (
	"encoding/base64"
	"testing"

	"github.com/ferdzzzzzzzz/ferdzz.com/go/core/encrypt"
	"github.com/ferdzzzzzzzz/ferdzz.com/go/core/is"
)

const (
	TestEncryptSecret     = "thishastobe32bytesforittowork!:)"
	RandomString          = "somerandomstring"
	RandomStringEncrypted = "n9CYLKwNqOY1-M1Kix9de7YhZM17xZ5NTxFh5OL9d1AnVulyRPjr48VSHTg="
)

// Nothing else we can test here
func TestEncrypt(t *testing.T) {
	service, err := encrypt.NewService(TestEncryptSecret)
	is.NotErr(t, err)

	encrypted, err := service.Encrypt(RandomString)
	is.NotErr(t, err)

	out := base64.URLEncoding.EncodeToString([]byte(encrypted))

	t.Log(out)
}

func TestDecrypt(t *testing.T) {
	service, err := encrypt.NewService(TestEncryptSecret)
	is.NotErr(t, err)

	unencoded, err := base64.URLEncoding.DecodeString(RandomStringEncrypted)
	is.NotErr(t, err)

	got, err := service.Decrypt(string(unencoded))
	is.NotErr(t, err)

	want := RandomString
	is.Equal(t, want, got)
}

func TestBothWays(t *testing.T) {
	service, err := encrypt.NewService(TestEncryptSecret)
	is.NotErr(t, err)

	encryptedString, err := service.Encrypt(RandomString)
	is.NotErr(t, err)

	got, err := service.Decrypt(encryptedString)
	is.NotErr(t, err)

	want := RandomString
	is.Equal(t, want, got)
}
