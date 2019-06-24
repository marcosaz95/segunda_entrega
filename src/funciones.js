const fs = require('fs');
const Usuario = require('./models/usuarios');

const obtenerUsuarioXDocumento = (documento) => {
  return new Promise((resolve, reject) => {
    return Usuario.findOne({ documento }, (err, result) => {
      if (err) {
        reject();
      } else {
        resolve(result);
      }
    })
  })
};

const obtenerCursoXId = (idCurso) => {
  const cursos = require('./../cursos.json');
  if (cursos && cursos.length) {
    const curso = cursos.find((cur) => cur.idCurso === idCurso);
    if (curso) {
      return curso;
    }
  }
  return null;
};

const registrarUsuario = (aspirante) => {
  const nuevoAspirante = new Usuario({
    documento: aspirante.documento,
    nombre: aspirante.nombre,
    correo: aspirante.correo,
    telefono: aspirante.telefono,
    rol: 'ASPIRANTE',
  });
  return new Promise((resolve, reject) => {
    return nuevoAspirante.save((err, result) => {
      if (err) {
        console.log(err.errors.documento);
        reject(err);
      } else {
        resolve(result);
      }
    })
  })
};

const actualizarUsuario = (usuario) => {
  const usuarios = require('./../usuarios.json');
  if (usuarios && usuarios.length) {
    const viejoUsuarioIdx = usuarios.findIndex(us => us.documento === usuario.documento);
    if (viejoUsuarioIdx !== -1) {
      const nuevoUsuario = {
        documento: usuario.documento,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        rol: usuario.rol,
      }
      usuarios[viejoUsuarioIdx] = nuevoUsuario;
      guardarUsuarios(usuarios);
    }

  }
}

const registrarCurso = (curso) => {
  const cursos = require('./../cursos.json');
  const nuevoCurso = {
    idCurso: curso.idCurso,
    nombre: curso.nombre,
    descripcion: curso.descripcion,
    valor: curso.valor,
    modalidad: curso.modalidad,
    intensidadHoraria: curso.intensidadHoraria,
    estado: 'DISPONIBLE',
  };
  if (cursos && cursos.length) {
    cursos.push(nuevoCurso);
    guardarCursos(cursos);
  } else {
    guardarCursos([nuevoCurso]);
  }
};

const eliminarInscripcion = (documento, idCurso) => {
  const cursosXEstudiante = require('./../cursosXUsuario.json');
  if (cursosXEstudiante && cursosXEstudiante.length) {
    const inscripcion = cursosXEstudiante.findIndex((cur) => cur.idCurso === idCurso && cur.documento === documento);
    if (inscripcion !== -1) {
      cursosXEstudiante.splice(inscripcion, 1);
      guardarCursosXEstudiante(cursosXEstudiante);
      console.log('eliminado');
    }
  }
};

const inscribirEstudiante = (documento, idCurso) => {
  const cursosXEstudiante = require('./../cursosXUsuario.json');
  const nuevaInscripcion = {
    idCurso,
    documento,
  };
  cursosXEstudiante.push(nuevaInscripcion);
  guardarCursosXEstudiante(cursosXEstudiante);
};

const cerrarCurso = (idCurso) => {
  const cursos = require('./../cursos.json');
  if (cursos && cursos.length) {
    const cursoIdx = cursos.findIndex(cur => cur.idCurso === idCurso);
    if (cursoIdx !== -1) {
      cursos[cursoIdx].estado = 'CERRADO';
      guardarCursos(cursos);
    }
  }
};

const guardarUsuarios = (usuarios) => {
  const datos = JSON.stringify(usuarios);
  fs.writeFile('usuarios.json', datos, (err) => { });
};
const guardarCursos = (cursos) => {
  const datos = JSON.stringify(cursos);
  fs.writeFile('cursos.json', datos, (err) => { });
};

const guardarCursosXEstudiante = (cursosXEstudiante) => {
  const datos = JSON.stringify(cursosXEstudiante);
  fs.writeFile('cursosXUsuario.json', datos, (err) => { });
};

module.exports = {
  obtenerUsuarioXDocumento,
  registrarUsuario,
  obtenerCursoXId,
  registrarCurso,
  eliminarInscripcion,
  inscribirEstudiante,
  actualizarUsuario,
  cerrarCurso
};
