import './globals.css';
import { Inter } from 'next/font/google';
import AccessibilityPanelClient from '@components/AccessibilityPanelClient';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Gerenciamento Operacional',
  description: 'Gerenciamento de indicadores de estoque e vendas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <div className="container mx-auto px-4 py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-blue-400">Gerenciamento Operacional</h1>
            <p className="text-gray-400">Grenciamento, monitoramento e insights de desempenho</p>
          </header>

          {/* conteúdo da página */}
          <main>{children}</main>
        </div>

        {/* ♿ Painel de acessibilidade flutuante */}
        <AccessibilityPanelClient />
      </body>
    </html>
  );
}

