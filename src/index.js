// Initialize express
require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
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

// session
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

//middleware
app.use((req, res, next) => {

	//En caso de usar variables de sesión
	if (req.session.usuario) {
		res.locals.sesion = true
		res.locals.nombre = req.session.usuario.nombre
		res.locals.rol = req.session.usuario.rol;
	// } else {
	// 	res.redirect('/');
	}
	next()
})

app.use(require('./routes'));

//Conexión a la BD
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, result) => {
	if (err) {
		return console.log('error al conectar DB');
	}
	console.log('Conectado');
});

app.listen(process.env.PORT, () => {
	console.log('Corriendo node en el puerto 3000');
});
