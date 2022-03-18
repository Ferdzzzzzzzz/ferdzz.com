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
	"sync"
	"time"

	"github.com/ferdzzzzzzzz/ferdzz.com/go/core/encrypt"
	"github.com/ferdzzzzzzzz/ferdzz.com/go/core/hash"
	"github.com/ferdzzzzzzzz/ferdzz.com/go/core/rand"
	"github.com/ferdzzzzzzzz/ferdzz.com/go/core/validate"
	"github.com/google/uuid"
)

const (
	AuthSessionExpirationTime       = time.Hour * 24 * 7
	AuthSessionRefreshThreshold     = time.Hour * 24 * 2
	PasswordResetLinkExpirationTime = time.Minute * 5

	SessionTypeAuth          = "auth"
	SessionTypePasswordReset = "password_reset"

	AuthTokenCookie = "auth_token"

	delimiter = "$"
)

var (
	ErrInvalidPassword  = errors.New("invalid password")
	ErrLinkExpired      = errors.New("the magic link has expired")
	ErrInvalidToken     = errors.New("invalid auth token")
	ErrExpiredToken     = errors.New("expired auth token")
	ErrInvalidMagicLink = errors.New("invalid magic link")
	ErrExpiredMagicLink = errors.New("expired magic link")
)

type Service struct {
	mu                   sync.Mutex
	latestSecretKey      uint
	secretIdToEncryptMap map[uint]encrypt.Service
	authURL              string
}

type Token struct {
	UserID        string `validate:"required,uuid"`
	SessionID     string `validate:"required,uuid"`
	RememberToken string `validate:"required"`
	Exp           int64  `validate:"required"`
}

type Session struct {
	ID                  string
	Type                string
	Start               int64
	Exp                 int64
	HashedRememberToken string
}

type User struct {
	ID             string `validate:"required,uuid"`
	Email          string `validate:"required,email"`
	HashedPassword string
	Activated      bool
}

type SecretMap map[uint]string

// NewService constructs and returns an auth Service by converting a SecretMap
// to a map of `secretID -> encrypt.Service``
func NewService(secretMap SecretMap, authURL string) (*Service, error) {
	secretIdToEncryptMap := make(map[uint]encrypt.Service)
	latestSecretKey := uint(0)

	for k, v := range secretMap {
		service, err := encrypt.NewService(v)
		if err != nil {
			return &Service{}, err
		}
		secretIdToEncryptMap[k] = service

		if k > latestSecretKey {
			latestSecretKey = k
		}
	}

	return &Service{
		mu:                   sync.Mutex{},
		latestSecretKey:      latestSecretKey,
		secretIdToEncryptMap: secretIdToEncryptMap,
		authURL:              authURL,
	}, nil
}

// NewToken creates an auth Token using the latest encryption sercret:
//
//	* 	Create a Token struct
//	* 	JSON marshal the token
//	*	Encrypt the token
//	* 	Format the token as: [secret ID]$[encrypted value]
//	*	Base64URL Encode the token
//	*	Return token as string
func (s *Service) newToken(
	UserID,
	SessionID string,
	RememberToken string,
	Exp int64,
) (string, error) {

	s.mu.Lock()
	defer s.mu.Unlock()

	token := Token{
		UserID:        UserID,
		SessionID:     SessionID,
		RememberToken: RememberToken,
		Exp:           Exp,
	}

	tokenStr, err := json.Marshal(token)
	if err != nil {
		return "", err
	}

	encryptService, ok := s.secretIdToEncryptMap[s.latestSecretKey]
	if !ok {
		return "", errors.New("invalid 'latest secret key', this should not happen, fix it")
	}

	encryptedVal, err := encryptService.Encrypt(string(tokenStr))
	if err != nil {
		return "", errors.New("failed to encrypt token, this should not happen, fix it")
	}

	valueToEncode := fmt.Sprintf("%d%s%s", s.latestSecretKey, delimiter, encryptedVal)
	encodedValue := base64.URLEncoding.EncodeToString([]byte(valueToEncode))

	return encodedValue, nil
}

func (s *Service) NewAuthTokenWithSession(
	UserID string,
	now time.Time,
) (string, Session, error) {
	exp := now.Add(AuthSessionExpirationTime).Unix()

	rememberToken, err := rand.RememberToken()
	if err != nil {
		return "", Session{}, err
	}

	sessionID := uuid.NewString()

	token, err := s.newToken(UserID, sessionID, rememberToken, exp)
	if err != nil {
		return "", Session{}, err
	}

	hashedRememberToken, err := hash.NewBcrypt(rememberToken)
	if err != nil {
		return "", Session{}, err
	}

	session := Session{
		ID:                  sessionID,
		Type:                SessionTypeAuth,
		Start:               now.Unix(),
		Exp:                 exp,
		HashedRememberToken: hashedRememberToken,
	}

	return token, session, nil
}

// NewPasswordResetLink creates an auth Token using the latest encryption
// sercret and then appends the token to the authURL.
func (s *Service) NewPasswordResetLinkWithSession(
	UserID string,
	now time.Time,
) (string, Session, error) {
	exp := now.Add(PasswordResetLinkExpirationTime).Unix()

	rememberToken, err := rand.RememberToken()
	if err != nil {
		return "", Session{}, err
	}
	sessionID := uuid.NewString()

	token, err := s.newToken(UserID, sessionID, rememberToken, exp)
	if err != nil {
		return "", Session{}, err
	}

	fullURL := s.authURL + "/resetPassword?link=" + token

	hashedRememberToken, err := hash.NewBcrypt(rememberToken)
	if err != nil {
		return "", Session{}, err
	}

	session := Session{
		ID:                  sessionID,
		Type:                SessionTypePasswordReset,
		Start:               now.Unix(),
		Exp:                 exp,
		HashedRememberToken: hashedRememberToken,
	}

	return fullURL, session, nil
}

