// Initialize express
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./helpers');

//paths
const publicDirectory = path.join(__dirname, '../public');
const dirNode_modules = path.join(__dirname, '../node_modules');


//LocalStorage
if (typeof localStorage === 'undefined' || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


app.use(express.static(publicDirectory));
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

app.use(bodyParser.urlencoded({ extended: false }));


app.use(require('./routes'));

//Conexión a la BD
mongoose.connect('mongodb://localhost:27017/cursos', { useNewUrlParser: true }, (err, result) => {
	if (err) {
		return console.log('error al conectar DB');
	}
	console.log('Conectado');
});

app.listen(3000, () => {
  console.log('Corriendo node en el puerto 3000');
});
