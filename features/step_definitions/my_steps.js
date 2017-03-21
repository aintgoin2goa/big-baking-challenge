const supertest = require('supertest');
const app =require('../../src/app');
const expect = require('chai').expect;
const fixture = require('../support/fixture');

module.exports =  function () {

	let request;

	this.When(/^a recipe is visited that cannot be found$/, function (callback) {
		request = supertest(app);
		request = request.get('/recipes/non-existant-recipe');
		callback();
	});

	this.Then(/^the message "([^"]*)" is displayed$/, function (arg1, callback) {
		request
			.expect(404)
			.expect((res) => {
				expect(res.text).to.contain(arg1);
			})
			.end(err => {
				callback(err);
			});
	});

	this.Given(/^the system has the following recipe cooking times:$/, function (arg1, callback) {
		fixture.writeFixture(arg1.hashes());
		callback();
	});

	this.When(/^the "([^"]*)" recipe is visited$/, function (arg1, callback) {
		const slug = arg1.toLowerCase().replace(/\s/g, '-');
		request = supertest(app).get(`/recipes/${slug}`);
		callback();
	});

	this.Then(/^the cooking time of "([^"]*)" is displayed$/, function (arg1, callback) {
		request
			.expect(200)
			.expect(res => {
				expect(res.text).to.contain(arg1);
			})
			.end(callback);
	});

	this.Given(/^the system has the following recipe image:$/, function (arg1, callback) {
		callback(null, 'pending');
	});

	this.Then(/^the image "images\/recipes\/lemon_chicken\.png" is displayed$/, function (arg1, callback) {
		callback(null, 'pending');
	});

	this.Given(/^the system has the following recipe ingredients:$/, function (arg1, callback) {
		callback(null, 'pending');
	});

	this.Then(/^the ingredients are listed:$/, function (arg1, callback) {
		callback(null, 'pending');
	});
};
