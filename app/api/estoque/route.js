import { NextResponse } from 'next/server';
import { supabase } from '@lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('estoque').select('*');
    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from('estoque')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { data },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
