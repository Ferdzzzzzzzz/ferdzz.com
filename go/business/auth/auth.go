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
// MagicLink format: [user@gmail.com,linkExpirationTime,RememberToken?]

type Service struct {
}

const LinkExpirationTime = time.Minute * 5
const SessionExpirationTime = time.Hour * 24 * 7

type Session struct {
	ID                  int64
	Start               int64
	Exp                 int64
	HashedRememberToken string // bcrypt hash
}

type AuthCookie struct {
	Email               string
	SessionID           int64
	HashedRememberToken string
}

type User struct {
	Name          string
	Email         string
	AcountIsSetup bool
}

type MagicLink struct {
	Email     string
	Exp       int64
	SessionID int64
}

// toString returns a URL encoded string of the magic link [email, exp]
func (m MagicLink) toString() string {

	return fmt.Sprintf("%s:%d", m.Email, m.Exp)

	// perhaps return it as a JSON encoded array before encrypting it.
}

// localhost:3000?magicLink=asfdkjh2li34uy9p8y3hlkjhlefla
func (s Service) GetMagicLink(baseURL string) (string, error) {
	expires := time.Now().Add(time.Hour).Unix()

	fmt.Println(expires)
	fmt.Println(time.Unix(expires, 0))

	fmt.Println(time.Now().Add(time.Hour).Before(time.Unix(expires, 0)))
	return "", nil
}

func (s Service) GetUserFromMagicLink(email string, magicLink string) (string, error) {
	// decrypt magicLink
	// unmarshal to [email, exp]
	// if email != email return unauth
	// if link expired return error
	// return user email

	return "", nil
}

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
