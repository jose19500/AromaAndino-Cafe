require("dotenv").config();

const express = require("express");
const path = require("node:path");

const { consultarCafeteria } = require("./controllers/cafeteria");
const { consultarServicios } = require("./controllers/servicios");
const { consultarProductos, consultarEspecialidades } = require("./controllers/productos");
const {
  consultarMultimedia,
  consultarContactos,
  crearContacto,
} = require("./controllers/contenido");
const { responderChatbot } = require("./controllers/chatbot");
const { validarContacto } = require("./middlewares/validarContacto");

const app = express();
const puerto = Number(process.env.PORT || 3002);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

app.use(express.json({ limit: "16kb" }));

app.get("/api/cafeteria", consultarCafeteria);
app.get("/api/servicios", consultarServicios);
app.get("/api/productos", consultarProductos);
app.get("/api/especialidades", consultarEspecialidades);
app.get("/api/multimedia", consultarMultimedia);
app.use("/api/media", express.static(path.join(__dirname, "media")));
app.get("/api/contactos", consultarContactos);
app.post("/api/contactos", validarContacto, crearContacto);
app.post("/api/chatbot", responderChatbot);
app.post("/ollama-prompt", responderChatbot);

app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El JSON de la solicitud no es válido." });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({ error: "La solicitud es demasiado grande." });
  }

  console.error("Error en CoffeeHouse", error.message);
  return res.status(500).json({ error: "No se pudo completar la solicitud." });
});

app.listen(puerto, "127.0.0.1", () => {
  console.log(`API de CoffeeHouse en http://127.0.0.1:${puerto}`);
});
