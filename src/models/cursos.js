const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const cursosSchema = new Schema({
    idCurso: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    descripcion: {
        type: String,
        require: true,
    },
    valor: {
        type: Number,
        require: true
    },
    modalidad: {
        type: String,
        enum: {values: ['Presencial', 'Virtual']}
    },
    intensidadHoraria: {
        type: String,
    },
    estado: {
        type: String,
        default: 'DISPONIBLE',
        enum: {values: ['DISPONIBLE', 'CERRADO']}
    },
    documentoDocente: {
        type: String
    }
});

cursosSchema.plugin(uniqueValidator);

const Curso = mongoose.model('Curso', cursosSchema);

module.exports = Curso;