const funciones = require('./funciones');
const Curso = require('./models/cursos');

const listarCursos = () => {
  return new Promise((resolve, reject) => {
    Curso.find({}, (err, cursos) => {
      if (err) {
        reject();
      }
      resolve(retornarTablaCursos(cursos));
    })
  })
};

const listarCursosPropios = (documento) => {
  // return new Promise((resolve, reject) => {
  //   CursoXUsuario.find({documento}, (err, cursos) => {
  //     if (err) {
  //       reject();
  //     }
  //     resolve(retornarTablaCursos(cursos));
  //   })
  // })
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
  const todosLosCursos = cursos.filter((cur) => cur.estado === 'DISPONIBLE');
  const cursosMatriculados = cursosXEstudiante.filter((ce) => ce.documento === documento);
  if (!cursosMatriculados || !cursosMatriculados.length) {
    cursosAMostrar = todosLosCursos;
  } else {
    todosLosCursos.forEach((curso) => {
      if (!cursosMatriculados.find((cur) => cur.idCurso === curso.idCurso)) {
        cursosAMostrar.push(curso);
      }
    });
  }
  return retornarTablaCursos(cursosAMostrar, documento);
};

const listarUsuarios = (usuariosAMostrar) => {
  let text;
  if (usuariosAMostrar && usuariosAMostrar.length) {
    text = `<table class="table"> 
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
                                        <button class="btn btn-primary" type="button")">Detalle</button>
                                    </td>
                                </tr>`;
    });
    text = `${text}</tbody></table>`;
  } else {
    text = '<h3>No hay información por mostrar</h3>';
  }
  return text;
};

const listarEstudiantes = (documento, idCurso) => {
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
                            <button class="btn btn-danger" type="button" onclick="eliminarInscripcion(${
        est.documento
        }, ${idCurso}, ${documento})">Eliminar</button>
                        </td>
                    </tr>`;
    });
    text = `${text}</tbody></table>`;
    return text;
  } else {
    return '<h3>No hay estudiantes inscritos en el curso</h3>';
  }
};

const retornarTablaCursos = (cursos) => {
  console.log(cursos);
  if (cursos && cursos.length) {
    let text = `<form action="/detalle" method="get"><table class="table"> 
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
                                  <button class="btn btn-primary" type="submit" name="info" value="c,${cur.idCurso}">Detalle</button>
                              </td>
                          </tr>`;
    });
    text = `${text}</tbody></table></form>`;
    console.log(text);
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
  listarEstudiantes,
  retornarTablaCursos,
  listarUsuarios
};
