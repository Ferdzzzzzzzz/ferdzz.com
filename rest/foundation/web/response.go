package web

import (
	"context"
	"encoding/json"
	"net/http"
)

// Respond converts a Go value to JSON and sends it to the client.
func Respond(
	ctx context.Context,
	w http.ResponseWriter,
	data interface{},
	statusCode int,
) error {

	// Set the statusCode for the Request Logger middleware
	setStatusCode(ctx, statusCode)

	// If there is nothing to marshal then set status code and return.
	if statusCode == http.StatusNoContent {
		w.WriteHeader(statusCode)
		return nil
	}

	// Convert the response value to JSON.
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	// Set the content type and headers once we know marshaling has succeeded.
	w.Header().Set("Content-Type", "application/json")

	// Write the status code to the response.
	w.WriteHeader(statusCode)

	// Write response data to response body.
	_, err = w.Write(jsonData)
	if err != nil {
		return err
	}

	return nil
}
