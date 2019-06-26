
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
    funciones.registrarCurso(req.body).then((data) => {
        res.writeHead(301, { Location: '/lista?creado=true' });
        res.end();
    }, (err) => {
        console.log(err);
        res.render('formulario-curso', {
            mensaje: 'Ya existe un curso con este id'
        })
    })
});

app.post('/actualizarUsuario', (req, res) => {
    console.log(req.body);
    funciones.actualizarUsuario(req.body);
    res.redirect(307, `/lista?actualizado=true`);
});

app.post('/lista', (req, res) => {
    funciones.obtenerUsuarioXDocumento(req.body.documento).then(async (data) => {
        if (data) {
            const creado = req.query.creado ? true : false;
            const actualizado = req.query.actualizado ? true : false;
            req.session.usuario = data;
            let lista1;
            let lista2;
            if (data.rol === 'COORDINADOR') {
                lista1 = await funciones.obtenerCursos();
                lista2 = await funciones.obtenerUsuariosNoDocumento(req.body.documento);
            } else {
                lista1 = await funciones.obtenerUsuariosXCurso(req.body.documento);
                lista2 = await funciones.obtenerUsuariosNoCurso(req.body.documento);
            }
            res.render('lista', {
                usuario: data,
                nombre: req.session.usuario.nombre,
                creado,
                actualizado,
                lista1,
                lista2
            });
        } else {
            res.writeHead(301, { Location: '/?valid=false' });
            res.end();
        }
    }, (err) => { })
});

app.get('/cursosform', (req, res) => {
    const valid = req.query.valid;
    res.render('formulario-curso', {
        error: valid ? true : false,
    });
});

app.get('/detalle', (req, res) => {
    console.log(req.query);
    const split = req.query.info.split(',');
    const type = split[0]
    if (type === 'u') {
        const usuario = funciones.obtenerUsuarioXDocumento(req.query.id);
        res.render('detalle-usuario', {
            usuario,
            documento: req.query.documento,
        });
    } else {
        funciones.obtenerCursoXId(split[1]).then((curso) => {
            res.render('detalle-curso', {
                curso,
                // documento: req.query.documento,
                // eliminado: req.query.eliminado,
                // inscrito: req.query.inscrito,
                // cerrado: req.query.cerrado
            });
        })
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

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err)
    })
    res.redirect('/')
})

app.get('*', (req, res) => {
    res.render('error');
});

module.exports = app;