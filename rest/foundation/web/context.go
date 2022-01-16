package web

import (
	"context"
	"errors"
	"time"
)

type ctxKey int

const key ctxKey = 1

type Values struct {
	TraceID    string
	Now        time.Time
	StatusCode int
}

// GetValues return the values from context
func GetValues(ctx context.Context) (*Values, error) {
	v, ok := ctx.Value(key).(*Values)
	if !ok {
		return nil, errors.New("web value missing from context")
	}

	return v, nil
}

// GetTraceID return the TraceID from context
func GetTraceID(ctx context.Context) string {
	v, ok := ctx.Value(key).(*Values)
	if !ok {
		return "0000-0000-0000-0000"
	}

	return v.TraceID
}

func setStatusCode(ctx context.Context, statusCode int) error {
	v, ok := ctx.Value(key).(*Values)
	if !ok {
		return errors.New("web value missing from context")
	}

	v.StatusCode = statusCode
	return nil
}
