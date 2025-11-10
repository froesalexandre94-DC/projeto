export function agruparPorData(series) {
  const map = new Map();
  (series||[]).forEach(s => {
    if (!s.date) return;
    const d = s.date.slice(0,10);
    map.set(d, (map.get(d) || 0) + Number(s.qty || s.quantidade || s.quantity || 0));
  });
  return Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0])).map(([date, qty])=>({ date, qty }));
}

export function mediaDiaria(series) {
  const agg = agruparPorData(series);
  if (!agg.length) return 0;
  const total = agg.reduce((s,r)=>s+r.qty,0);
  return Number((total / agg.length).toFixed(2));
}

// Simple projection: linear trend from last N points
export function linearProjection(series, days = 90) {
  const agg = agruparPorData(series);
  if (agg.length === 0) return { dailyAverage:0, projection: [] };
  const ys = agg.map(x=>x.qty);
  const xs = ys.map((_,i)=>i);
  const n = xs.length;
  let sx=0, sy=0, sxy=0, sxx=0;
  for (let i=0;i<n;i++){ sx+=xs[i]; sy+=ys[i]; sxy+=xs[i]*ys[i]; sxx+=xs[i]*xs[i]; }
  const denom = (n*sxx - sx*sx) || 1;
  const slope = (n*sxy - sx*sy)/denom;
  const intercept = (sy - slope * sx) / n;
  const projection = [];
  for (let i=0;i<days;i++){ const x = n + i; const y = intercept + slope * x; projection.push(Math.max(0, Number(y.toFixed(2)))); }
  const dailyAvg = ys.reduce((a,b)=>a+b,0)/n;
  return { dailyAverage: Number(dailyAvg.toFixed(2)), projection };
}
