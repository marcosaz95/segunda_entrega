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

hbs.registerHelper('puedeCerrar', (documento, idCurso, options) => {
  const curso = funciones.obtenerCursoXId(idCurso);
  const usuario = funciones.obtenerUsuarioXDocumento(documento);
  if (usuario.rol === 'COORDINADOR' && curso.estado === 'DISPONIBLE') {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('esCoordinador', (rol, options) => {
  if (rol === 'COORDINADOR') {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('eliminarInscripcion', (documento, idCurso) => {
  funciones.eliminarInscripcion(documento, idCurso);
});

hbs.registerHelper('obtenerLista1', (lista) => {
  return listas.retornarTablaCursos(lista);
})

hbs.registerHelper('obtenerLista2', (lista, rol) => {
  if (rol === 'COORDINADOR') {
    return listas.listarUsuarios(lista);
  } else {
    return listas.retornarTablaCursos(lista);
  }
})

hbs.registerHelper('listarEstudiantes', (idCurso, documento) => {
  return listas.listarEstudiantes(documento, idCurso);
});
