package web

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

// Param returns the web call parameters from the request.
func PathParam(r *http.Request, key string) (string, bool) {
	vars := mux.Vars(r)
	param, ok := vars[key]

	return param, ok
}

// QueryParam is a convenient method for getting a query param in the URL
func QueryParam(r *http.Request, key string) (string, bool) {
	ok := r.URL.Query().Has(key)
	param := r.URL.Query().Get(key)

	return param, ok
}

// Decode reads the body of an HTTP request looking for a JSON document. The
// body is decoded into the provided value.
//
// If the provided value is a struct then it is checked for validation tags.
func Decode(r *http.Request, val interface{}) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	err := decoder.Decode(val)
	if err != nil {
		return err
	}

	return nil
}
