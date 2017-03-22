const resolvePath = require('path').resolve;
const fs = require('fs');
const flatten = require('lodash.flatten');

const DATA_FILE = resolvePath(__dirname, '../../src/recipes.json');
const USERS_FILE = resolvePath(__dirname, '../../src/users.json');

exports.writeRecipeFixture = rows => {
	const data = {};
	for(let row of rows){
		const transformedRow = {};
		Object.keys(row).forEach(key => {
			transformedRow[key.replace(/\s/g, '_')] = row[key];
		});
		data[row.Recipe.toLowerCase().replace(/\s/g, '-')] = transformedRow;
	}

	fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), {encoding:'utf8'});
};

exports.writeListFixture = rows => {
	const data = {};
	for(let row of rows){
		const transformedRow = {};
		Object.keys(row).forEach(key => {
			transformedRow[key.replace(/\s/g, '_')] = row[key];
		});
		data[row.Name.toLowerCase().replace(/\s/g, '-')] = transformedRow;
	}

	fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), {encoding:'utf8'});
};

exports.defaultList = (count = 1) => {
	const data = {};
	for(let i=0; i<count; i++){
		data['recipe-' + i] = {
			Name: 'Lemon Chicken',
			Cooking_Time: '30 minutes',
			Main_Ingredients: 'Chicken, Lemon'
		}
	}

	fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), {encoding:'utf8'});
};

exports.user = name => {
	const data = {
		[name] : {Name: name, Starred:[]},
	};
	fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), {encoding:'utf8'});
};

exports.starredRecipes = (name, recipes) => {
	const users = JSON.parse(fs.readFileSync(USERS_FILE, {encoding:'utf8'}));
	users[name] = {Name:name, Starred:recipes};
	fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), {encoding:'utf8'});
};

exports.tearDown = () => {
	fs.writeFileSync(DATA_FILE, '{}', {encoding:'utf8'});
	fs.writeFileSync(USERS_FILE, '{}', {encoding:'utf8'});
};

exports.log = () => {
	console.dir(JSON.parse(fs.readFileSync(DATA_FILE, {encoding:'utf8'})), {depth:null});
};