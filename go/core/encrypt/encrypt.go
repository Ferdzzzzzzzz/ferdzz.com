package encrypt

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"errors"
	"io"
)

type Service struct {
	gcm cipher.AEAD
}

// https://tutorialedge.net/golang/go-encrypt-decrypt-aes-tutorial/
func NewService(secret string) (Service, error) {

	c, err := aes.NewCipher([]byte(secret))
	if err != nil {
		return Service{}, err
	}

	gcm, err := cipher.NewGCM(c)

	if err != nil {
		return Service{}, err
	}

	return Service{
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

	return string(encryptedValue), nil
}

func (s Service) Decrypt(val string) (string, error) {

	text := []byte(val)

	nonceSize := s.gcm.NonceSize()
	if len(text) < nonceSize {
		return "", errors.New("invalid encrypted value")
	}

	nonce, ciphertext := text[:nonceSize], text[nonceSize:]
	plaintext, err := s.gcm.Open(nil, nonce, ciphertext, nil)

	if err != nil {
		return "", err
	}

	return string(plaintext), nil

}
