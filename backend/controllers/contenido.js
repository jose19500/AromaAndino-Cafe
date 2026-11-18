const { listarMultimedia, guardarContacto, listarContactos } = require("../models/contenido");

async function consultarMultimedia(req, res, next) {
  try {
    res.json(await listarMultimedia());
  } catch (error) {
    next(error);
  }
}

async function consultarContactos(req, res, next) {
  try {
    res.json(await listarContactos());
  } catch (error) {
    next(error);
  }
}

async function crearContacto(req, res, next) {
  try {
    const id = await guardarContacto(res.locals.contacto);
    res.status(201).json({ id, mensaje: "Recibimos tu mensaje." });
  } catch (error) {
    next(error);
  }
}

module.exports = { consultarMultimedia, consultarContactos, crearContacto };