// app/components/ChartCard.jsx
'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function ChartCard({ title, data, xKey = 'x', yKey = 'y', kind = 'bar' }) {
  const x = (data || []).map(d => d[xKey]);
  const y = (data || []).map(d => d[yKey]);

  return (
    <div className="card transition-transform duration-300 hover:scale-[1.01]">
      <h4 className="font-medium mb-2">{title}</h4>
      <div style={{ width: '100%' }}>
        <Plot
          data={[{ x, y, type: kind }]}
          layout={{ height: 320, margin: { t: 20 }, paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', font: { color: '#e6eef8' } }}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
