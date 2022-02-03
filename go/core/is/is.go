// package is contains contains a set of assert functions to be used in tests
package is

// %v	the value in a default format
// 		when printing structs, the plus flag (%+v) adds field names
// %#v	a Go-syntax representation of the value
// %T	a Go-syntax representation of the type of the value
// %%	a literal percent sign; consumes no value

import (
	"bytes"
	"encoding/json"
	"errors"
	"reflect"
	"testing"
)

func NotErr(t *testing.T, err error) {
	t.Helper()
	if err != nil {
		t.Fatalf("expected err to be nil, but got %s", err.Error())
	}
}

func ErrIs(t *testing.T, got, want error) {
	t.Helper()

	ok := errors.Is(got, want)
	if !ok {
		t.Fatalf("wanted error: %s, but got: %s", want.Error(), got.Error())
	}
}

// Equal is a test helper that takes two interface{} params and does a deep
// equality check
func Equal(t *testing.T, want, got interface{}) {
	t.Helper()
	if !reflect.DeepEqual(want, got) {
		t.Errorf("wanted %#v but got %#v", want, got)
	}
}

// NotNil is a test helper that simply takes an interface{} param and checks
// that it is not nil.
//
// Useful when testing for an error but you don't want to assert on the type
func NotNil(t *testing.T, got interface{}) {
	t.Helper()
	if got == nil {
		t.Fatal("wanted something but got <nil>")
	}
}

// String is a test helper that takes two strings and tests that they're equal
//
// The error format directive is %q which prints a nicer error log for strings
func String(t *testing.T, want, got string) {
	t.Helper()
	if want != got {
		t.Errorf("wanted %q but got %q", want, got)
	}
}

// DecodeJSON is a test helper that decodes a HTTP Response body into a struct.
//
// Remember to pass the struct as a pointer, otherwise the original struct
// variable won't mutate.
func DecodeJSON(t *testing.T, body *bytes.Buffer, got interface{}) {
	t.Helper()
	err := json.NewDecoder(body).Decode(&got)
	if err != nil {
		t.Fatal(err)
	}
}

// ShortThenSkip, as in "is.ShortThenSkip(t)", skips a test if the short flag is
// present.
//
// This is used to distinguish long running "integration" tests from shorter
// unit tests
func ShortThenSkip(t *testing.T) {
	t.Helper()
	if testing.Short() {
		t.Skip("skipping integration tests in short mode.")
	}
}
