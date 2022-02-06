package auth

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/ferdzzzzzzzz/ferdzz/core/encrypt"
)

const (
	LinkExpirationTime    = time.Minute * 5
	SessionExpirationTime = time.Hour * 24 * 7
	AuthTokenCookie       = "auth_token"
	RememberTokenCookie   = "remember_token"

	delimiter = "$"
)

var (
	ErrLinkExpired  = errors.New("the magic link has expired")
	ErrInvalidToken = errors.New("invalid auth token")
	ErrExpiredToken = errors.New("expired auth token")

	ErrInvalidMagicLink = errors.New("invalid magic link")
	ErrExpiredMagicLink = errors.New("expired magic link")
)

type Service struct {
	encryptServices map[uint]*encrypt.Service
	latestKey       uint
	authURL         string
}

func NewService(secretMap map[uint]string, authURL string) (Service, error) {
	var latestKey uint = 0
	encryptServicesMap := make(map[uint]*encrypt.Service)

	for k, v := range secretMap {
		service, err := encrypt.NewService(v)
		if err != nil {
			return Service{}, err
		}

		// the biggest key is the latest key
		encryptServicesMap[k] = service
		if k > latestKey {
			latestKey = k
		}
	}

	return Service{
		encryptServices: encryptServicesMap,
		latestKey:       latestKey,
		authURL:         authURL,
	}, nil
}

type SecretMap = map[uint]string

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

type User struct {
	ID             int64
	Email          string
	AccountIsSetup bool
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

func (s Service) NewToken(
	userID,
	sessionID int64,
	rememberToken string,
) (string, error) {
	token := Token{
		UserID:        userID,
		SessionID:     sessionID,
		RememberToken: rememberToken,
	}

	val, err := json.Marshal(token)
	if err != nil {
		return "", err
	}

	encryptionService, ok := s.encryptServices[s.latestKey]
	if !ok {
		return "", errors.New("encryption service not found, this should not happen")
	}

	encryptedToken, err := encryptionService.Encrypt(string(val))
	if err != nil {
		return "", err
	}

	// encode token in format: [key]$[encrypted value]
	encodedToken := base64.URLEncoding.EncodeToString([]byte(fmt.Sprintf("%d$%s", s.latestKey, encryptedToken)))

	return encodedToken, nil
}

func (s Service) UnencryptToken(encodedToken string) (Token, error) {
	jointToken, err := base64.URLEncoding.DecodeString(encodedToken)
	if err != nil {
		return Token{}, ErrInvalidToken
	}

	result := strings.SplitN(string(jointToken), delimiter, 2)
	if len(result) != 2 {
		return Token{}, ErrInvalidToken
	}

	keyStr := result[0]
	encryptedToken := result[1]

	key, err := strconv.ParseUint(keyStr, 10, 32)
	if err != nil {
		return Token{}, ErrInvalidToken
	}

	encryptionService, ok := s.encryptServices[uint(key)]
	if !ok {
		return Token{}, ErrInvalidToken
	}

	jsonString, err := encryptionService.Decrypt(encryptedToken)
	if err != nil {
		return Token{}, ErrInvalidToken
	}

	token := Token{}
	err = json.Unmarshal([]byte(jsonString), &token)

	if err != nil {
		return Token{}, ErrInvalidToken
	}

	return token, nil
}

// GetMagicLink returns a MagicLink that is:
//		* 	marshalled to JSON
//		*	encrypted
//		*	base64 URL encoded
//		*	appended to the authURL and return
func (s Service) GetMagicLink(userID int64, sessionID int64) (string, error) {
	magicLinkVal := MagicLink{
		UserID:    userID,
		Exp:       time.Now().Add(LinkExpirationTime).Unix(),
		SessionID: sessionID,
	}

	val, err := json.Marshal(magicLinkVal)
	if err != nil {
		return "", err
	}

	encryptionService, ok := s.encryptServices[s.latestKey]
	if !ok {
		return "", errors.New("could not find encryption service for latest key, this should not be happening")
	}

	encryptedVal, err := encryptionService.Encrypt(string(val))
	if err != nil {
		return "", err
	}

	valueToEncode := fmt.Sprintf("%d$%s", s.latestKey, encryptedVal)
	encodedVal := base64.URLEncoding.EncodeToString([]byte(valueToEncode))

	url := s.authURL + encodedVal

	return url, nil
}

// UnencryptMagicLink receives a MagicLink and:
//		*	base64 decode to string
//		*	decrypts
//		*	unmarshals it from json
//		* 	return MagicLink struct
func (s Service) UnmarshalMagicLink(link string) (MagicLink, error) {
	unencodedLink, err := base64.URLEncoding.DecodeString(link)
	if err != nil {
		return MagicLink{}, ErrInvalidMagicLink
	}

	result := strings.SplitN(string(unencodedLink), delimiter, 2)
	if len(result) != 2 {
		return MagicLink{}, ErrInvalidMagicLink
	}

	keyStr := result[0]
	encryptedValue := result[1]

	key, err := strconv.ParseUint(keyStr, 10, 32)
	if err != nil {
		return MagicLink{}, ErrInvalidMagicLink
	}

	encryptionService, ok := s.encryptServices[uint(key)]
	if !ok {
		return MagicLink{}, ErrInvalidMagicLink
	}

	jsonString, err := encryptionService.Decrypt(encryptedValue)
	if err != nil {
		return MagicLink{}, ErrInvalidMagicLink
	}

	magicLink := MagicLink{}

	err = json.Unmarshal([]byte(jsonString), &magicLink)
	if err != nil {
		return MagicLink{}, err
	}

	linkExp := time.Unix(magicLink.Exp, 0)
	now := time.Now()

	// helper sentence:
	// -> if now is after the magic link exp time we should return an error
	if now.After(linkExp) {
		return MagicLink{}, ErrExpiredMagicLink
	}

	return magicLink, nil
}

// ReadSecretsFromJson accepts a file path as a parameter and returns a key->val
// map, of type uint->string, and an error.
//
// Requirements:
//			* 	secret should be exactly 32bytes
//			* 	key should be a uint (preferrably incremented by one from the
//				previous key)
func ReadSecretsFromJson(path string) (SecretMap, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	defer file.Close()

	fileContent, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	secretsMap := make(map[uint]string, 0)
	err = json.Unmarshal(fileContent, &secretsMap)

	if err != nil {
		return nil, err
	}

	for _, v := range secretsMap {
		valueByteLength := len([]byte(v))
		if valueByteLength != 32 {
			return nil, fmt.Errorf("failed to parse secret, expected the secret to be 32 bytes, but got: %dbytes", valueByteLength)
		}
	}

	return secretsMap, nil
}
