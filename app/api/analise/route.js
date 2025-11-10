import { NextResponse } from 'next/server';
import { supabase } from '@lib/supabase';
import { agruparPorData, mediaDiaria } from '@lib/forecast';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q');
    const { data: products, error: pErr } = await supabase.from('estoque').select('*');
    if (pErr) throw pErr;
    const { data: vendas, error: vErr } = await supabase.from('vendas').select('*');
    if (vErr) throw vErr;
    const salesByCode = {};
    (vendas||[]).forEach(v=>{
      if(!v.codigo) return;
      salesByCode[v.codigo] = salesByCode[v.codigo] || [];
      salesByCode[v.codigo].push({ date: v.data ? v.data.toString().slice(0,10) : null, qty: Number(v.quantidade || 0) });
    });
    const items = (products||[]).map(p=>{
      const code = p.codigo;
      const series = salesByCode[code] || [];
      const totalSold = series.reduce((a,b)=>a + (b.qty||0), 0);
      const dailyAvg = mediaDiaria(series);
      return {
        codigo: code,
        produto: p.produto || null,
        quantidade_estoque: Number(p.quantidade || p.quantidade_estoque || 0),
        totalSold,
        dailyAverage: dailyAvg,
        salesSeries: series
      };
    });
    let filtered = items;
    if (q) {
      const ql = q.toLowerCase();
      filtered = items.filter(i => (i.codigo||'').toLowerCase().includes(ql) || (i.produto||'').toLowerCase().includes(ql));
    }
    const byStockDesc = [...filtered].sort((a,b)=>b.quantidade_estoque - a.quantidade_estoque);
    const top5Stock = byStockDesc.slice(0,5);
    const bottom5Stock = byStockDesc.slice(-5).reverse();
    const bySoldDesc = [...filtered].sort((a,b)=>b.totalSold - a.totalSold);
    const top10Sold = bySoldDesc.slice(0,10);
    const bottom5Sold = bySoldDesc.slice(-5).reverse();
    return NextResponse.json({ top5Stock, bottom5Stock, top10Sold, bottom5Sold, items: filtered });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status:500 });
  }
}
