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
// provides Epoch timestamps.
func New(service string) *zap.SugaredLogger {
	config := zap.NewProductionConfig()
	config.OutputPaths = []string{"stdout"}
	config.EncoderConfig.EncodeTime = zapcore.EpochTimeEncoder
	config.DisableStacktrace = true
	config.InitialFields = map[string]interface{}{"service": "api.ferdzz.com"}

	log, err := config.Build()
	if err != nil {
		fmt.Println("Error constructing logger:", err)
		os.Exit(1)
	}

	sugar := log.Sugar()

	return sugar
}

// NewDev constructs a Sugared Logger that writes to stdout. The encoder prints in
// a console friendly way.
func NewDev(service string) *zap.SugaredLogger {
	config := zap.NewDevelopmentEncoderConfig()
	encoder := zapcore.NewConsoleEncoder(config)

	log := zap.New(zapcore.NewCore(encoder, zapcore.AddSync(os.Stdout), zapcore.DebugLevel)).Sugar()

	return log
}

// NewTest constructs a Sugared Logger that writes to a bufio.Writer, as well as
// a cleanup(sync) function that returns the logs.
// The encoder prints in a console friendly way.
func NewTest(service string) (*zap.SugaredLogger, func() string) {
	var buf bytes.Buffer

	config := zap.NewDevelopmentEncoderConfig()
	encoder := zapcore.NewConsoleEncoder(config)
	writer := bufio.NewWriter(&buf)

	log := zap.New(zapcore.NewCore(encoder, zapcore.AddSync(writer), zapcore.DebugLevel)).Sugar()

	cleanup := func() string {
		log.Sync()
		writer.Flush()
		return buf.String()
	}

	return log, cleanup
}
