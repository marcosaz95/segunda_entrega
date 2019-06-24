const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const cursosSchema = new Schema({
    idCUrso: {
        type: String,
        require: true,
        trim: true
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
    }
});

cursosSchema.plugin(uniqueValidator);

const Curso = mongoose.model('Curso', cursosSchema);

module.exports = Curso;