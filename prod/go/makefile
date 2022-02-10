# Dev DB 
# Username: neo4j
# Password: password


.DEFAULT_GOAL := run
.PHONY: run
run:
	@go run ./apps/api -dev

test:
	@go test ./... --short

build:
	@go build ./app


# requires some services to be running, be aware that these tests might do some 
# random stuff, like drop everything in your db and refill with test data.
test-long:
	@go test ./...

tidy:
	@go mod tidy
	@go mod vendor


build-api-container:
	@docker build \
		-f ./dockerfile \
		--build-arg VCS_REF=`git rev-parse --short HEAD` \
		-t ferdzz_api:0.0.1 \
		.



# ui-env:
# 	@base64 frontend/.env | pbcopy

# host.docker.internal: docs.docker.com/desktop/mac/networking/
run-api-container:
	@docker run \
		-p 4000:4000 \
		ferdzz_api:0.0.1

# -e API_PORT=4000 \


# Latch into a container with a shell. Convenient for debugging container builds
debug-container:
	docker run -ti --rm ferdzz_api:0.0.1 sh

upload-container:
	@docker tag ferdzz_api:0.0.1 revise/ferdzz_api:0.0.1
	@docker push revise/ferdzz_api:0.0.1


# Get access key and save as env variables:
# https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys
# https://docs.docker.com/cloud/ecs-integration/

deploy:
	@docker --context ferdzz.com compose up 

