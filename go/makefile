# Dev DB 
# Username: ferdzz.com?
# Password: password


.DEFAULT_GOAL := run
.PHONY: run
run:
	@go run ./app -dev

play:
	@go run ./utils/playground

test:
	@go test ./... --short

# requires some services to be running, be aware that these tests might do some 
# random stuff, like drop everything in your db and refill with test data.
test-long:
	@go test ./...

tidy:
	@go mod tidy
	@go mod vendor

build-logfmt:
	@go build ./utils/logFmt

# create all the relevant constraints for the db
constraints:
	CREATE CONSTRAINT user_email_unique [IF NOT EXISTS]
	FOR (u:User)
	REQUIRE u.Email IS UNIQUE

	CREATE CONSTRAINT user_email_exists [IF NOT EXISTS]
	FOR (u:User)
	REQUIRE u.Email IS NOT NULL

	SHOW CONSTRAINTS

	DROP CONSTRAINT user_email_exists


	