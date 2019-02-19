
//node modules/"presets"
var express = require('express');
var fs = require('fs');
var app = express();
var methodOverride = require('method-override');

//middleware
app.set('view engine', 'ejs'); //telling express to look in views in the ejs modules
app.use(express.static('static'));//where to find static files like img, css and boilerplate
app.use(express.urlencoded({extended: false})); //sets up body parser. if we receieve a form is will show up as 'req.body'
app.use(methodOverride('_method'));




//get new/newpage
app.get('/articles/new', function(req, res){
    res.render('articles/new');
});

//get all/indexpage
app.get('/articles', function(req, res){
    var articles = fs.readFileSync('./articles.json');
    articles = JSON.parse(articles);
    res.render('articles/index',{myArticles: articles});
});
//get one/showpage
app.get('/articles/:id', function(req, res){
    var articles = fs.readFileSync('./articles.json');
    articles = JSON.parse(articles);
    var articleIndex = parseInt(req.params.id);
    res.render('articles/show', {myArticle: articles[articleIndex]}); 
});

//post create/ - route for receiving the form data from new.ejs ^^^
app.post('/articles', function(req, res){

    var articles = fs.readFileSync('./articles.json');
    articles = JSON.parse(articles);
    articles.push(req.body);
    fs.writeFileSync('./articles.json', JSON.stringify(articles));
    res.redirect('/articles');
});

//delete delete/deletes
app.delete('/articles/:id', function(req, res){
    var articles = fs.readFileSync('./articles.json');
    articles = JSON.parse(articles);
    articles.splice(parseInt(req.params.id), 1);
    fs.writeFileSync('./articles.json', JSON.stringify(articles));
    res.redirect('/articles');
});

//get edit/editpage
app.get('/articles/:id/edit', function(req, res){
    var articles = fs.readFileSync('./articles.json');
    articles = JSON.parse(articles);
    var articlesIndex = parseInt(req.params.id);
    res.render('articles/edit', {article: articles[articlesIndex], articleId: articlesIndex})
});

//put update/editpage
app.put('/articles/:id', function(req, res){
    var articles = fs.readFileSync('./articles.json');
    articles = JSON.parse(articles);
    var articleId = parseInt(req.params.id);
    articles[articleId].title = req.body.title;
    articles[articleId].body =req.body.body;
    fs.writeFileSync('./articles.json', JSON.stringify(articles));
    res.redirect('/articles' + articleId);
});

app.listen(3000);
