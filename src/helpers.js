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
  const usuario = funciones.obtenerUsuarioXDocumento(documento);
  if (!usuario || usuario.rol !== 'COORDINADOR') {
    return '';
  }
  const cursosXEstudiante = require('./../cursosXUsuario.json');
  const usuarios = require('./../usuarios.json');
  let estudiantesAMostrar = [];
  const estudiantesInscritos = cursosXEstudiante.filter((ce) => ce.idCurso === idCurso);
  if (estudiantesInscritos && estudiantesInscritos.length) {
    estudiantesInscritos.forEach((est) => {
      estudiantesAMostrar.push(usuarios.find((us) => us.documento === est.documento));
    });
  }
  if (estudiantesAMostrar && estudiantesAMostrar.length) {
    let text = `<table class="table"> 
                            <thead>
                                <th>Documento</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </thead>
                            <tbody>`;
    estudiantesAMostrar.forEach((est) => {
      text = `${text} 
                    <tr>
                        <td>${est.documento}</td>
                        <td>${est.nombre}</td>
                        <td>
                            <button class="btn btn-danger" type="button">Eliminar</button>
                        </td>
                    </tr>`;
    });
    text = `${text}</tbody></table>`;
    return text;
  } else {
    return '<h3>No hay estudiantes inscritos en el curso</h3>';
  }
});
