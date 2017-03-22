const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');
const resolvePath = require('path').resolve;
const Immutable = require('immutable');

const app = express();

app.engine('handlebars', handlebars({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// Wouldn't be loading the data on each request in the real world, more likely querying a database
// or if the dataset was small we could poll it instead
function loadData(){
	return new Promise((resolve, reject) => {
		fs.readFile(resolvePath(__dirname, './recipes.json'), {encoding:'utf8'}, (err, data) => {
			if(err){
				return void reject(err);
			}

			return void resolve(JSON.parse(data));
		})
	})
}

const PORT = Number(process.env.PORT || '3003');

app.get('/recipes', (req, res) => {
	loadData()
		.then(data => {
			if(!data || !Object.keys(data).length){
				return void res.status(404).send('Sorry, we currently have no recipes for you');
			}

			//Could use Immutable here but this assumes the data is Immutable
			const recipes = Object.keys(data).map(key => Object.assign({}, data[key], {slug:key}));
			res.render('list', {recipes});

			// obv I wouldn't do this in production...
		}).catch(err => res.status(500).send(err.stack))
});

app.get('/recipes/:recipe', (req, res) => {
	loadData()
		.then(data => {
			const recipeName = req.params.recipe;
			const recipeData = data[recipeName];
			if(!recipeData){
				return void res.status(404).send(`Sorry, this recipe doesn't exist or may have been removed`);
			}

			//Using immutable here as I've been burned a lot by not using it
			let recipe = Immutable.fromJS(recipeData);
			if(recipe.has('Ingredients')){
				recipe = recipe.set('Ingredients', recipe.get('Ingredients')
					.map(i => {
						i = i.toJS();
						return Number(i.quantity).toString() === i.quantity ?
							`${i.quantity} x ${i.ingredient}` :
							`${i.quantity} ${i.ingredient}`;
					})
				);
			}

			// The fixtures in the test are annoyingly inconsistent
			if(recipe.has('Name')){
				recipe = recipe.set('Recipe', recipe.get('Name'));
			}

			res.render('recipe', recipe.toJS());
		}).catch(err => {
			res.status(500).send(err.stack);
	});
});

module.exports = app;

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});