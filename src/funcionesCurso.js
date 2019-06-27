const Curso = require('./models/cursos');
const CursoXUsuario = require('./models/cursosXUsuarios');

const obtenerCursoXId = (idCurso) => {
    return new Promise((resolve, reject) => {
        return Curso.findOne({ idCurso }, (err, result) => {
            if (err) {
                reject();
            } else {
                resolve(result);
            }
        })
    })
};

const obtenerCursos = () => {
    return new Promise((resolve, reject) => {
        return Curso.find({ estado: 'DISPONIBLE' }, (err, result) => {
            if (err) {
                reject();
            } else {
                resolve(result);
            }
        })
    })
}

const obtenerCursosDocente = (documentoDocente) => {
    return new Promise((resolve, reject) => {
        return Curso.find({ documentoDocente }, (err, result) => {
            if (err) {
                reject();
            } else {
                resolve(result);
            }
        })
    })
}

const registrarCurso = (curso) => {
    const nuevoCurso = new Curso({
        idCurso: curso.idCurso,
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        valor: curso.valor,
        modalidad: curso.modalidad,
        intensidadHoraria: curso.intensidadHoraria,
        estado: 'DISPONIBLE',
    });
    return new Promise((resolve, reject) => {
        return nuevoCurso.save((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
};


const cerrarCurso = (docente, idCurso) => {
    return new Promise((resolve, reject) => {
        return Curso.findOneAndUpdate({ idCurso }, { $set: { estado: 'CERRADO', documentoDocente: docente } }, (err, res) => {
            if (err) {
                reject();
            } else {
                resolve();
            }
        })
    })
};

const obtenerCursosXUsuario = (documento) => {
    return new Promise((resolve, reject) => {
        return CursoXUsuario.find({ documento }, (err, result) => {
            if (err) {
                reject();
            } else if (!result) {
                resolve(result);
            } else {
                return Curso.find({ idCurso: { $in: result.map(curso => curso.idCurso) } }, (err, resultCurso) => {
                    if (err) {
                        reject();
                    } else {
                        resolve(resultCurso);
                    }
                })
            }
        })
    })
}

const obtenerCursosNoUsuario = (documento) => {
    return new Promise((resolve, reject) => {
        return CursoXUsuario.find({ documento }, (err, result) => {
            if (err) {
                reject();
            } else if (!result) {
                resolve(result);
            } else {
                return Curso.find({ idCurso: { $nin: result.map(curso => curso.idCurso) }, estado: 'DISPONIBLE' }, (err, resultCurso) => {
                    if (err) {
                        reject();
                    } else {
                        resolve(resultCurso);
                    }
                })
            }
        })
    })
}

module.exports = { obtenerCursoXId, obtenerCursos, obtenerCursosDocente, registrarCurso, cerrarCurso, obtenerCursosXUsuario, obtenerCursosNoUsuario }