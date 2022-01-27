package auth

import (
	"encoding/json"
	"errors"
	"time"

	"github.com/ferdzzzzzzzz/ferdzz/core/encrypt"
)

const (
	LinkExpirationTime    = time.Minute * 5
	SessionExpirationTime = time.Hour * 24 * 7
)

var (
	ErrLinkExpired = errors.New("the magic link has expired")
)

type Service struct {
	encrypt encrypt.Service
	authURL string
}

func NewService(encrypt encrypt.Service, authURL string) Service {
	return Service{
		encrypt: encrypt,
		authURL: authURL,
	}
}

type Session struct {
	ID                  int64
	Start               int64
	Exp                 int64
	HashedRememberToken string // bcrypt hash
	Activated           bool
}

func NewSession(rememberToken string) Session {
	return Session{
		Start:               time.Now().Unix(),
		Exp:                 time.Now().Add(SessionExpirationTime).Unix(),
		HashedRememberToken: rememberToken,
	}
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

type magicLinkVal struct {
	Email     string `json:"email"`
	Exp       int64  `json:"exp"`
	SessionID int64  `json:"sessionId"`
}

// toString returns a URL encoded string of the magic link [email, exp]
func (s Service) GetMagicLink(email string, sessionID int64) (string, error) {
	magicLinkVal := magicLinkVal{
		Email:     email,
		Exp:       time.Now().Add(LinkExpirationTime).Unix(),
		SessionID: sessionID,
	}

	val, err := json.Marshal(magicLinkVal)
	if err != nil {
		return "", err
	}

	// encrypt.Encrypt returns a base65 URLEncoded string
	link, err := s.encrypt.Encrypt(string(val))
	if err != nil {
		return "", err
	}

	url := s.authURL + link

	return url, nil
}
