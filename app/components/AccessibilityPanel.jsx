'use client';

import { useState, useEffect } from 'react';

// 🔘 Componente principal do painel de acessibilidade
export default function AccessibilityPanel() {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reading, setReading] = useState(false);

  // 🔹 Verifica se está no client
  const isClient = typeof window !== 'undefined';

  // 🔹 Carrega preferências do localStorage
  useEffect(() => {
    if (!isClient) return;
    const hc = localStorage.getItem('highContrast') === 'true';
    const lt = localStorage.getItem('largeText') === 'true';
    setHighContrast(hc);
    setLargeText(lt);
  }, [isClient]);

  // 🔹 Atualiza classes no body e salva preferências
  useEffect(() => {
    if (!isClient) return;
    document.body.classList.toggle('high-contrast', highContrast);
    document.body.classList.toggle('large-text', largeText);
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('largeText', largeText);
  }, [highContrast, largeText, isClient]);

  // 🔊 Leitura em voz alta
  const toggleReading = () => {
    if (!isClient) return;
    if (!('speechSynthesis' in window)) {
      alert('Leitura em voz alta não suportada neste navegador.');
      return;
    }

    if (!reading) {
      const text = document.body.innerText;
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
      setReading(true);
      utterance.onend = () => setReading(false);
    } else {
      speechSynthesis.cancel();
      setReading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-64">
      <h3 className="font-semibold mb-2">♿ Acessibilidade</h3>

      <ToggleSwitch
        label="Alto contraste"
        checked={highContrast}
        onChange={() => setHighContrast(!highContrast)}
      />

      <ToggleSwitch
        label="Texto ampliado"
        checked={largeText}
        onChange={() => setLargeText(!largeText)}
      />

      <button
        onClick={toggleReading}
        className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-2 rounded transition"
      >
        {reading ? 'Parar leitura' : 'Ler página'}
      </button>
    </div>
  );
}

// 🔘 Subcomponente ToggleSwitch
function ToggleSwitch({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span>{label}</span>
      <label className="inline-flex relative items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
        <div
          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </label>
    </div>
  );
}
