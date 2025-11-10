import { NextResponse } from 'next/server';
import { supabase } from '@lib/supabase';
import { agruparPorData } from '@lib/forecast';

export async function POST(req) {
  try {
    const body = await req.json();
    const codigo = body.codigo;
    const days = Number(body.days || 90);
    if (!codigo) return NextResponse.json({ error: 'codigo é obrigatório' }, { status:400 });

    const { data: vendas, error } = await supabase.from('vendas').select('*').eq('codigo', codigo).order('data', { ascending: true });
    if (error) throw error;

    const series = (vendas||[]).map(v => ({ date: v.data ? v.data.toString().slice(0,10) : null, qty: Number(v.quantidade || 0) }));
    const agg = agruparPorData(series);
    if (agg.length < 3) return NextResponse.json({ warning: 'dados insuficientes', projection: [], monthly: [], dailyAverage:0 });

    const tfModule = await import('@tensorflow/tfjs');
    const tf = tfModule.default || tfModule;

    const xs = agg.map((_,i)=>i);
    const ys = agg.map(p=>p.qty);

    const xTensor = tf.tensor2d(xs.map(x=>[x]));
    const yTensor = tf.tensor2d(ys.map(y=>[y]));

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, inputShape: [1], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });

    await model.fit(xTensor, yTensor, { epochs: 120, verbose: 0 });

    const start = xs.length;
    const futureX = Array.from({ length: days }, (_,i)=>start + i);
    const input = tf.tensor2d(futureX.map(x=>[x]));
    const predsTensor = model.predict(input);
    const preds = Array.from(predsTensor.dataSync()).map(v=>Math.max(0, Number(v.toFixed(2))));

    const monthly = [];
    for (let m=0;m<3;m++){ const slice = preds.slice(m*30, m*30+30); monthly.push({ month: m+1, total: Number(slice.reduce((a,b)=>a+b,0).toFixed(2)) }); }

    const dailyAvg = ys.reduce((a,b)=>a+b,0)/ys.length;

    return NextResponse.json({ projection: preds, monthly, dailyAverage: Number(dailyAvg.toFixed(2)) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status:500 });
  }
}
