const supertest = require('supertest');
const app =require('../../src/app');
const expect = require('chai').expect;
const fixture = require('../support/fixture');
const flatten = require('lodash.flatten');
const cheerio = require('cheerio');

module.exports = function () {

	this.After(() => {
		fixture.tearDown();
	});

	this.When(/^there are no recipes in the system$/, function (callback) {
		fixture.writeListFixture([]);
		this.request = supertest(app);
		this.request = this.request.get('/recipes/');
		callback();
	});


	this.When(/^the following recipes exist in the system:$/, function (arg1, callback) {
		fixture.writeListFixture(arg1.hashes());
		this.request = supertest(app).get('/recipes');
		callback();
	});

	this.Then(/^the recipe "([^"]*)"$/, function (arg1, callback) {
		this.request.expect(res => {
			expect(res.text).to.contain(arg1);
		}).expect(200);
		callback();
	});

	this.Then(/^the cooking time of "([^"]*)"$/, function (arg1, callback) {
		this.request.expect(res => {
			expect(res.text).to.contain(arg1);
		}).expect(200);
		callback();
	});

	this.Then(/^the main ingredients are displayed:$/, function (arg1, callback) {
		const ingredients = flatten(arg1.raw());
		this.request.expect(res => {
			for(let ingredient of ingredients){
				expect(res.text).to.contain(ingredient);
			}
		}).expect(200, callback);
	});

	this.When(/^a recipe is selected$/, function (callback) {
		fixture.defaultList();
		this.request = supertest(app)
			.get('/recipes')
			.then(res => {
				// As I'm not using a client-side testing framework, this a hack to fulfil the test
				// without having to switch to using karma or something
				const $ = cheerio.load(res.text);
				return $('.recipe-list__item-name').first().find('a').attr('href');
			})
			.then(href => {
				this.request = supertest(app).get(href);
				callback();
			}).catch(callback);
	});


	this.Then(/^I am taken to the recipe page$/, function (callback) {
		this.request.expect(res => {
			expect(res.text).to.contain('<main class="recipe">');
			expect(res.text).to.contain('Lemon Chicken');
		}).expect(200, callback);
	});

	this.Then(/^the recipes along with their cooking time and main ingredients are displayed:$/, function (arg1, callback) {
		const recipes = flatten(arg1.raw());
		this.request.expect(res => {
			for(let recipe of recipes){
				expect(res.text).to.contain(recipe);
			}
		}).expect(200, callback);
	});

	this.When(/^there are more than (\d+) recipes in the system$/, function (arg1, callback) {
		fixture.defaultList(parseInt(arg1,10)+1);
		this.request = supertest(app).get('/recipes');
		callback();
	});

	this.Then(/^only the first (\d+) recipes are shown$/, function (arg1, callback) {
		this.request
			.expect(res => {
				const $ = cheerio.load(res.text);
				expect($('.recipe-list__item').length).to.equal(parseInt(arg1,10));
			});
		callback();
	});

	this.Then(/^page navigation elements are displayed$/, function (callback) {
		this.request.expect(res => {
			expect(res.text).to.contain('recipe-list__pagination');
		}).end(callback);
	});
};
