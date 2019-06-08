const hbs = require('hbs');
const fs = require('fs');

hbs.registerHelper('registrarAspirante', (aspirante) => {
    console.log('helper', aspirante);
    const existsFile = fs.existsSync('./../usuarios.json');
    const nuevoAspirante = {
        documento: aspirante.documento,
        nombre: aspirante.nombre,
        correo: aspirante.correo,
        telefono: aspirante.telefono,
        rol: 'ASPIRANTE'
    }
    if (existsFile) {
        const usuarios = JSON.parse(fs.readFileSync('./../usuarios.json'));
        const usuarioExistente = usuarios.find(us => us.documento === aspirante.documento);
        if (usuarioExistente) {

        } else {
            usuarios.push(nuevoAspirante);
            guardarUsuarios(usuarios);
        }
    } else {
        guardarUsuarios([nuevoAspirante]);
    }
});

hbs.registerHelper('listar', (documento, propios) => {
    const cursosXEstudiante = require('./../cursosXUsuario.json');
    const cursos = require('./../cursos.json');
    let cursosAMostrar = [];
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
    if (cursosAMostrar && cursosAMostrar.length) {
        let text = `<table class="table"> 
                            <thead>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Valor</th>
                            </thead>
                            <tbody>`;
        cursosAMostrar.forEach(cur => {
            text = `${text} 
                    <tr>
                        <td>${cur.nombre}</td>
                        <td>${cur.descripcion}</td>
                        <td>${cur.valor}</td>
                    </tr>`
        });
        text = `${text}</tbody></table>`
        return text;
    } else {
        return '<h3>No hay cursos disponibles para mostrar</h3>';
    }
});

const guardarUsuarios = (usuarios) => {
    const datos = JSON.stringify(usuarios);
    fs.writeFile('usuarios.json', datos, (err) => { });
} 
