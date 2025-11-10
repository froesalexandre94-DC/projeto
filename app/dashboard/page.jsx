'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// importa o Plot apenas no client (evita self is not defined)
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/vendas')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((err) => console.error('Erro ao carregar API:', err));
  }, []);

  if (!data) return <div className="p-4 text-gray-400">Carregando dados...</div>;

  const { top10Sold = [], baixoEstoque = [] } = data;

  // Totais e indicadores
  const totalVendido = top10Sold.reduce((acc, item) => acc + (item.totalVendido || 0), 0);
  const totalBaixoEstoque = baixoEstoque.length;
  const produtoMaisVendido = top10Sold[0] ? top10Sold[0].produto : '—';

  // Função de cor com base no nível de estoque
  const getColor = (qtd) => {
    if (qtd <= 20) return 'rgb(239,68,68)'; // vermelho
    if (qtd <= 49) return 'rgb(234,179,8)'; // amarelo
    return 'rgb(34,197,94)'; // verde
  };

  return (
    <main className="p-8 space-y-12">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        Dashboard de Vendas
      </h1>

      {/* 📊 Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total vendido */}
        <div className="bg-gray-900 rounded-lg p-6 shadow border border-gray-700">
          <p className="text-gray-400 text-sm uppercase">Total Vendido</p>
          <h2 className="text-3xl font-bold text-green-400 mt-2">
            {totalVendido.toLocaleString('pt-BR')}
          </h2>
        </div>

        {/* Produtos com baixo estoque */}
        <div className="bg-gray-900 rounded-lg p-6 shadow border border-gray-700">
          <p className="text-gray-400 text-sm uppercase">
            Produtos com Baixo Estoque
          </p>
          <h2 className="text-3xl font-bold text-yellow-400 mt-2">
            {totalBaixoEstoque}
          </h2>
          <button
            onClick={() => router.push('/estoque')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-all"
            aria-label="Ir para página de Estoque"
          >
            Ir para Estoque
          </button>
        </div>

        {/* Produto mais vendido */}
        <div className="bg-gray-900 rounded-lg p-6 shadow border border-gray-700">
          <p className="text-gray-400 text-sm uppercase">Produto Mais Vendido</p>
          <h2 className="text-xl font-semibold text-blue-400 mt-2">
            {produtoMaisVendido}
          </h2>
        </div>
      </div>

      {/* 🟢 Top 10 Mais Vendidos */}
      <div className="card bg-gray-900 p-6 rounded-lg shadow" role="region" aria-label="Top 10 Produtos Mais Vendidos">
        <h2 className="text-xl font-semibold mb-3 text-green-400">
          Top 10 Mais Vendidos
        </h2>
        <Plot
          data={[
            {
              x: top10Sold.map((i) => i.produto),
              y: top10Sold.map((i) => i.totalVendido),
              type: 'bar',
              text: top10Sold.map(
                (i) => `${i.totalVendido} (${((i.totalVendido / totalVendido) * 100).toFixed(1)}%)`
              ),
              textposition: 'auto',
              marker: { color: 'rgb(34,197,94)' },
            },
          ]}
          layout={{
            height: 400,
            margin: { t: 40, l: 50, r: 10, b: 80 },
            title: 'Mais Vendidos',
            plot_bgcolor: '#111827',
            paper_bgcolor: '#111827',
            font: { color: '#fff' },
            xaxis: { automargin: true },
            yaxis: { title: 'Unidades Vendidas' },
          }}
          config={{ displayModeBar: false, responsive: true }}
          aria-label="Gráfico de barras Top 10 Produtos Mais Vendidos"
        />
      </div>

      {/* 🔴 Produtos com Baixo Estoque */}
      <div className="card bg-gray-900 p-6 rounded-lg shadow" role="region" aria-label="Produtos com Baixo Estoque">
        <h2 className="text-xl font-semibold mb-3 text-red-400">
          Produtos com Baixo Estoque (menos de 50)
        </h2>



        {/* 🧾 Tabela de Produtos */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-red-300 mb-3">
            Lista de produtos com baixo estoque
          </h3>

          {baixoEstoque.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-700 text-sm text-gray-200" role="table" aria-label="Tabela de produtos com baixo estoque">
                <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2 border-b border-gray-700 text-left">Código</th>
                    <th className="px-4 py-2 border-b border-gray-700 text-left">Produto</th>
                    <th className="px-4 py-2 border-b border-gray-700 text-center">Quantidade</th>
                    <th className="px-4 py-2 border-b border-gray-700 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {baixoEstoque.map((item, index) => {
                    const status =
                      item.quantidade < 20
                        ? "Crítico"
                        : item.quantidade < 40
                        ? "Atenção"
                        : "Baixo";
                    const color =
                      item.quantidade < 20
                        ? "text-red-500"
                        : item.quantidade < 40
                        ? "text-yellow-400"
                        : "text-green-400";

                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-4 py-2 border-b border-gray-700">{item.codigo}</td>
                        <td className="px-4 py-2 border-b border-gray-700">{item.produto}</td>
                        <td className={`px-4 py-2 border-b border-gray-700 text-center font-semibold ${color}`}>{item.quantidade}</td>
                        <td className={`px-4 py-2 border-b border-gray-700 text-center ${color}`}>{status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">
              Nenhum produto com baixo estoque 🎉
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
