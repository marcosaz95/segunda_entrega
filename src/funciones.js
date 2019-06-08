
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

module.exports = {obtenerUsuarioXDocumento};