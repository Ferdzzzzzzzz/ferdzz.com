package hash

import "golang.org/x/crypto/bcrypt"

func BcryptNew(value string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(value), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hashedBytes), nil
}

// BcryptCompare compares a password to an existing hash. If the password is
// valid, the output is true, else false. If there is an error something went
// wrong. The hash has likely been corrupted.
func BcryptCompare(hash, password string) (bool, error) {
	err := bcrypt.CompareHashAndPassword(
		[]byte(hash),
		[]byte(password))

	switch err {
	case nil:
		return true, nil
	case bcrypt.ErrMismatchedHashAndPassword:
		return false, nil
	default:
		return false, err
	}
}
