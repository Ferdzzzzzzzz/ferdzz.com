package rand

import (
	"crypto/rand"
	"encoding/base64"
)

const RememberTokenBytes = 32

// RememberToken is a helper function designed to generate remember tokens of a
// predetermined byte size.
func RememberToken() (string, error) {
	return String(RememberTokenBytes)
}

// String will generate a byte slice of size nBytes and then return a string
// that is the base64 URL encoded version of that byte slice
func String(nBytes int) (string, error) {
	b, err := bytes(nBytes)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

// bytes will help us generate n random bytes, or return an error if there was
// one. This uses the crypto/rand package so it is safe to use with  things like
// remember tokens.
func bytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		return nil, err
	}
	return b, nil
}
