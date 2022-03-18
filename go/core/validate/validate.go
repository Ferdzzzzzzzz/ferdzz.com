// Package validate contains the support for validating models.
package validate

import (
	"encoding/json"
	"errors"

	"github.com/go-playground/validator/v10"
)

// validate holds the settings and caches for validating request struct values.
var validate *validator.Validate

func init() {

	// Instantiate a validator.
	validate = validator.New()

}

// FieldError is used to indicate an error with a specific request field.
type FieldError struct {
	Field string `json:"field"`
	Error string `json:"error"`
}

// FieldErrors represents a collection of field errors.
type FieldErrors []FieldError

// Error implements the error interface.
func (fe FieldErrors) Error() string {
	d, err := json.Marshal(fe)
	if err != nil {
		return err.Error()
	}
	return string(d)
}

// Fields returns the fields that failed validation
func (fe FieldErrors) Fields() map[string]string {
	m := make(map[string]string)
	for _, fld := range fe {
		m[fld.Field] = fld.Error
	}
	return m
}

// IsFieldErrors checks if an error of type FieldErrors exists.
func IsFieldErrors(err error) bool {
	var fe FieldErrors
	return errors.As(err, &fe)
}

// GetFieldErrors returns a copy of the FieldErrors pointer.
func GetFieldErrors(err error) FieldErrors {
	var fe FieldErrors
	if !errors.As(err, &fe) {
		return nil
	}
	return fe
}

// Check validates the provided model against it's declared tags.
func Check(val interface{}) error {
	err := validate.Struct(val)

	if err != nil {
		// Use a type assertion to get the real error value.
		verrors, ok := err.(validator.ValidationErrors)
		if !ok {
			return err
		}

		var fields FieldErrors
		for _, verror := range verrors {
			field := FieldError{
				Field: verror.Field(),
				Error: verror.Error(),
			}
			fields = append(fields, field)
		}

		return fields
	}

	return nil
}
