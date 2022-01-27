# Dev DB 
# Username: ferdzz.com?
# Password: password


.DEFAULT_GOAL := run
.PHONY: run
run:
	@go run ./app -dev

play:
	@go run ./utils/playground

style:
	@npx tailwindcss -o ./public/styles.css --watch

tidy:
	@go mod tidy
	@go mod vendor

build-logfmt:
	@go build ./utils/logFmt

# create all the relevant constraints for the db
constraints:
	CREATE CONSTRAINT user_email_unique [IF NOT EXISTS]
	FOR (u:User)
	REQUIRE u.email IS UNIQUE

	CREATE CONSTRAINT user_email_exists [IF NOT EXISTS]
	FOR (u:User)
	REQUIRE u.email IS NOT NULL

	SHOW CONSTRAINTS