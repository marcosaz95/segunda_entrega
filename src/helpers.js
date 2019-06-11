const hbs = require('hbs');
const funciones = require('./funciones');
const listas = require('./listas');
const fs = require('fs');

hbs.registerHelper('puedeInscribir', (documento, idCurso, inscribir, options) => {
  const cursosXEstudiante = require('./../cursosXUsuario.json');
  const usuario = funciones.obtenerUsuarioXDocumento(documento);
  if (usuario.rol !== 'COORDINADOR') {
    if (cursosXEstudiante && cursosXEstudiante.length) {
      const inscripcion = cursosXEstudiante.find((cur) => cur.idCurso === idCurso && cur.documento === documento);
      if ((!inscripcion && inscribir) || (inscripcion && !inscribir)) {
        return options.fn(this);
      }
    } else if (inscribir) {
      return options.fn(this);
    }
  }
  return options.inverse(this);
});

hbs.registerHelper('esCoordinador', (documento, options) => {
  const usuario = funciones.obtenerUsuarioXDocumento(documento);
  if (usuario && usuario.rol === 'COORDINADOR') {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('eliminarInscripcion', (documento, idCurso) => {
  funciones.eliminarInscripcion(documento, idCurso);
});

hbs.registerHelper('lista1', (documento) => {
  const usuario = funciones.obtenerUsuarioXDocumento(documento);
  if (usuario && usuario.rol === 'COORDINADOR') {
    return listas.listarCursos(documento);
  } else {
    return listas.listarCursosPropios(documento);
  }
});

hbs.registerHelper('lista2', (documento) => {
  const usuario = funciones.obtenerUsuarioXDocumento(documento);
  if (usuario && usuario.rol === 'COORDINADOR') {
    return listas.listarUsuarios(documento);
  } else {
    return listas.listarCursosNoPropios(documento);
  }
});

hbs.registerHelper('listarEstudiantes', (idCurso, documento) => {
  return listas.listarEstudiantes(documento, idCurso);
});
