// app/layout.jsx
import './globals.css';
import './accessibility.css'; // 🔹 Importa o CSS de acessibilidade
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

// ⛔ Importa o painel de acessibilidade somente no client (sem SSR)
const AccessibilityPanel = dynamic(
  () => import('@/components/AccessibilityPanel'),
  { ssr: false }
);

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Análise Operacional',
  description: 'Dashboard interativo com indicadores de estoque e vendas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <div className="container mx-auto px-4 py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-blue-400">Análise Operacional</h1>
            <p className="text-gray-400">Monitoramento e insights de desempenho</p>
          </header>

          {/* conteúdo da página */}
          <main>{children}</main>
        </div>

        {/* ♿ Painel de acessibilidade flutuante */}
        <AccessibilityPanel />
      </body>
    </html>
  );
}
