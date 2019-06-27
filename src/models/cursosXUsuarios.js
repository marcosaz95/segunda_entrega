const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cursosXUsuario = new Schema({
    idCurso: {
        type: String,
        require: true,
    },
    documento: {
        type: String,
        require: true,
    },
});

const CursoXUsuario = mongoose.model('CursoXUsuario', cursosXUsuario);

module.exports = CursoXUsuario;