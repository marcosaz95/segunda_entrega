
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const funcionesInscripcion = require('./funcionesInscripcion');
const funcionesCurso = require('./funcionesCurso');
const funcionesUsuario = require('./funcionesUsuario');

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
    funcionesUsuario.registrarUsuario(req.body).then((data) => {
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
    funcionesCurso.registrarCurso(req.body).then((data) => {
        res.writeHead(301, { Location: '/lista?creado=true' });
        res.end();
    }, (err) => {
        res.render('formulario-curso', {
            mensaje: 'Ya existe un curso con este id'
        })
    })
});

app.post('/actualizarUsuario', (req, res) => {
    funcionesUsuario.actualizarUsuario(req.body).then(() => {
        res.writeHead(301, { Location: '/lista?actualizado=true' });
        res.end();
    })
});

app.post('/checkLogin', (req, res) => {
    funcionesUsuario.obtenerUsuarioXDocumento(req.body.documento).then((data) => {
        if (data) {
            req.session.usuario = data;
            localStorage.setItem('documento', data.documento);
            res.writeHead(301, { Location: '/lista' })
        } else {
            res.writeHead(301, { Location: '/?valid=false' });
        }
        res.end();
    })
})

app.get('/lista', (req, res) => {
    const usuario = req.session.usuario;
    if (!usuario) {
        res.writeHead(301, { Location: '/' });
    } else {
        const creado = req.query.creado ? true : false;
        const actualizado = req.query.actualizado ? true : false;
        const cerrado = req.query.cerrado ? true : false;
        let promises;
        if (usuario.rol === 'COORDINADOR') {
            promises = [funcionesCurso.obtenerCursos(), funcionesUsuario.obtenerUsuariosNoDocumento(usuario.documento)];
        } else if (usuario.rol === 'DOCENTE') {
            promises = [funcionesCurso.obtenerCursosDocente(usuario.documento)];
        } else {
            promises = [funcionesCurso.obtenerCursosXUsuario(usuario.documento), funcionesCurso.obtenerCursosNoUsuario(usuario.documento)];
        }
        Promise.all(promises).then((values) => {
            const lista2 = values[1] ? values[1] : false;
            res.render('lista', {
                usuario,
                creado,
                actualizado,
                lista1: values[0],
                lista2,
                cerrado
            });
        })
    }
});

app.get('/cursosform', (req, res) => {
    const valid = req.query.valid;
    res.render('formulario-curso', {
        error: valid ? true : false,
    });
});

app.get('/detalle', (req, res) => {
    const info = req.query.info;
    const type = info[0];
    if (!req.session.usuario) {
        res.redirect('/');
    } else {
        if (type === 'u') {
            const doc = info.substring(1, info.length);
            funcionesUsuario.obtenerUsuarioXDocumento(doc).then((usuario) => {
                res.render('detalle-usuario', {
                    usuario,
                });
            })
        } else {
            const documento = req.session.usuario ? req.session.usuario.documento : localStorage.getItem('documento');
            funcionesCurso.obtenerCursoXId(info.substring(1, info.length)).then(async (curso) => {
                const inscripcion = await funcionesInscripcion.obtenerInscripcion(documento, curso.idCurso);
                let listaEstudiantes;
                let listaDocentes;
                if (req.session.usuario.rol === 'COORDINADOR') {
                    listaDocentes = await funcionesUsuario.obtenerDocentes();
                }
                if (['COORDINADOR', 'DOCENTE'].includes(req.session.usuario.rol)) {
                    listaEstudiantes = await funcionesUsuario.obtenerEstudiantes(curso.idCurso);
                }
                res.render('detalle-curso', {
                    curso,
                    documento,
                    rol: req.session.usuario.rol,
                    estaInscrito: inscripcion ? true : false,
                    eliminado: req.query.eliminado,
                    inscrito: req.query.inscrito,
                    listaEstudiantes,
                    listaDocentes,
                    
                });
            })
        }
    }
});

app.get('/cambiarInscripcion', (req, res) => {
    if (req.query.documento && req.query.idCurso) {
        if (!req.query.estaInscrito || req.query.estaInscrito === 'false') {
            funcionesInscripcion.inscribirEstudiante(req.query.documento, req.query.idCurso).then((data) => {
                res.redirect(307, `/detalle?info=c${req.query.idCurso}&inscrito=true`);
            })
        } else {
            funcionesInscripcion.eliminarInscripcion(req.query.documento, req.query.idCurso).then((data) => {
                res.redirect(307, `/detalle?info=c${req.query.idCurso}&eliminado=true`);
            })

        }
    } else {
        res.redirect(307, `/detalle?info=c${req.query.idCurso}`);
    }
})

app.get('/cerrarCurso', (req, res) => {
    if (req.query.docente && req.query.idCurso) {
        funcionesCurso.cerrarCurso(req.query.docente, req.query.idCurso).then(() => {
            res.redirect(307, `/lista?cerrado=true`);
        })
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