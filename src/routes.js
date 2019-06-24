
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const funciones = require('./funciones');

//folders
const viewsDirectory = path.join(__dirname, './views');
const partialsDirectory = path.join(__dirname, './partials');

//hbs
app.set('view engine', 'hbs');
app.set('views', viewsDirectory);
hbs.registerPartials(partialsDirectory);

app.get('/', (req, res) => {
    const valid = req.query.valid;
    const creado = req.query.creado;
    localStorage.setItem('documento', '');
    res.render('login', {
        error: valid ? true : false,
        creado: creado ? true : false,
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/check', (req, res) => {
    funciones.registrarUsuario(req.body).then((data) => {
        res.writeHead(301, { Location: '/?creado=true' });
        res.end();
    }, (err) => {
        const mensaje = err.errors && err.errors.documento && err.errors.documento.kind === 'unique' ? 'Ya existe un usuario con este documento' : 'Algo pasó, intente nuevamente';
        res.render('register', {
            mensaje
        })
    })
});

app.post('/checkCurso', (req, res) => {
    const cursoXId = funciones.obtenerCursoXId(req.body.idCurso);
    if (cursoXId) {
        res.writeHead(301, { Location: '/cursosform?valid=false' });
        res.end();
    } else {
        funciones.registrarCurso(req.body);
        res.redirect(307, `/lista?creado=true`);
        // res.writeHead(301, { Location: '/cursos' });
        res.end();
    }
});

app.post('/actualizarUsuario', (req, res) => {
    console.log(req.body);
    funciones.actualizarUsuario(req.body);
    res.redirect(307, `/lista?actualizado=true`);
});

app.post('/lista', (req, res) => {
    const creado = req.query.creado;
    const logDoc = localStorage.getItem('documento');
    const actualizado = req.query.actualizado;
    let doc = creado ? logDoc : req.body.documento;
    const usuario = funciones.obtenerUsuarioXDocumento(doc);
    if (usuario) {
        localStorage.setItem('documento', req.body.documento);
        res.render('lista', {
            usuario,
            creado: creado ? true : false,
            actualizado: actualizado ? true : false
        });
    } else {
        res.writeHead(301, { Location: '/?valid=false' });
        res.end();
    }
});

app.get('/cursosform', (req, res) => {
    const valid = req.query.valid;
    res.render('formulario-curso', {
        error: valid ? true : false,
    });
});

app.get('/detalle', (req, res) => {
    localStorage.setItem('documento', req.query.documento);
    if (req.query.tipo === 'u') {
        const usuario = funciones.obtenerUsuarioXDocumento(req.query.id);
        res.render('detalle-usuario', {
            usuario,
            documento: req.query.documento,
        });
    } else {
        const curso = funciones.obtenerCursoXId(req.query.id);
        res.render('detalle-curso', {
            curso,
            documento: req.query.documento,
            eliminado: req.query.eliminado,
            inscrito: req.query.inscrito,
            cerrado: req.query.cerrado
        });
    }
});

app.get('/eliminarInscripcion', (req, res) => {
    localStorage.setItem('documento', req.query.loggedDoc);
    if (req.query.documento && req.query.idCurso) {
        funciones.eliminarInscripcion(req.query.documento, req.query.idCurso);
        res.redirect(307, `/detalle?id=${req.query.idCurso}&documento=${req.query.loggedDoc}&tipo=c&eliminado=true`);
    }
});

app.get('/cerrarCurso', (req, res) => {
    localStorage.setItem('documento', req.query.loggedDoc);
    if (req.query.idCurso) {
        funciones.cerrarCurso(req.query.idCurso);
        res.redirect(307, `/detalle?id=${req.query.idCurso}&documento=${req.query.loggedDoc}&tipo=c&cerrado=true`);
    }
});

app.get('/inscribir', (req, res) => {
    console.log('inscribir', req.query);
    localStorage.setItem('documento', req.query.loggedDoc);
    if (req.query.documento && req.query.idCurso) {
        funciones.inscribirEstudiante(req.query.documento, req.query.idCurso);
        res.redirect(307, `/detalle?id=${req.query.idCurso}&documento=${req.query.loggedDoc}&tipo=c&inscrito=true`);
    } else {
        res.redirect(307, `/detalle?id=${req.query.idCurso}&documento=${req.query.loggedDoc}&tipo=c`);
    }
});

app.get('*', (req, res) => {
    res.render('error');
});

module.exports = app;