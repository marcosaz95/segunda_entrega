const CursoXUsuario = require('./models/cursosXUsuarios');

const obtenerInscripcion = (documento, idCurso) => {
  return new Promise((resolve, reject) => {
    return CursoXUsuario.findOne({ documento, idCurso }, (err, result) => {
      if (err) {
        reject();
      } else {
        resolve(result);
      }
    })
  })
}

const eliminarInscripcion = (documento, idCurso) => {
  return new Promise((resolve, reject) => {
    CursoXUsuario.findOneAndDelete({ documento, idCurso }, (err, result) => {
      if (err) {
        reject();
      } else {
        resolve();
      }
    })
  })
};

const inscribirEstudiante = (documento, idCurso) => {
  return new Promise((resolve, reject) => {
    const nuevaInscripcion = new CursoXUsuario({
      idCurso,
      documento
    });
    nuevaInscripcion.save((err, result) => {
      if (err) {
        reject();
      } else {
        resolve();
      }
    })
  });
};

module.exports = {
  eliminarInscripcion,
  inscribirEstudiante,
  obtenerInscripcion,
};
