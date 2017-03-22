.PHONY: test

test:
	./node_modules/.bin/cucumber.js features/star.feature

run:
	node src/app.js

fixture:
	node -e 'require("./features/support/fixture.js").defaultList(42)'