'use client';

import { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function BarcodeScanner({
  onScan,
  scannerId,
}) {
  useEffect(() => {
    let scanner;

    async function startScanner() {
      try {
        scanner = new Html5Qrcode(scannerId);

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 120,
            },
          },
          (decodedText) => {
            onScan(decodedText);

            scanner.stop();
          },
          () => {}
        );
      } catch (err) {
        console.error(
          'Erro câmera:',
          err
        );
      }
    }

    startScanner();

    return () => {
      if (scanner) {
        scanner
          .stop()
          .catch(() => {});
      }
    };
  }, [onScan, scannerId]);

  return (
    <div className="bg-black p-4 rounded-xl">
      <div
        id={scannerId}
        style={{
          width: '100%',
        }}
      />
    </div>
  );
}
