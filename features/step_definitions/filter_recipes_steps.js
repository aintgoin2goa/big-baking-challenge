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

	this.When(/^the filter term "([^"]*)" is entered$/, function (arg1, callback) {
		this.request = supertest(app)
			.get('/recipes?filter=' + arg1);
		callback();
	});


	this.Then(/^the following recipes are displayed:$/, function (arg1, callback) {
		const recipes = flatten(arg1.raw());
		this.request.expect(res => {
			for(let recipe of recipes){
				expect(res.text).to.contain(recipe);
			}
			const $ = cheerio.load(res.text);
			expect($('.recipe-list__item').length).to.equal(recipes.length);
		}).end(callback);
	});

	this.Then(/^only the following recipe is displayed:$/, function (arg1, callback) {
		const recipes = flatten(arg1.raw());
		this.request.expect(res => {
			for(let recipe of recipes){
				expect(res.text).to.contain(recipe);
			}
			const $ = cheerio.load(res.text);
			expect($('.recipe-list__item').length).to.equal(recipes.length);
		}).end(callback);
	});

	this.When(/^the maximum cooking time "([^"]*)" is selected$/, function (arg1, callback) {
		this.request = supertest(app)
			.get('/recipes?maxCookingTime=25');
		callback();
	});
};
