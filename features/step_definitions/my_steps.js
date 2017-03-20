const supertest = require('supertest');
const app =require('../../src/app');
const expect = require('chai').expect;

module.exports =  function () {

	let request;

	this.When(/^a recipe is visited that cannot be found$/, function (callback) {
		request = supertest(app)
			.get('/recipe/nonexistant-recipe')
			.then(callback);
	});

	this.Then(/^the message "([^"]*)" is displayed$/, function (arg1, callback) {
		request
			.expect(404)
			.expect((res) => {
				expect(res.body).to.equal(arg1);
			}, callback);
	});

	this.Given(/^the system has the following recipe cooking times:$/, function (arg1, callback) {
		callback(null, 'pending');
	});

	this.When(/^the "([^"]*)" recipe is visited$/, function (arg1, callback) {
		callback(null, 'pending');
	});

	this.Then(/^the cooking time of "([^"]*)" is displayed$/, function (arg1, callback) {
		callback(null, 'pending');
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
