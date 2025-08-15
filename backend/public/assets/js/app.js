"use strict";
// app.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Elementos del DOM
const translateBtn = document.getElementById("translateBtn");
const sourceLangSelect = document.getElementById("sourceLang");
const targetLangSelect = document.getElementById("targetLang");
const sourceText = document.getElementById("sourceText");
const resultDiv = document.getElementById("result");
// URL del backend (ajústala según tu configuración)
const API_URL = "http://localhost:3000/api/traducir"; // Tu backend en Node.js
// Evento de traducción
translateBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const text = sourceText.value.trim();
    const sourceLang = sourceLangSelect.value;
    const targetLang = targetLangSelect.value;
    if (!text) {
        resultDiv.textContent = "Por favor, escribe algo para traducir.";
        return;
    }
    resultDiv.textContent = "Traduciendo...";
    try {
        const response = yield fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text,
                sourceLang,
                targetLang
            }),
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        const data = yield response.json();
        resultDiv.textContent = data.translation || "No se recibió traducción.";
    }
    catch (error) {
        console.error(error);
        resultDiv.textContent = "Error al conectar con el servidor.";
    }
}));
