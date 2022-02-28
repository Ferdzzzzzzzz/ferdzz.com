.DEFAULT_GOAL := run
.PHONY: run
run:
	@npm run dev

deploy:
	@flyctl deploy

# Latch into a container with a shell. Convenient for debugging container builds
debug-container:
	docker run -it --rm 00495ba4fafd sh