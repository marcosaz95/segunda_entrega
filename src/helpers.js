const hbs = require('hbs');
const listas = require('./listas');

hbs.registerHelper('esCoordinador', (rol, options) => {
  if (rol === 'COORDINADOR') {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('esAspirante', (rol, options) => {
  if (rol !== 'COORDINADOR' && rol !== 'DOCENTE') {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('puedeInscribir', (estaInscrito, rol, inscripcion, estado, options) => {
  if (rol === 'COORDINADOR' || estado === 'CERRADO') {
    return options.inverse(this);
  }
  if ((estaInscrito && inscripcion) || (!estaInscrito && !inscripcion)) {
    return options.fn(this);
  }
  return options.inverse(this);
})


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

hbs.registerHelper('listarEstudiantes', (lista, rol, idCurso) => {
  return listas.listarEstudiantes(lista, rol, idCurso);
});

hbs.registerHelper('listarDocentes', (lista, idCurso, rol) => {
  if (rol === 'COORDINADOR') {
    return listas.listarDocentes(lista, idCurso);
  } 
  return '';
});
