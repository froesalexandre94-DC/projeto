'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function SalesCharts({ data }) {
  const top10Sold = data.top10Sold;
  const bottom10Sold = data.bottom10Sold;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top 10 Mais Vendidos */}
      <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-3 text-lg text-blue-400">Top 10 Mais Vendidos</h3>
        <Plot
          data={[
            {
              x: top10Sold.map(p => p.produto),
              y: top10Sold.map(p => p.totalSold),
              type: 'bar',
              marker: { color: '#3B82F6' },
            },
          ]}
          layout={{
            height: 360,
            margin: { t: 30, l: 50, r: 20, b: 70 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { color: '#e6eef8' },
            yaxis: { title: 'Qtd Vendida' },
            xaxis: { title: 'Produto', tickangle: -30 },
          }}
          style={{ width: '100%' }}
        />
      </div>

      {/* Top 10 Menos Vendidos */}
      <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-3 text-lg text-red-400">Top 10 Menos Vendidos</h3>
        <Plot
          data={[
            {
              x: bottom10Sold.map(p => p.produto),
              y: bottom10Sold.map(p => p.totalSold),
              type: 'bar',
              marker: { color: '#EF4444' },
            },
          ]}
          layout={{
            height: 360,
            margin: { t: 30, l: 50, r: 20, b: 70 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { color: '#e6eef8' },
            yaxis: { title: 'Qtd Vendida' },
            xaxis: { title: 'Produto', tickangle: -30 },
          }}
          style={{ width: '100%' }}
        />
      </div>
    </section>
  );
}
