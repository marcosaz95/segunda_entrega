const listarCursos = (documento) => {
  const cursos = require('./../cursos.json');
  return retornarTablaCursos(cursos, documento);
};

const listarCursosPropios = (documento) => {
  const cursosXEstudiante = require('./../cursosXUsuario.json');
  const cursos = require('./../cursos.json');
  let cursosAMostrar = [];
  const cursosMatriculados = cursosXEstudiante.filter((ce) => ce.documento === documento);
  if (cursosMatriculados && cursosMatriculados.length) {
    cursosMatriculados.forEach((curso) => {
      cursosAMostrar.push(cursos.find((cur) => cur.idCurso === curso.idCurso));
    });
  }
  return retornarTablaCursos(cursosAMostrar, documento);
};

const listarCursosNoPropios = (documento) => {
  const cursosXEstudiante = require('./../cursosXUsuario.json');
  const cursos = require('./../cursos.json');
  let cursosAMostrar = [];
  const cursosMatriculados = cursosXEstudiante.filter((ce) => ce.documento === documento);
  if (!cursosMatriculados || !cursosMatriculados.length) {
    cursosAMostrar = cursos;
  } else {
    cursos.forEach((curso) => {
      if (!cursosMatriculados.find((cur) => cur.idCurso === curso.idCurso)) {
        cursosAMostrar.push(curso);
      }
    });
  }
  return retornarTablaCursos(cursosAMostrar, documento);
};

const listarUsuarios = (documento) => {
  const usuarios = require('./../usuarios.json');
  const usuariosAMostrar = usuarios.filter((us) => us.documento !== documento);
  if (usuariosAMostrar && usuariosAMostrar.length) {
    let text = `<table class="table"> 
                              <thead>
                                  <th>Documento</th>
                                  <th>Nombre</th>
                                  <th>Rol</th>
                                  <th>Acciones</th>
                              </thead>
                              <tbody>`;
    usuariosAMostrar.forEach((usu) => {
      text = `${text} 
                      <tr>
                          <td>${usu.documento}</td>
                          <td>${usu.nombre}</td>
                          <td>${usu.rol}</td>
                          <td>
                              <button class="btn btn-primary" type="button" onclick="mostrarDetalle(${
                                usu.documento
                              }, ${documento}, 'u')">Detalle</button>
                          </td>
                      </tr>`;
    });
    text = `${text}</tbody></table>`;
    return text;
  } else {
    return '<h3>No hay información por mostrar</h3>';
  }
};

const retornarTablaCursos = (cursos, documento) => {
  if (cursos && cursos.length) {
    let text = `<table class="table"> 
                                  <thead>
                                      <th>Nombre</th>
                                      <th>Descripción</th>
                                      <th>Valor</th>
                                      <th>Acciones</th>
                                  </thead>
                                  <tbody>`;
    cursos.forEach((cur) => {
      text = `${text} 
                          <tr>
                              <td>${cur.nombre}</td>
                              <td>${cur.descripcion}</td>
                              <td>${cur.valor}</td>
                              <td>
                                  <button class="btn btn-primary" type="button" onclick="mostrarDetalle(${
                                    cur.idCurso
                                  }, ${documento}, 'c')">Detalle</button>
                              </td>
                          </tr>`;
    });
    text = `${text}</tbody></table>`;
    return text;
  } else {
    return '<h3>No hay cursos disponibles para mostrar</h3>';
  }
};

module.exports = {
  listarCursos,
  listarCursosPropios,
  listarCursosNoPropios,
  listarUsuarios,
};
