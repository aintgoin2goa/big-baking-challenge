const supertest = require('supertest');
const app =require('../../src/app');
const expect = require('chai').expect;
const fixture = require('../support/fixture');
const flatten = require('lodash.flatten');

module.exports =  function () {

	let request;

	this.After(() => {
		fixture.tearDown();
	});

	this.When(/^a recipe is visited that cannot be found$/, function (callback) {
		this.request = supertest(app);
		this.request = this.request.get('/recipes/non-existant-recipe').expect(404);
		callback();
	});

	this.Then(/^the message "([^"]*)" is displayed$/, function (arg1, callback) {
		this.request
			.expect((res) => {
				expect(res.text).to.contain(arg1);
			})
			.end(err => {
				callback(err);
			});
	});

	this.Given(/^the system has the following recipe cooking times:$/, function (arg1, callback) {
		fixture.writeRecipeFixture(arg1.hashes());
		fixture.log();
		callback();
	});

	this.When(/^the "([^"]*)" recipe is visited$/, function (arg1, callback) {
		const slug = arg1.toLowerCase().replace(/\s/g, '-');
		request = supertest(app).get(`/recipes/${slug}`);
		callback();
	});

	this.Then(/^the cooking time of "([^"]*)" is displayed$/, function (arg1, callback) {
		this.request
			.expect(200)
			.expect(res => {
				expect(res.text).to.contain(arg1);
			})
			.end(callback);
	});

	this.Given(/^the system has the following recipe image:$/, function (arg1, callback) {
		fixture.writeRecipeFixture(arg1.hashes());
		callback();
	});

	this.Then(/^the image "([^"]*)" is displayed$/, function (arg1, callback) {
		this.request
			.expect(200)
			.expect(res => {
				expect(res.text).to.contain(arg1);
			})
			.end(callback);
	});

	this.Given(/^the system has the following recipe ingredients:$/, function (arg1, callback) {
		const ingredients = arg1.rows().map(row => {
			return {quantity: row[1], ingredient:row[2]};
		});
		fixture.writeRecipeFixture([{Recipe:'Lemon Chicken', Ingredients:ingredients}]);
		callback();
	});

	this.Then(/^the ingredients are listed:$/, function (arg1, callback) {
		const ingredients = flatten(arg1.raw());
		this.request
			.expect(200)
			.expect(res => {
				for(let ingredient of ingredients){
					expect(res.text).to.contain(ingredient);
				}
			})
			.end(callback);
	});
};
