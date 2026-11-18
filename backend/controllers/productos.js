const { listarProductos, listarEspecialidades } = require("../models/productos");

async function consultarProductos(req, res, next) {
  try {
    res.json(await listarProductos());
  } catch (error) {
    next(error);
  }
}

async function consultarEspecialidades(req, res, next) {
  try {
    res.json(await listarEspecialidades());
  } catch (error) {
    next(error);
  }
}

module.exports = { consultarProductos, consultarEspecialidades };