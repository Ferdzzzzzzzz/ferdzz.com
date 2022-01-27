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

type MagicLink struct {
	UserID    int64 `json:"userID"`
	Exp       int64 `json:"exp"`
	SessionID int64 `json:"sessionId"`
}

type Token struct {
	UserID        int64  `json:"userID"`
	SessionID     int64  `json:"sessionId"`
	RememberToken string `json:"remember_token"`
}

func (s Service) EncryptAuthToken(userID, sessionID int64, rememberToken string) (string, error) {
	token := Token{
		UserID:        userID,
		SessionID:     sessionID,
		RememberToken: rememberToken,
	}

	val, err := json.Marshal(token)
	if err != nil {
		return "", err
	}

	// encrypt.Encrypt returns a base65 URLEncoded string
	encryptedToken, err := s.encrypt.Encrypt(string(val))
	if err != nil {
		return "", err
	}

	return encryptedToken, nil
}

func (s Service) UnencryptAuthToken(encryptedToken string) (Token, error) {
	jsonString, err := s.encrypt.Decrypt(encryptedToken)
	if err != nil {
		return Token{}, err
	}

	token := Token{}

	err = json.Unmarshal([]byte(jsonString), &token)

	if err != nil {
		return Token{}, err
	}

	return token, nil
}

// toString returns a URL encoded string of the magic link [email, exp]
func (s Service) GetNewMagicLink(userID int64, sessionID int64) (string, error) {
	magicLinkVal := MagicLink{
		UserID:    userID,
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

func (s Service) UnencryptMagicLink(link string) (MagicLink, error) {
	jsonString, err := s.encrypt.Decrypt(link)
	if err != nil {
		return MagicLink{}, err
	}

	magicLink := MagicLink{}

	err = json.Unmarshal([]byte(jsonString), &magicLink)

	if err != nil {
		return MagicLink{}, err
	}

	return magicLink, nil
}
