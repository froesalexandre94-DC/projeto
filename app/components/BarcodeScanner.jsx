'use client';

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

export default function BarcodeScanner({
  onScan,
  scannerId,
}) {
  useEffect(() => {
    let scanner;

    scanner = new Html5QrcodeScanner(
      scannerId,
      {
        fps: 10,

        qrbox: {
          width: 280,
          height: 120,
        },

        rememberLastUsedCamera: true,

        videoConstraints: {
          facingMode: {
            ideal: 'environment',
          },
        },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);

        navigator.vibrate?.(200);

        scanner
          .clear()
          .catch((err) =>
            console.error(err)
          );
      },

      () => {}
    );

    return () => {
      if (scanner) {
        scanner
          .clear()
          .catch(() => {});
      }
    };
  }, [onScan, scannerId]);

  return (
    <div className="bg-black p-4 rounded-xl">
      <div id={scannerId} />
    </div>
  );
}
