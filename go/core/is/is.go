// package is contains contains a set of assert functions to be used in tests
package is

// %v	the value in a default format
// 		when printing structs, the plus flag (%+v) adds field names
// %#v	a Go-syntax representation of the value
// %T	a Go-syntax representation of the type of the value
// %%	a literal percent sign; consumes no value

import (
	"errors"
	"net/http/httptest"
	"reflect"
	"testing"
)

// Success and failure markers.
const (
	Success = "\u2713"
	Failed  = "\u2717"
)

// Err checks whether an error is a specific value
func Err(t *testing.T, got, want error) {
	t.Helper()
	ok := errors.Is(got, want)
	if !ok {
		t.Fatalf("wanted error: %q, but got error: %q", want.Error(), got.Error())
	}
}

// NotError is a test helper that simply takes an error param and checks that it
// is nil.
func NotErr(t *testing.T, err error) {
	t.Helper()
	if err != nil {
		t.Fatalf("wanted nil but got an error: %s", err.Error())
	}
}

// Ok is a test helper that simply takes a boolean param and checks
// that it is true.
func Ok(t *testing.T, ok bool) {
	t.Helper()
	if !ok {
		t.Fatalf("wanted true but got false")
	}
}

// Ok is a test helper that simply takes a boolean param and checks
// that it is true.
func NotOk(t *testing.T, ok bool) {
	t.Helper()
	if ok {
		t.Fatalf("wanted false but got true")
	}
}

// Equal is a test helper that takes two interface{} params and does a deep
// equality check
func Equal(t *testing.T, want, got interface{}) {
	t.Helper()
	if !reflect.DeepEqual(want, got) {
		t.Fatalf("wanted %#v but got %#v", want, got)
	}
}

// NotEqual is a test helper that takes two interface{} params and does a deep
// equality check
func NotEqual(t *testing.T, want, got interface{}) {
	t.Helper()
	if reflect.DeepEqual(want, got) {
		t.Fatalf("wanted %#v but got %#v", want, got)
	}
}

// NotNil is a test helper that simply takes an interface{} param and checks
// that it is not nil.
//
// Useful when testing for an error but you don't want to assert on the type
func NotNil(t *testing.T, got interface{}) {
	t.Helper()
	if got == nil {
		t.Fatalf("wanted something but got <nil>")
	}
}

// String is a test helper that takes two strings and tests that they're equal
//
// The error format directive is %q which prints a nicer error log for strings
func String(t *testing.T, want, got string) {
	t.Helper()
	if want != got {
		t.Fatalf("wanted %q but got %q", want, got)
	}
}

// ShortThenSkip, as in "is.ShortThenSkip(t)", skips a test if the short flag is
// present.
//
// This is used to distinguish long running "integration" tests from shorter
// unit tests
func ShortThenSkip(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration tests in short mode.")
	}
}

func HttpStatus(t *testing.T, r *httptest.ResponseRecorder, status int) {
	t.Helper()
	if r.Code != status {
		t.Fatalf("wanted http status %d, but got %d", status, r.Code)
	}
}

func CookieSet(t *testing.T, r *httptest.ResponseRecorder, name, want string) {
	t.Helper()

	for _, c := range r.Result().Cookies() {
		if c.Name == name {
			got := c.Value

			if got != want {
				t.Fatalf("wanted cookie %s to be %q, but got %s", name, want, got)
			}
			return
		}
	}

	t.Fatalf("wanted cookie %s to be %q, but cookie was not set", name, want)

}
