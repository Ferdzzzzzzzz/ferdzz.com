package mid

import (
	"context"
	"math/rand"
	"net/http"
	"time"

	"github.com/ferdzzzzzzzz/ferdzz/core/web"
	"go.uber.org/zap"
)

// Latency gives a random latency from 0.1-3 seconds. This is great for frontend
// development
func Latency(log *zap.SugaredLogger) web.Middleware {
	const max = 2000
	const min = 100

	mid := func(handler web.Handler) web.Handler {

		h := func(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
			n := rand.Intn(max-min) + min

			log.Debugf("Sleeping for %d milliseconds", n)
			time.Sleep(time.Duration(n) * time.Millisecond)

			// Call the next handler.
			err := handler(ctx, w, r)

			// Return the error so it can be handled further up the chain.
			return err

		}

		return h
	}

	return mid
}
