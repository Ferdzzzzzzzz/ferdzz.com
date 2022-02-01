package encrypt

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"io"
)

// we track the latest key so that the user of the api doesn't need to know what
// to use for encryption
type Service struct {
	gcm cipher.AEAD
}

// https://tutorialedge.net/golang/go-encrypt-decrypt-aes-tutorial/
func NewService(secret string) (*Service, error) {

	c, err := aes.NewCipher([]byte(secret))
	if err != nil {
		return &Service{}, err
	}

	gcm, err := cipher.NewGCM(c)
	if err != nil {
		return &Service{}, err
	}

	return &Service{
		gcm: gcm,
	}, nil
}

func (s Service) Encrypt(val string) (string, error) {

	text := []byte(val)

	nonce := make([]byte, s.gcm.NonceSize())

	_, err := io.ReadFull(rand.Reader, nonce)
	if err != nil {
		return "", err
	}

	encryptedValue := s.gcm.Seal(nonce, nonce, text, nil)

	encodedValue := base64.URLEncoding.EncodeToString(encryptedValue)

	return encodedValue, nil
}

func (s Service) Decrypt(val string) (string, error) {

	text, err := base64.URLEncoding.DecodeString(val)
	if err != nil {
		return "", err
	}

	nonceSize := s.gcm.NonceSize()
	if len(text) < nonceSize {
		return "", err
	}

	nonce, ciphertext := text[:nonceSize], text[nonceSize:]
	plaintext, err := s.gcm.Open(nil, nonce, ciphertext, nil)

	if err != nil {
		return "", err
	}

	return string(plaintext), nil

}
