.PHONY: test

test:
	./node_modules/.bin/cucumber.js

run:
	node src/app.js

setup:
	node -e 'require("./features/support/fixture.js").setup()'