const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');
const resolvePath = require('path').resolve;
const Immutable = require('immutable');
const bodyParser = require('body-parser');

const app = express();

app.engine('handlebars', handlebars({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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

function loadUsers(){
	return new Promise((resolve, reject) => {
		fs.readFile(resolvePath(__dirname, './users.json'), {encoding:'utf8'}, (err, data) => {
			if(err){
				return void reject(err);
			}

			data = JSON.parse(data);
			return void resolve(data);
		})
	})
}

function saveUsers(users){
	return new Promise((resolve, reject) => {
		fs.writeFile(
			resolvePath(__dirname, './users.json'),
			JSON.stringify(users, null, 2),
			{encoding:'utf8'},
			(err) => {
				if(err){
					return void reject(err);
				}

				return void resolve();
			}
		)
	});
}

const PORT = Number(process.env.PORT || '3003');



app.get('/recipes', (req, res) => {
	const page = Number(req.query.page || '1');
	const itemsPerPage = 10;
	loadData()
		.then(data => {
			if(!data || !Object.keys(data).length){
				return void res.status(404).send('Sorry, we currently have no recipes for you');
			}

			//Could use Immutable here but this assumes the data is Immutable
			const viewData = {};
			viewData.recipes = Object.keys(data).map(key => Object.assign({}, data[key], {slug:key}));

			if(req.query.filter){
				const filterRegex = new RegExp(req.query.filter, 'i');
				viewData.recipes = viewData.recipes
					.filter(r => filterRegex.test(r.Name) || filterRegex.test(r.Ingredients));
			}

			if(req.query.maxCookingTime){
				const maxTime = parseInt(req.query.maxCookingTime,10);
				viewData.recipes = viewData.recipes.filter(r => parseInt(r.Cooking_Time,10) <= maxTime);
			}

			const totalRecipeCount = viewData.recipes.length;

			if(totalRecipeCount === 0){
				return void res.status(404).send('Sorry, nothing matched your filter term');
			}

			if(totalRecipeCount > itemsPerPage){
				const startIndex = itemsPerPage * (page-1);
				const endIndex = startIndex + itemsPerPage;
				viewData.recipes = viewData.recipes.slice(startIndex, endIndex);
				viewData.pagination = {
					currentPage: page,
					totalPages: Math.ceil(totalRecipeCount / itemsPerPage)
				}
			}

			res.render('list', viewData);

			// obv I wouldn't do this in production...
			// would use some kind of error service like sentry or something
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

app.get('/users/:user/starred', (req, res) => {
	loadUsers()
		.then(users => {

			const user = users[req.params.user];
			console.log(typeof users);
			if(!user){
				return void res.status(404).send('User not found');
			}

			res.json(user);
		}).catch(err => {
		res.status(500).send(err.stack);
	});
});

app.post('/users/:user/starred', (req, res) => {
	const recipe = req.body.recipe;
	loadUsers()
		.then(users => {
			const user = users[req.params.user];
			if(!user){
				return void res.status(401).send('No user');
			}

			user.Starred.push(recipe);
			users[req.params.user] = user;
			return saveUsers(users)
		})
		.then(() => {
			res.status(200).send('Saved');
		})
});

module.exports = app;

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});