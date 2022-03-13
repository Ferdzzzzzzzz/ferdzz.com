package hash

import "golang.org/x/crypto/bcrypt"

func NewBcrypt(password string) (string, error) {
	val, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(val), nil
}

func BcryptCompare(hash string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
