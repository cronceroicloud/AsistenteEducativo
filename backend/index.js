//Importar dependencias
import express from 'express';
import dotenv from 'dotenv';
import OpenAI from "openai";
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';


//Cargar configuración de api key
dotenv.config({ path: './backend/.env' });

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Cargar express
const app = express();

// server.ts (Node + Express)
app.get('/config.js', (req, res) => {
    res.type('application/javascript');
    res.send(`
    window.CONFIG = {
      apiUrl: "${process.env.API_URL}",
      nombre: "${process.env.NAME}",
      miArray: ["dato1", "dato2"]
    };
  `);
});

const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Instancia de OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
});


let respuestaProcesada = ""; // Contenido del documento (o resumen)
const userThreads = {}; // Contexto por usuario

// Leer fichero al iniciar el servidor
async function cargarFichero() {
    try {
        const url = process.env.FICHERO.replace('/edit?usp=sharing', '/export?format=txt');
        const response = await axios.get(url);
        respuestaProcesada = response.data;
        console.log("Fichero cargado en memoria");
    } catch (e) {
        console.error("Error al cargar fichero:", e.message);
    }
}

cargarFichero();

// Endpoint asistente
app.post('/api/asistente', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Mensaje vacío" });

    const messages = [
        {
            role: "system",
            content: "Responde lo más corto posible y conciso. ESTÁ TOTALMENTE PROHIBIDO HABLAR DE INFORMACIÓN QUE NO SEA ESPECÍFICA DEL CENTRO EDUCATIVO. Eres un asistente que únicamente habla sobre el centro educativo."
        },
        { role: "system", content: respuestaProcesada }, // contenido del fichero
        { role: "user", content: message }
    ];

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            max_tokens: 200
        });

        const reply = response.choices[0].message.content;
        res.json({ reply });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al generar la respuesta' });
    }
});


    /*

    const { userId, message } = req.body;

    if (!message) return res.status(400).json({ error: "Mensaje vacío" });

    try {
        // Crear hilo si no existe
        if (!userThreads[userId]) {
            const thread = await openai.beta.threads.create();
            userThreads[userId] = thread.id;
        }
        const threadId = userThreads[userId];

        // Añadir mensaje del usuario
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: [{ type: "text", text: message }]
        });

        // Crear run para generar respuesta
        await openai.beta.threads.runs.create(threadId, {
            assistant_id: "asst_SZvzCgR4roTTQoGp892CBWMl"
        });

        // Esperar a que aparezca un mensaje del asistente
        const maxAttempts = 30;
        let attempts = 0;
        let replyText = 'No hay respuesta';

        while (replyText=='No hay respuesta' && attempts < maxAttempts) {
            let messages = await openai.beta.threads.messages.list(threadId);

// Tomar el último mensaje del asistente
            const lastAssistantMessage = messages.data
                .slice()                // copiar array
                .reverse()              // invertir para empezar por el más reciente
                .find(m => m.role === 'assistant');

            replyText = 'No hay respuesta';
            if (lastAssistantMessage) {
                // Combinar todo el contenido de texto del mensaje
                replyText = lastAssistantMessage.content
                    .map(c => c.text?.value || c.text || '') // puede estar en text.value o directamente en text
                    .join(' ')
                    .trim();

                if (!replyText) replyText = 'No hay respuesta';
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }


        return res.json({ reply: replyText });

    } catch (e) {
        console.error("Error en /api/asistente:", e);
        return res.status(500).json({ error: 'Error al generar la respuesta' });
    }
});

*/



// Servir backend
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


/*
poner en desarrollo
"start": "nodemon index.js",
    "build": "tsc",
    "serve": "node index.js"
 */
