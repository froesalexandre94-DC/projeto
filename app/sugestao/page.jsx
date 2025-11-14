'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@lib/supabase';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export default function SugestoesCompraPage() {
  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    buscarSugestoes();
  }, []);

  async function buscarSugestoes() {
    setLoading(true);

    // Busca estoque
    const { data: estoque, error: erroEstoque } = await supabase
      .from('estoque')
      .select('codigo, produto, quantidade');

    // Busca vendas
    const { data: vendas, error: erroVendas } = await supabase
      .from('vendas')
      .select('codigo, quantidade');

    if (erroEstoque || erroVendas) {
      console.error('Erro ao buscar dados:', erroEstoque || erroVendas);
      setLoading(false);
      return;
    }

    // Mapeia vendas por código
    const vendasPorProduto = {};
    vendas.forEach(v => {
      if (!vendasPorProduto[v.codigo]) vendasPorProduto[v.codigo] = 0;
      vendasPorProduto[v.codigo] += v.quantidade || 0;
    });

    // Filtra produtos com estoque < 50
    const produtosBaixoEstoque = estoque
      .filter(e => e.quantidade < 50)
      .map(e => ({
        ...e,
        vendidos: vendasPorProduto[e.codigo] || 0,
      }))
      .sort((a, b) => a.quantidade - b.quantidade); // Ordena menor estoque primeiro

    setSugestoes(produtosBaixoEstoque);
    setLoading(false);
  }

  const voltarEstoque = () => router.push('/estoque');

  return (
    <main className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-400">Sugestão de Compra</h1>
        <button
          onClick={voltarEstoque}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow"
        >
          Voltar ao Estoque
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Carregando sugestões...</p>
      ) : sugestoes.length === 0 ? (
        <p className="text-gray-400">Nenhum produto abaixo do estoque mínimo.</p>
      ) : (
        <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">
            Produtos com estoque abaixo de 50 peças
          </h2>

          <table className="min-w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800 text-left text-red-300">
                <th className="border border-gray-700 px-4 py-2">Código</th>
                <th className="border border-gray-700 px-4 py-2">Produto</th>
                <th className="border border-gray-700 px-4 py-2">Estoque Atual</th>
                <th className="border border-gray-700 px-4 py-2">Vendidos</th>
                <th className="border border-gray-700 px-4 py-2">Sugestão de Compra</th>
              </tr>
            </thead>
            <tbody>
              {sugestoes.map((item) => {
                const sugerido = 100 - item.quantidade; // Reposição até 100 unidades
                return (
                  <tr key={item.codigo} className="text-white">
                    <td className="border border-gray-700 px-4 py-2">{item.codigo}</td>
                    <td className="border border-gray-700 px-4 py-2">{item.produto}</td>
                    <td className="border border-gray-700 px-4 py-2">{item.quantidade}</td>
                    <td className="border border-gray-700 px-4 py-2">{item.vendidos}</td>
                    <td className="border border-gray-700 px-4 py-2 text-green-400">
                      {sugerido > 0 ? sugerido : 0} unid.
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
