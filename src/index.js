// Initialize express
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const helpers = require('./helpers');
var functions = require('./funciones');

//Register all the folders / libraries
const publicDirectory = path.join(__dirname, '../public');
const partialsDirectory = path.join(__dirname, '../partials');
const dirNode_modules = path.join(__dirname , '../node_modules')
app.use(express.static(publicDirectory));
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

hbs.registerPartials(partialsDirectory);

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {

    res.render('register');
});

app.get('/cursos', (req, res) => {

    res.render('lista-cursos');
});


app.listen(3000, () => {
    console.log('Corriendo node en el puerto 3000');
});