func (s *Service) NewPasswordResetLink(
	userID string,
	rememberToken string,
	session Session,
) (string, error) {

	token, err := s.newToken(userID, session.ID, rememberToken, session.Exp)
	if err != nil {
		return "", err
	}

	fullURL := s.authURL + "/resetPassword?link=" + token

	return fullURL, nil
}

func (s *Service) NewPasswordResetSession(now time.Time) (Session, string, error) {
	exp := now.Add(PasswordResetLinkExpirationTime).Unix()

	rememberToken, err := rand.RememberToken()
	if err != nil {
		return Session{}, "", err
	}
	sessionID := uuid.NewString()

	hashedRememberToken, err := hash.NewBcrypt(rememberToken)
	if err != nil {
		return Session{}, "", err
	}

	session := Session{
		ID:                  sessionID,
		Type:                SessionTypePasswordReset,
		Start:               now.Unix(),
		Exp:                 exp,
		HashedRememberToken: hashedRememberToken,
	}

	return session, rememberToken, nil
}

// UnmarshalToken receives an auth.Token and returns a Token struct or an error
//
//	*	Receive token as string
//	*	Base64URL Decode the string
//	*	Parse the resulting string as [secret ID]$[encrypted value]
//	*	Get encryption service from parse result
//	*	Unencrypt the token
//	*	JSON Unmarshal the token into a Token struct
func (s *Service) UnmarshalToken(encodedVal string) (Token, error) {

	s.mu.Lock()
	defer s.mu.Unlock()

	unencodedValue, err := base64.URLEncoding.DecodeString(encodedVal)
	if err != nil {
		return Token{}, ErrInvalidToken
	}

	result := strings.SplitN(string(unencodedValue), delimiter, 2)
	if len(result) != 2 {
		return Token{}, ErrInvalidToken
	}

	secretKeyStr := result[0]
	encryptedVal := result[1]

	secretKey, err := strconv.ParseUint(secretKeyStr, 10, 64)
	if err != nil {
		return Token{}, ErrInvalidToken
	}

	encryptService, ok := s.secretIdToEncryptMap[uint(secretKey)]
	if !ok {
		return Token{}, ErrInvalidToken
	}

	jsonStr, err := encryptService.Decrypt(encryptedVal)
	if err != nil {
		return Token{}, ErrInvalidToken
	}

	token := Token{}
	err = json.Unmarshal([]byte(jsonStr), &token)
	if err != nil {
		return Token{}, ErrInvalidToken
	}

	err = validate.Check(token)
	if err != nil {
		return Token{}, err
	}

	return token, nil
}

func (s Session) IsValid(rememberToken string, now time.Time) (bool, error) {
	exp := time.Unix(s.Exp, 0)
	expired := time.Now().After(exp)
	if expired {
		return false, nil
	}

	ok, err := hash.BcryptCompare(s.HashedRememberToken, rememberToken)
	if err != nil {
		return false, err
	}

	if !ok {
		return false, nil
	}

	return true, nil
}

func (t Token) IsExpired(now time.Time) bool {
	exp := time.Unix(t.Exp, 0)

	// is the time right now after the exp time?
	expired := now.After(exp)
	return expired
}

func (t Token) IsValid(hashedRememberToken string) bool {
	ok, err := hash.BcryptCompare(hashedRememberToken, t.RememberToken)
	if err != nil || !ok {
		return false
	}

	return true
}

func (s Session) ShouldRefresh(now time.Time) (int64, bool) {
	// helper -> 	if the time right now is after the refresh threshold
	//				time, we need to refresh the session

	sessionExpTime := time.Unix(s.Exp, 0)
	refreshThresholdTime := sessionExpTime.Add(-AuthSessionRefreshThreshold)

	if now.After(refreshThresholdTime) {
		newExpTime := now.Add(AuthSessionExpirationTime).Unix()
		return newExpTime, true
	}

	return s.Exp, false

}

// SecretMapFromJSON accepts a file path as a parameter and returns a key->val
// map, of type uint->string, and an error.
//
// Requirements:
//			* 	secret should be exactly 32bytes
//			* 	key should be a uint (preferrably incremented by one from the
//				previous key)
func SecretMapFromJSON(path string) (SecretMap, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	defer file.Close()

	fileContent, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	secretsMap := make(map[uint]string)
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

// SecretMapFromBase64String accepts a string as a parameter and returns a
// key->val map, of type uint->string, and an error.
//
// Requirements:
//			*	argument should be a base64URL encoded string of a JSON document
//				that was a uint->32byte string map
//			* 	secrets should be exactly 32bytes
//			* 	key should be a uint (preferrably incremented by one from the
//				previous key)
func SecretMapFromBase64String(encodedSecrets string) (SecretMap, error) {
	result, err := base64.URLEncoding.DecodeString(encodedSecrets)
	if err != nil {
		return nil, err
	}

	secretsMap := make(map[uint]string)
	err = json.Unmarshal(result, &secretsMap)

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
