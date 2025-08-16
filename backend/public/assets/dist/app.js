"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let NOMBRE;
let API_URL;
let userId;

document.addEventListener("DOMContentLoaded", () => {
  NOMBRE  = window.CONFIG?.nombre;
  API_URL = window.CONFIG?.apiUrl;
  console.log("CONFIG FRONT:", window.CONFIG);
  console.log("API_URL:", API_URL);
});




  // Elementos del DOM
  const messageInput     = document.getElementById("messageInput");
  const chatMessages     = document.getElementById("chatMessages");
  const typingIndicator  = document.getElementById("typingIndicator");
  document.getElementById("nombre").textContent = NOMBRE || "";

  userId = Date.now() + Math.floor(777 + Math.random() * 1000);

  // Función para manejar el evento de presionar Enter
  window.handleKeyPress = function handleKeyPress(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }
    
// Función para enviar mensaje
function sendMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        const input = document.getElementById("messageInput");
        const message = input.value.trim();
        if (message) {
            addMessage(message, "user");
            input.value = "";
            showTypingIndicator();
            try {
                const response = yield fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId, message }),
                });
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const data = yield response.json();
                hideTypingIndicator();
                addMessage(data.reply, "bot");
            }
            catch (error) {
                hideTypingIndicator();
                addMessage("Lo siento, hubo un problema al conectar con el servidor.", "bot");
                console.error(error);
            }
        }
    });
}
// Función para enviar mensajes rápidos
function sendQuickMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        addMessage(message, "user");
        showTypingIndicator();
        try {
            const response = yield fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, message }),
            });
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = yield response.json();
            hideTypingIndicator();
            addMessage(data.reply, "bot");
        }
        catch (error) {
            hideTypingIndicator();
            addMessage("Lo siento, hubo un problema al conectar con el servidor.", "bot");
            console.error(error);
        }
    });
}
// Función para añadir mensaje al chat
function addMessage(text, sender) {
    const messagesContainer = document.getElementById("chatMessages");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;
    const currentTime = new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });
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
        `;
    }
    else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
            <div class="message-time">${currentTime}</div>
        `;
    }
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
// Función para mostrar indicador de escritura
function showTypingIndicator() {
    const indicator = document.getElementById("typingIndicator");
    indicator.style.display = "flex";
}
// Función para ocultar indicador de escritura
function hideTypingIndicator() {
    const indicator = document.getElementById("typingIndicator");
    indicator.style.display = "none";
}
// Hacer las funciones globales para que puedan ser llamadas desde el HTML
;
window.handleKeyPress = handleKeyPress;
window.sendMessage = sendMessage;
window.sendQuickMessage = sendQuickMessage;


