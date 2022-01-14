package auth

import (
	"fmt"
	"time"
)

type Store interface {
}

// Implement Magic Link
//
// Build Auth Service for Encryption and Decryption
// Auth Service should manage pairs of public-private keys in memory
// MagicLink format: [user@gmail.com,linkExpirationTime,
// Create URL (video: 1h5+)

type Service struct {
}

const linkExpirationTime = time.Hour
const sessionExpirationTime = time.Hour * 24 * 7

type Session struct {
	ID    string
	Start int64
	Exp   int64
}

type User struct {
	Name  string
	Email string
}

type MagicLink struct {
	ID  string
	Exp int64
}

func (s Service) GetMagicLink() {
	expires := time.Now().Add(time.Hour).Unix()

	fmt.Println(expires)
	fmt.Println(time.Unix(expires, 0))

	fmt.Println(time.Now().Add(time.Hour).Before(time.Unix(expires, 0)))
}

func (s Service) GetUserFromMagicLink() {}

func (s Service) GetUserByID() {

}

func (s Service) GetUserByEmail() {}

func (s Service) CreateNewUser() {}

func (s Service) UpdateUser() {}

func (s Service) DeleteUserSession() {}

// func (s Service)

func (m MagicLink) Encrypt() string {

	return ""
}

func (m MagicLink) Decrypt() string {
	return ""
}
