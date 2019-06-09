
const fs = require('fs');

const obtenerUsuarioXDocumento = (documento) => {
    const usuarios = require('./../usuarios.json');
    if (usuarios && usuarios.length) {
        const usuario = usuarios.find(us => us.documento === documento);
        if (usuario) {
            return usuario;
        }
    }
    return null;
}

const obtenerCursoXId = (idCurso) => {
    const cursos = require('./../cursos.json');
    if (cursos && cursos.length) {
        const curso = cursos.find(cur => cur.idCurso === idCurso);
        if (curso) {
            return curso;
        }
    }
    return null;
}

const registrarUsuario = (aspirante) => {
    const usuarios = require('./../usuarios.json');
    const nuevoAspirante = {
        documento: aspirante.documento,
        nombre: aspirante.nombre,
        correo: aspirante.correo,
        telefono: aspirante.telefono,
        rol: 'ASPIRANTE'
    }
    if (usuarios && usuarios.length) {
        usuarios.push(nuevoAspirante);
        guardarUsuarios(usuarios);
    } else {
        guardarUsuarios([nuevoAspirante]);
    }
};

const registrarCurso = (curso) => {
    const cursos = require('./../cursos.json');
    const nuevoCurso = {
        idCurso: curso.idCurso,
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        valor: curso.valor,
        modalidad: curso.modalidad,
        intensidadHoraria: curso.intensidadHoraria,
        estado: 'ACTIVO'
    }
    if (cursos && cursos.length) {
        cursos.push(nuevoCurso);
        guardarCursos(cursos);
    } else {
        guardarCursos([nuevoCurso]);
    }
};

const guardarUsuarios = (usuarios) => {
    const datos = JSON.stringify(usuarios);
    fs.writeFile('usuarios.json', datos, (err) => { });
} 
const guardarCursos = (cursos) => {
    const datos = JSON.stringify(cursos);
    fs.writeFile('cursos.json', datos, (err) => { });
} 

module.exports = { obtenerUsuarioXDocumento, registrarUsuario, obtenerCursoXId, registrarCurso };