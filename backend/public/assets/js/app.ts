// Tipos para el Asistente Escolar
interface Message {
    text: string
    sender: "user" | "bot"
    timestamp: string
}

//Recupero la variable de entorno con la dirección del fronted
const API_URL = (window as any).API_URL;
//const NOMBRE = windows.CONFIG.NAME;
//const API_URL = windows.CONFIG.API_URL;
const NOMBRE = (window as any).NAME;

console.log(NOMBRE);

// Elementos del DOM
const messageInput = document.getElementById("messageInput") as HTMLInputElement
const chatMessages = document.getElementById("chatMessages") as HTMLElement
const sendButton = document.getElementById("sendButton") as HTMLButtonElement
const typingIndicator = document.getElementById("typingIndicator") as HTMLElement







// Función para manejar el evento de presionar Enter
function handleKeyPress(event: KeyboardEvent): void {
    if (event.key === "Enter") {
        sendMessage()
    }
}

// Función para enviar mensaje
async function sendMessage(): Promise<void> {

    const input = document.getElementById("messageInput") as HTMLInputElement
    const message = input.value.trim()

    if (message) {
        addMessage(message, "user")
        input.value = ""

        showTypingIndicator()

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            })

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`)
            }

            const data = await response.json()
            hideTypingIndicator()
            addMessage(data.reply, "bot")

        } catch (error) {
            hideTypingIndicator()
            addMessage("Lo siento, hubo un problema al conectar con el servidor.", "bot")
            console.error(error)
        }
    }
}

// Función para enviar mensajes rápidos
async function sendQuickMessage(message: string): Promise<void> {
    addMessage(message, "user")
    showTypingIndicator()

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        })

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()
        hideTypingIndicator()
        addMessage(data.reply, "bot")

    } catch (error) {
        hideTypingIndicator()
        addMessage("Lo siento, hubo un problema al conectar con el servidor.", "bot")
        console.error(error)
    }
}

// Función para añadir mensaje al chat
function addMessage(text: string, sender: "user" | "bot"): void {
    const messagesContainer = document.getElementById("chatMessages") as HTMLElement
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${sender}-message`

    const currentTime = new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    })

    if (sender === "bot") {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H9V9H21ZM3 19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V11H3V19ZM5 13H19V19H5V13Z" fill="currentColor"/>
                </svg>
            </div>
            <div class="message-content">
                <p>${text}</p>
            </div>
            <div class="message-time">${currentTime}</div>
        `
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
            <div class="message-time">${currentTime}</div>
        `
    }

    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
}

// Función para mostrar indicador de escritura
function showTypingIndicator(): void {
    const indicator = document.getElementById("typingIndicator") as HTMLElement
    indicator.style.display = "flex"
}

// Función para ocultar indicador de escritura
function hideTypingIndicator(): void {
    const indicator = document.getElementById("typingIndicator") as HTMLElement
    indicator.style.display = "none"
}
// Hacer las funciones globales para que puedan ser llamadas desde el HTML
;(window as any).handleKeyPress = handleKeyPress
;(window as any).sendMessage = sendMessage
;(window as any).sendQuickMessage = sendQuickMessage

