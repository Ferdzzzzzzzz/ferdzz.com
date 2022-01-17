.DEFAULT_GOAL := run
.PHONY: run
run:
	@go run ./app -dev

style:
	@npx tailwindcss -o ./public/styles.css --watch

tidy:
	@go mod tidy
	@go mod vendor

build-logfmt:
	@go build ./utils/logFmt