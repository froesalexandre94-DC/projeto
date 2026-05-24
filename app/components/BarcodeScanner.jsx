'use client';

import { useEffect } from 'react';

export default function Scanner() {
  useEffect(() => {
    async function startScanner() {
      const { Html5Qrcode } = await import('html5-qrcode');

      const scanner = new Html5Qrcode('reader');

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          console.log(decodedText);
        },
        (error) => {
          console.log(error);
        }
      );
    }

    startScanner();
  }, []);

  return <div id="reader" className="w-full max-w-md" />;
}
