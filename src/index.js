// Initialize express
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const helpers = require('./helpers');
const funciones = require('./funciones');

//Register all the folders / libraries
const publicDirectory = path.join(__dirname, '../public');
const partialsDirectory = path.join(__dirname, '../partials');
const dirNode_modules = path.join(__dirname, '../node_modules')
app.use(express.static(publicDirectory));
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

hbs.registerPartials(partialsDirectory);
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    const valid = req.query.valid;
    const creado = req.query.creado;
    res.render('login', {
        error: valid ? true : false,
        creado: creado ? true : false
    });
});

app.get('/register', (req, res) => {
    const valid = req.query.valid
    res.render('register', {
        error: valid ? true : false
    });
});

app.post('/check', (req, res) => {
    const usuarioXDocumento = funciones.obtenerUsuarioXDocumento(req.body.documento);
    if (usuarioXDocumento) {
        res.writeHead(301,
            { Location: '/register?valid=false' }
        );
        res.end();
    } else {
        funciones.registrarUsuario(req.body);
        res.writeHead(301,
            { Location: '/?creado=true' }
        );
        res.end();
    }
});

app.post('/checkCurso', (req, res) => {
    const cursoXId = funciones.obtenerCursoXId(req.body.idCurso);
    if (cursoXId) {
        res.writeHead(301,
            { Location: '/cursosform?valid=false' }
        );
        res.end();
    } else {
        funciones.registrarCurso(req.body);
        res.writeHead(301,
            { Location: '/cursos' }
        );
        res.end();
    }
});

app.post('/cursos', (req, res) => {
    const usuario = funciones.obtenerUsuarioXDocumento(req.body.documento);
    const creado = req.query.creado;
    if (usuario) {
        res.render('lista-cursos', {
            usuario,
            creado: creado ? true : false
        });
    } else {
        res.writeHead(301,
            { Location: '/?valid=false' }
        );
        res.end();
    }
});

app.get('/cursosform', (req, res) => {
    const valid = req.query.valid
    res.render('formulario-curso', {
        error: valid ? true : false
    });
});

app.get('*', (req, res) => {
    res.render('error');
})

app.listen(3000, () => {
    console.log('Corriendo node en el puerto 3000');
});
