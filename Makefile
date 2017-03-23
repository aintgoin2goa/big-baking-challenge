.PHONY: test

test:
	./node_modules/.bin/cucumber.js

run:
	node src/app.js

fixture:
	node -e 'require("./features/support/fixture.js").defaultList(42)'