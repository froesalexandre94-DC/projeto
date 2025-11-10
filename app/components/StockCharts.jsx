'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function StockCharts({ data }) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg mt-8">
      <h3 className="font-semibold mb-3 text-lg text-green-400">
        Estoque Atual x Média de Vendas (por dia)
      </h3>

      <Plot
        data={[
          {
            x: data.map(p => p.produto),
            y: data.map(p => p.estoque),
            name: 'Estoque Atual',
            type: 'bar',
            marker: { color: '#10B981' },
          },
          {
            x: data.map(p => p.produto),
            y: data.map(p => p.mediaDia),
            name: 'Média de Vendas/Dia',
            type: 'bar',
            marker: { color: '#FBBF24' },
          },
        ]}
        layout={{
          barmode: 'group',
          height: 400,
          margin: { t: 30, l: 50, r: 20, b: 70 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { color: '#e6eef8' },
          yaxis: { title: 'Quantidade' },
          xaxis: { title: 'Produto', tickangle: -30 },
        }}
        style={{ width: '100%' }}
      />
    </div>
  );
}
