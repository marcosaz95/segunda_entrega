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
const dirNode_modules = path.join(__dirname, '../node_modules');
app.use(express.static(publicDirectory));
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

hbs.registerPartials(partialsDirectory);
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

var loggedDoc;

app.get('/', (req, res) => {
  const valid = req.query.valid;
  const creado = req.query.creado;
  loggedDoc = '';
  res.render('login', {
    error: valid ? true : false,
    creado: creado ? true : false,
  });
});

app.get('/register', (req, res) => {
  const valid = req.query.valid;
  res.render('register', {
    error: valid ? true : false,
  });
});

app.post('/check', (req, res) => {
  const usuarioXDocumento = funciones.obtenerUsuarioXDocumento(req.body.documento);
  if (usuarioXDocumento) {
    res.writeHead(301, { Location: '/register?valid=false' });
    res.end();
  } else {
    funciones.registrarUsuario(req.body);
    res.writeHead(301, { Location: '/?creado=true' });
    res.end();
  }
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
  const actualizado = req.query.actualizado;
  let doc = creado ? loggedDoc : req.body.documento;
  const usuario = funciones.obtenerUsuarioXDocumento(doc);
  if (usuario) {
    loggedDoc = req.body.documento;
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
  loggedDoc = req.query.documento;
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
  loggedDoc = req.query.loggedDoc;
  if (req.query.documento && req.query.idCurso) {
    funciones.eliminarInscripcion(req.query.documento, req.query.idCurso);
    res.redirect(307, `/detalle?id=${req.query.idCurso}&documento=${loggedDoc}&tipo=c&eliminado=true`);
  }
});

app.get('/cerrarCurso', (req, res) => {
  console.log(req.query);
  loggedDoc = req.query.loggedDoc;
  if (req.query.idCurso) {
    funciones.cerrarCurso(req.query.idCurso);
    res.redirect(307, `/detalle?id=${req.query.idCurso}&documento=${loggedDoc}&tipo=c&cerrado=true`);
  }
});

app.get('/inscribir', (req, res) => {
  console.log('inscribir', req.query);
  loggedDoc = req.query.documento;
  if (req.query.documento && req.query.idCurso) {
    funciones.inscribirEstudiante(req.query.documento, req.query.idCurso);
    res.redirect(307, `/detalle?id=${req.query.idCurso}&documento=${loggedDoc}&tipo=c&inscrito=true`);
  } else {
    res.redirect(307, `/detalle?id=${req.query.idCurso}&documento=${loggedDoc}&tipo=c`);
  }
});

app.get('*', (req, res) => {
  res.render('error');
});

app.listen(3000, () => {
  console.log('Corriendo node en el puerto 3000');
});
