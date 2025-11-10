"use client";
import { useState, useEffect } from "react";

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reading, setReading] = useState(false);

  // 🔹 Carrega preferências do localStorage
  useEffect(() => {
    const hc = localStorage.getItem("highContrast") === "true";
    const lt = localStorage.getItem("largeText") === "true";
    setHighContrast(hc);
    setLargeText(lt);
  }, []);

  // 🔹 Atualiza classes no body e salva preferências
  useEffect(() => {
    document.body.classList.toggle("high-contrast", highContrast);
    document.body.classList.toggle("large-text", largeText);
    localStorage.setItem("highContrast", highContrast);
    localStorage.setItem("largeText", largeText);
  }, [highContrast, largeText]);

  // 🔊 Leitura em voz alta
  const toggleReading = () => {
    if (!reading) {
      const text = document.body.innerText;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      speechSynthesis.speak(utterance);
      setReading(true);
      utterance.onend = () => setReading(false);
    } else {
      speechSynthesis.cancel();
      setReading(false);
    }
  };

  return (
    <>
      {/* ♿ Botão flutuante */}
      <button
        aria-label="Abrir painel de acessibilidade"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white text-2xl shadow-lg hover:bg-blue-500 transition z-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        ♿
      </button>

      {/* 🧩 Painel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700 z-50 w-72"
          role="dialog"
          aria-label="Painel de acessibilidade"
        >
          <h3 className="text-sm font-semibold mb-4 text-center">
            Acessibilidade
          </h3>

          <ToggleSwitch
            label="Alto contraste"
            checked={highContrast}
            onChange={() => setHighContrast(!highContrast)}
          />

          <ToggleSwitch
            label="Fonte ampliada"
            checked={largeText}
            onChange={() => setLargeText(!largeText)}
          />

          <ToggleSwitch
            label="Leitura em voz alta"
            checked={reading}
            onChange={toggleReading}
          />

          <button
            onClick={() => setOpen(false)}
            className="mt-3 w-full bg-gray-800 hover:bg-gray-700 text-sm py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Fechar
          </button>
        </div>
      )}
    </>
  );
}

// 🔘 Componente para o switch
function ToggleSwitch({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}
