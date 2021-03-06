// Package logger provides a convience function to constructing a logger for use.
package logger

import (
	"bufio"
	"bytes"
	"fmt"
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// New constructs a Sugared Logger that writes to stdout and
// provides human readable timestamps.
func New(service string) *zap.SugaredLogger {
	config := zap.NewProductionConfig()
	config.OutputPaths = []string{"stdout"}
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	config.DisableStacktrace = true
	config.InitialFields = map[string]interface{}{
		"service": service,
	}

	log, err := config.Build()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	return log.Sugar()
}

// New constructs a Sugared Logger that writes to stdout. The encoder prints in
// a console friendly way.
func NewDev(service string) *zap.SugaredLogger {
	encoder := zapcore.NewConsoleEncoder(zap.NewDevelopmentEncoderConfig())

	log := zap.New(zapcore.NewCore(encoder, zapcore.AddSync(os.Stdout), zapcore.DebugLevel)).Sugar()

	return log
}

// NewTest constructs a Sugared Logger that writes to a bufio.Writer, as well as
// a cleanup(sync) function that returns the logs.
// The encoder prints in a console friendly way.
func NewTest(service string) (*zap.SugaredLogger, func() string) {
	var buf bytes.Buffer

	encoder := zapcore.NewConsoleEncoder(zap.NewDevelopmentEncoderConfig())
	writer := bufio.NewWriter(&buf)

	log := zap.New(zapcore.NewCore(encoder, zapcore.AddSync(writer), zapcore.DebugLevel)).Sugar()

	cleanup := func() string {
		log.Sync()
		writer.Flush()
		return buf.String()
	}

	return log, cleanup
}
