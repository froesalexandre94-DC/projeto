'use client';
import { useEffect } from 'react';

export default function AccessibilityPanel() {
  // Funções para alternar acessibilidade
  const toggleHighContrast = () => {
    document.body.classList.toggle('high-contrast');
  };

  const toggleLargeText = () => {
    document.body.classList.toggle('large-text');
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg z-50 flex flex-col gap-2">
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded"
        onClick={toggleHighContrast}
      >
        🔳 Contraste
      </button>
      <button
        className="bg-green-600 text-white px-3 py-1 rounded"
        onClick={toggleLargeText}
      >
        🔠 Texto grande
      </button>
    </div>
  );
}
