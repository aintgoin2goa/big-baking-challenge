const resolvePath = require('path').resolve;
const fs = require('fs');
const flatten = require('lodash.flatten');

const DATA_FILE = resolvePath(__dirname, '../../src/recipes.json');

exports.writeFixture = rows => {
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

exports.tearDown = () => {
	fs.writeFileSync(DATA_FILE, '{}', {encoding:'utf8'});
};

exports.log = () => {
	console.dir(JSON.parse(fs.readFileSync(DATA_FILE, {encoding:'utf8'})), {depth:null});
};