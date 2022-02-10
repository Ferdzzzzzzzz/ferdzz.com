package encrypt_test

import (
	"testing"

	"github.com/ferdzzzzzzzz/ferdzz/core/encrypt"
	"github.com/ferdzzzzzzzz/ferdzz/core/is"
)

const (
	TestEncryptSecret     = "thishastobe32bytesforittowork!:)"
	RandomString          = "somerandomstring"
	RandomStringEncrypted = "pAb8U1cIAJwW9hEf1kzgPbsmBERqvptsJO5d8rTt_enqVBWKtJUi_BcOW_o="
)

// Nothing else we can test here
func TestEncrypt(t *testing.T) {
	service, err := encrypt.NewService(TestEncryptSecret)
	is.NotErr(t, err)

	_, err = service.Encrypt(RandomString)
	is.NotErr(t, err)
}

func TestDecrypt(t *testing.T) {
	service, err := encrypt.NewService(TestEncryptSecret)
	is.NotErr(t, err)

	got, err := service.Decrypt(RandomStringEncrypted)
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
