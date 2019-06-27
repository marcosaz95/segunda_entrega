const Usuario = require('./models/usuarios');
const CursoXUsuario = require('./models/cursosXUsuarios');

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

const obtenerUsuariosNoDocumento = (documento) => {
    return new Promise((resolve, reject) => {
        return Usuario.find({ documento: { $ne: documento } }, (err, result) => {
            if (err) {
                reject();
            } else {
                resolve(result);
            }
        })
    })
}

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
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
};

const actualizarUsuario = (usuario) => {
    return new Promise((resolve, reject) => {
        return Usuario.findOneAndUpdate({ documento: usuario.documento }, usuario, { new: true, useFindAndModify: false }, (err, result) => {
            if (err) {
                reject();
            } else {
                resolve();
            }
        })
    });
}

const obtenerEstudiantes = (idCurso) => {
    return new Promise((resolve, reject) => {
        return CursoXUsuario.find({ idCurso }, (err, result) => {
            if (err) {
                reject();
            } else if (!result) {
                resolve(result);
            } else {
                return Usuario.find({ documento: { $in: result.map(usuario => usuario.documento) } }, (err, resultEstudiante) => {
                    if (err) {
                        reject();
                    } else {
                        resolve(resultEstudiante);
                    }
                })
            }
        })
    })
}

const obtenerDocentes = () => {
    return new Promise((resolve, reject) => {
      return Usuario.find({ rol: 'DOCENTE' }, (err, result) => {
        if (err) {
          reject();
        } else {
          resolve(result);
        }
      })
    })
  }

module.exports = { obtenerUsuarioXDocumento, obtenerUsuariosNoDocumento, registrarUsuario, actualizarUsuario, obtenerEstudiantes, obtenerDocentes }