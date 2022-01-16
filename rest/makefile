.DEFAULT_GOAL := run
.PHONY: run
run:
	@go run ./app

style:
	@npx tailwindcss -o ./public/styles.css --watch

tidy:
	@go mod tidy
	@go mod vendor