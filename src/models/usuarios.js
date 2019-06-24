const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const usuariosSchema = new Schema({
    documento: {
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
    contrasena: {
        type: String,
        require: true,
    },
    correo: {
        type: String,
    },
    telefono: {
        type: String,
    },
    rol: {
        type: String,
        default: 'ASPIRANTE',
        enum: {values: ['ASPIRANTE', 'COORDINADOR', 'DOCENTE', 'INTERESADO']}
    }
});

usuariosSchema.plugin(uniqueValidator);

const Usuario = mongoose.model('Usuario', usuariosSchema);

module.exports = Usuario;