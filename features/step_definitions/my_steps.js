var myStepDefinitionsWrapper = function () {

	this.When(/^a recipe is visited that cannot be found$/, function (callback) {
		callback(null, 'pending');
	});

	this.Then(/^the message "([^"]*)" is displayed$/, function (arg1, callback) {
		callback(null, 'pending');
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
module.exports = myStepDefinitionsWrapper;