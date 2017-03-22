.PHONY: test

test:
	./node_modules/.bin/cucumber.js features/recipe_list.feature

run:
	node src/app.js

fixture:
	node -e 'require("./features/support/fixture.js").defaultList()'