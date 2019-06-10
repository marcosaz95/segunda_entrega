const hbs = require('hbs');
const funciones = require('./funciones');
const fs = require('fs');

hbs.registerHelper('puedeInscribir', (documento, idCurso, inscribir, options) => {
    const cursosXEstudiante = require('./../cursosXUsuario.json');
    if (cursosXEstudiante && cursosXEstudiante.length) {
        const inscripcion = cursosXEstudiante.find(cur => (cur.idCurso === idCurso && cur.documento === documento));
        if ((!inscripcion && inscribir) || (inscripcion && !inscribir)) {
            return options.fn(this);
        }
    }
    return options.inverse(this);
});

hbs.registerHelper('esCoordinador', (documento, options) => {
    const usuario = funciones.obtenerUsuarioXDocumento(documento);
    if (usuario && usuario.rol === 'COORDINADOR') {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('eliminarInscripcion', (documento, idCurso) => {
    funciones.eliminarInscripcion(documento, idCurso);
})

hbs.registerHelper('listar', (documento, propios) => {
    const usuario = funciones.obtenerUsuarioXDocumento(documento);
    const cursosXEstudiante = require('./../cursosXUsuario.json');
    const cursos = require('./../cursos.json');
    let cursosAMostrar = [];
    if (usuario && usuario.rol === 'COORDINADOR') {
        cursosAMostrar = cursos;
    } else {
        const cursosMatriculados = cursosXEstudiante.filter(ce => ce.documento === documento);
        if (propios) {
            if (cursosMatriculados && cursosMatriculados.length) {
                cursosMatriculados.forEach(curso => {
                    cursosAMostrar.push(cursos.find(cur => cur.idCurso === curso.idCurso));
                });
            }
        } else {
            if (!cursosMatriculados || !cursosMatriculados.length) {
                cursosAMostrar = cursos;
            } else {
                cursos.forEach(curso => {
                    if (!cursosMatriculados.find(cur => cur.idCurso === curso.idCurso)) {
                        cursosAMostrar.push(curso);
                    }
                });
            }
        }
    }
    if (cursosAMostrar && cursosAMostrar.length) {
        let text = `<table class="table"> 
                            <thead>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Valor</th>
                                <th>Acciones</th>
                            </thead>
                            <tbody>`;
        cursosAMostrar.forEach(cur => {
            text = `${text} 
                    <tr>
                        <td>${cur.nombre}</td>
                        <td>${cur.descripcion}</td>
                        <td>${cur.valor}</td>
                        <td>
                            <button class="btn btn-primary" type="button" onclick="mostrarDetalle(${cur.idCurso}, ${documento})">Detalle</button>
                        </td>
                    </tr>`
        });
        text = `${text}</tbody></table>`
        return text;
    } else {
        return '<h3>No hay cursos disponibles para mostrar</h3>';
    }
});

hbs.registerHelper('listarEstudiantes', (idCurso, documento) => {
    const usuario = funciones.obtenerUsuarioXDocumento(documento);
    if (!usuario || usuario.rol !== 'COORDINADOR') {
        return '';
    }
    const cursosXEstudiante = require('./../cursosXUsuario.json');
    const usuarios = require('./../usuarios.json');
    let estudiantesAMostrar = [];
    const estudiantesInscritos = cursosXEstudiante.filter(ce => ce.idCurso === idCurso);
    if (estudiantesInscritos && estudiantesInscritos.length) {
        estudiantesInscritos.forEach(est => {
            estudiantesAMostrar.push(usuarios.find(us => us.documento === est.documento));
        });
    }
    if (estudiantesAMostrar && estudiantesAMostrar.length) {
        let text = `<table class="table"> 
                            <thead>
                                <th>Documento</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </thead>
                            <tbody>`;
        estudiantesAMostrar.forEach(est => {
            text = `${text} 
                    <tr>
                        <td>${est.documento}</td>
                        <td>${est.nombre}</td>
                        <td>
                            <button class="btn btn-danger" type="button">Eliminar</button>
                        </td>
                    </tr>`
        });
        text = `${text}</tbody></table>`
        return text;
    } else {
        return '<h3>No hay estudiantes inscritos en el curso</h3>';
    }
});

hbs.registerHelper('listarUsuarios', () => {
    const usuarios = require('./../usuarios.json');
    if (usuarios && usuarios.length) {
        let text = `<table class="table"> 
                            <thead>
                                <th>Documento</th>
                                <th>Nombre</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </thead>
                            <tbody>`;
        usuarios.forEach(usu => {
            text = `${text} 
                    <tr>
                        <td>${usu.documento}</td>
                        <td>${usu.nombre}</td>
                        <td>${usu.rol}</td>
                        <td>
                            <button class="btn btn-danger" type="button">Eliminar</button>
                        </td>
                    </tr>`
        });
        text = `${text}</tbody></table>`
        return text;
    } else {
        return '<h3>No hay información por mostrar</h3>';
    }
});
