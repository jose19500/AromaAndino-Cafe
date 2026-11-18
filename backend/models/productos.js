const db = require("../db");

async function listarProductos() {
  const [filas] = await db.execute(`
    SELECT id, nombre, categoria, descripcion, precio, especialidad, imagen
    FROM productos
    ORDER BY id
  `);
  return filas;
}

async function listarEspecialidades() {
  const [filas] = await db.execute(`
    SELECT id, nombre, categoria, descripcion, precio, especialidad, imagen
    FROM productos
    WHERE especialidad = 1
    ORDER BY id
  `);
  return filas;
}

module.exports = { listarProductos, listarEspecialidades };
