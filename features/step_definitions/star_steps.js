const supertest = require('supertest');
const app =require('../../src/app');
const expect = require('chai').expect;
const fixture = require('../support/fixture');
const flatten = require('lodash.flatten');

module.exports = function () {

	this.Given(/^the user "([^"]*)" exists in the system$/, function (arg1, callback) {
		this.user = arg1;
		fixture.user(this.user);
		callback();
	});

	this.Given(/^he has no starred recipes$/, function (callback) {
		fixture.starredRecipes(this.user, []);
		callback();
	});

	this.When(/^he stars the recipe "([^"]*)"$/, function (arg1, callback) {
		this.request = supertest(app)
			.post(`/users/${this.user}/starred/`)
			.send({recipe:arg1})
			.end(callback);
	});

	this.Then(/^the system has the following starred recipes for "([^"]*)":$/, function (name, recipes, callback) {
		this.request = supertest(app)
			.get(`/users/${this.user}/starred`)
			.expect(200)
			.expect(res => {
				console.log(res);
				expect(res.body.Name).to.equal(name);
				expect(res.body.Starred).to.deep.equal(flatten(recipes.raw()));
			}).end(callback);
	});

	this.Given(/^he has the starred recipes:$/, function (arg1, callback) {
		callback(null, 'pending');
	});

	this.When(/^he unstars the recipe "([^"]*)"$/, function (arg1, callback) {
		callback(null, 'pending');
	});

	this.Then(/^the system has no starred recipes for "([^"]*)"$/, function (arg1, callback) {
		callback(null, 'pending');
	});

	this.When(/^he filters by starred recipes$/, function (callback) {
		callback(null, 'pending');
	});

	this.Then(/^the recipe "([^"]*)" is displayed$/, function (arg1, callback) {
		callback(null, 'pending');
	});
};
