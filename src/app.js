const express = require('express');
const handlebars = require('express-handlebars');

const app = express();

app.engine('handlebars', handlebars({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

const data = require('./recipes.json');

const PORT = Number(process.env.PORT || '3003');

app.get('/recipes/:recipe', (req, res) => {
	const recipe = req.params.recipe;
	console.log('recipe', recipe);
	if(!data[recipe]){
		return void res.status(404).send(`Sorry, this recipe doesn't exist or may have been removed`);
	}

	res.render('recipe', data[recipe]);
});

module.exports = app;

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});