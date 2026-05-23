'use client';

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

export default function BarcodeScanner({
  onScan,
  scannerId,
}) {
  useEffect(() => {
    const scanner =
      new Html5QrcodeScanner(
        scannerId,
        {
          fps: 10,

          qrbox: {
            width: 280,
            height: 120,
          },

          rememberLastUsedCamera: true,

          videoConstraints: {
            facingMode: 'environment',
          },
        },
        false
      );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);

        scanner
          .clear()
          .catch((err) =>
            console.error(err)
          );
      },
      () => {}
    );

    return () => {
      scanner
        .clear()
        .catch(() => {});
    };
  }, [onScan, scannerId]);

  return (
    <div className="bg-black p-4 rounded-xl">
      <div id={scannerId} />
    </div>
  );
}
