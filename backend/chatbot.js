const ollamaUrl = (process.env.OLLAMA_URL || "http://127.0.0.1:11434").replace(/\/+$/, "");
const modelo = process.env.OLLAMA_MODEL || "gemma3:4b";

async function consultarOllama(pregunta, datos) {
  const respuesta = await fetch(`${ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: modelo,
      prompt: pregunta,
      stream: false,
      system: [
        "Te llamas Don Grano IA y eres el barista virtual de la cafetería 'Aroma Andino Café' en Cochabamba, Bolivia. Responde en español, con calidez y de forma clara y breve.",
        "Responde sobre la cafetería (historia, dirección, teléfono, horarios), sus servicios, especialidades, menú completo de productos por categoría y precios en bolivianos (Bs).",
        "Usa únicamente los datos proporcionados de Aroma Andino Café. Si falta información, indícalo sin inventarla.",
        "No confirmes pedidos ni reservas por el chat; invita al cliente a usar el formulario de contactos o llamar al teléfono de la tienda.",
        `Datos actuales de Aroma Andino Café: ${JSON.stringify(datos)}`,
      ].join("\n"),
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!respuesta.ok) {
    const error = new Error("Ollama no pudo generar la respuesta.");
    error.status = 502;
    throw error;
  }

  const resultado = await respuesta.json();

  if (typeof resultado.response !== "string" || !resultado.response.trim()) {
    const error = new Error("Ollama devolvió una respuesta vacía.");
    error.status = 502;
    throw error;
  }

  return resultado.response.trim();
}

module.exports = { consultarOllama };
