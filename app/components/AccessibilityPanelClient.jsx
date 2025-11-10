'use client'; // ⚠️ Client Component obrigatório

import dynamic from 'next/dynamic';

// Importa o painel somente no client
const AccessibilityPanel = dynamic(
  () => import('./AccessibilityPanel'),
  { ssr: false }
);

export default function AccessibilityPanelClient() {
  return <AccessibilityPanel />;
}
