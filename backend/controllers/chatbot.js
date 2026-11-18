const { obtenerCafeteria } = require("../models/cafeteria");
const { listarServicios } = require("../models/servicios");
const { listarProductos } = require("../models/productos");
const { consultarOllama } = require("../chatbot");

async function responderChatbot(req, res, next) {
  const textoEntrada = req.body?.prompt ?? req.body?.pregunta ?? "";
  const pregunta = typeof textoEntrada === "string" ? textoEntrada.trim() : "";

  if (!pregunta || pregunta.length > 500) {
    return res.status(400).json({ error: "Escribe una pregunta de hasta 500 caracteres." });
  }

  let datos;
  try {
    const [cafeteria, servicios, productos] = await Promise.all([
      obtenerCafeteria(),
      listarServicios(),
      listarProductos(),
    ]);
    datos = { cafeteria, servicios, productos };
  } catch (error) {
    return next(error);
  }

  try {
    const respuesta = await consultarOllama(pregunta, datos);
    return res.json({ response: respuesta });
  } catch (error) {
    if (error.name === "TimeoutError") {
      return res.status(504).json({ error: "El chatbot tardó demasiado. Intenta otra vez." });
    }
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error("Error al consultar Ollama", error.message);
    return res.status(502).json({ error: "No se pudo conectar con Ollama." });
  }
}

module.exports = { responderChatbot };
