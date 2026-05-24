'use client';

import React, {
  useEffect,
  useState,
  useMemo,
} from 'react';

import { useRouter } from 'next/navigation';

import { supabase } from '../../lib/supabase';

export default function SugestoesCompraPage() {
  const router = useRouter();

  const [sugestoes, setSugestoes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [erro, setErro] =
    useState('');

  // ====================================
  // CONFIGURAÇÕES
  // ====================================

  // Quantos dias projetar
  const DIAS_PROJECAO = 90;

  // Estoque de segurança
  const ESTOQUE_SEGURANCA = 15;

  // ====================================
  // BUSCAR DADOS
  // ====================================

  useEffect(() => {
    buscarSugestoes();
  }, []);

  async function buscarSugestoes() {
    setLoading(true);

    try {
      // ====================================
      // BUSCAR ESTOQUE
      // ====================================

      const {
        data: estoque,
        error: erroEstoque,
      } = await supabase
        .from('estoque')
        .select(`
          codigo,
          produto,
          quantidade,
          preco
        `);

      if (erroEstoque)
        throw erroEstoque;

      // ====================================
      // DATA LIMITE
      // ====================================

      const hoje = new Date();

      const dataInicio =
        new Date();

      dataInicio.setDate(
        hoje.getDate() - 90
      );

      // ====================================
      // BUSCAR VENDAS
      // ====================================

      const {
        data: vendas,
        error: erroVendas,
      } = await supabase
        .from('vendas')
        .select(`
          codigo,
          quantidade,
          created_at
        `)
        .gte(
          'created_at',
          dataInicio.toISOString()
        );

      if (erroVendas)
        throw erroVendas;

      // ====================================
      // AGRUPAR VENDAS
      // ====================================

      const vendasPorProduto = {};

      vendas.forEach((venda) => {
        const codigo =
          venda.codigo;

        if (
          !vendasPorProduto[codigo]
        ) {
          vendasPorProduto[codigo] = {
            totalVendido: 0,
          };
        }

        vendasPorProduto[
          codigo
        ].totalVendido +=
          Number(
            venda.quantidade
          ) || 0;
      });

      // ====================================
      // GERAR SUGESTÕES
      // ====================================

      const listaSugestoes =
        estoque.map((produto) => {
          const codigo =
            produto.codigo;

          const estoqueAtual =
            Number(
              produto.quantidade
            ) || 0;

          const totalVendido =
            vendasPorProduto[
              codigo
            ]?.totalVendido || 0;

          // Média diária
          const mediaDiaria =
            totalVendido / 90;

          // Projeção próximos 90 dias
          const projeção90Dias =
            Math.ceil(
              mediaDiaria *
                DIAS_PROJECAO
            );

          // Sugestão final
          const sugestaoCompra =
            Math.max(
              0,
              projeção90Dias +
                ESTOQUE_SEGURANCA -
                estoqueAtual
            );

          // Cobertura em dias
          const coberturaDias =
            mediaDiaria > 0
              ? Math.floor(
                  estoqueAtual /
                    mediaDiaria
                )
              : 999;

          // Nível de urgência
          let urgencia =
            'NORMAL';

          if (
            coberturaDias <= 15
          ) {
            urgencia = 'CRÍTICO';
          } else if (
            coberturaDias <= 30
          ) {
            urgencia = 'ALTO';
          } else if (
            coberturaDias <= 60
          ) {
            urgencia = 'MÉDIO';
          }

          return {
            codigo:
              produto.codigo,

            produto:
              produto.produto,

            estoqueAtual,

            totalVendido,

            mediaDiaria,

            projeção90Dias,

            sugestaoCompra,

            coberturaDias,

            urgencia,

            valorEstoque:
              estoqueAtual *
              (Number(
                produto.preco
              ) || 0),
          };
        });

      // ====================================
      // FILTRAR SOMENTE NECESSÁRIOS
      // ====================================

      const apenasNecessarios =
        listaSugestoes
          .filter(
            (item) =>
              item.sugestaoCompra >
              0
          )
          .sort(
            (a, b) =>
              a.coberturaDias -
              b.coberturaDias
          );

      setSugestoes(
        apenasNecessarios
      );

      setErro('');
    } catch (err) {
      console.error(err);

      setErro(
        'Erro ao gerar sugestões.'
      );
    }

    setLoading(false);
  }

  // ====================================
  // TOTAIS
  // ====================================

  const totais = useMemo(() => {
    const totalProdutos =
      sugestoes.length;

    const totalComprar =
      sugestoes.reduce(
        (sum, item) =>
          sum +
          item.sugestaoCompra,
        0
      );

    return {
      totalProdutos,
      totalComprar,
    };
  }, [sugestoes]);

  // ====================================
  // COR URGÊNCIA
  // ====================================

  function corUrgencia(
    urgencia
  ) {
    switch (urgencia) {
      case 'CRÍTICO':
        return 'text-red-400';

      case 'ALTO':
        return 'text-orange-400';

      case 'MÉDIO':
        return 'text-yellow-400';

      default:
        return 'text-green-400';
    }
  }

  // ====================================
  // VOLTAR
  // ====================================

  const voltarEstoque = () =>
    router.push('/estoque');

  // ====================================
  // RENDER
  // ====================================

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">

      {/* TOPO */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-blue-400">
            Sugestão Inteligente
            de Compra
          </h1>

          <p className="text-gray-400 mt-2">
            Projeção baseada nas
            vendas dos últimos
            90 dias
          </p>
        </div>

        <button
          onClick={
            voltarEstoque
          }
          className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg"
        >
          ← Voltar
        </button>

      </div>

      {/* RESUMO */}

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

          <p className="text-gray-400 text-sm">
            Produtos Necessitando
            Compra
          </p>

          <p className="text-3xl font-bold mt-2">
            {
              totais.totalProdutos
            }
          </p>

        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

          <p className="text-gray-400 text-sm">
            Total Sugerido
          </p>

          <p className="text-3xl font-bold mt-2">
            {
              totais.totalComprar
            }
          </p>

        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

          <p className="text-gray-400 text-sm">
            Horizonte de
            Projeção
          </p>

          <p className="text-3xl font-bold mt-2">
            90 dias
          </p>

        </div>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="text-gray-400">
          Carregando
          sugestões...
        </div>
      )}

      {/* ERRO */}

      {!loading && erro && (
        <div className="text-red-400">
          {erro}
        </div>
      )}

      {/* TABELA */}

      {!loading &&
        !erro && (
          <div className="overflow-x-auto rounded-xl border border-gray-800">

            <table className="min-w-full">

              <thead>

                <tr className="bg-gray-900 text-left">

                  <th className="px-4 py-3 border-b border-gray-800">
                    Código
                  </th>

                  <th className="px-4 py-3 border-b border-gray-800">
                    Produto
                  </th>

                  <th className="px-4 py-3 border-b border-gray-800">
                    Estoque
                  </th>

                  <th className="px-4 py-3 border-b border-gray-800">
                    Vendido
                    90d
                  </th>

                  <th className="px-4 py-3 border-b border-gray-800">
                    Média/Dia
                  </th>

                  <th className="px-4 py-3 border-b border-gray-800">
                    Cobertura
                  </th>

                  <th className="px-4 py-3 border-b border-gray-800">
                    Projeção
                    90d
                  </th>

                  <th className="px-4 py-3 border-b border-gray-800">
                    Comprar
                  </th>

                  <th className="px-4 py-3 border-b border-gray-800">
                    Urgência
                  </th>

                </tr>

              </thead>

              <tbody>

                {sugestoes.length >
                0 ? (
                  sugestoes.map(
                    (item) => (
                      <tr
                        key={
                          item.codigo
                        }
                        className="hover:bg-gray-900/60"
                      >

                        <td className="px-4 py-3 border-b border-gray-800">
                          {
                            item.codigo
                          }
                        </td>

                        <td className="px-4 py-3 border-b border-gray-800">
                          {
                            item.produto
                          }
                        </td>

                        <td className="px-4 py-3 border-b border-gray-800">
                          {
                            item.estoqueAtual
                          }
                        </td>

                        <td className="px-4 py-3 border-b border-gray-800">
                          {
                            item.totalVendido
                          }
                        </td>

                        <td className="px-4 py-3 border-b border-gray-800">
                          {item.mediaDiaria.toFixed(
                            2
                          )}
                        </td>

                        <td className="px-4 py-3 border-b border-gray-800">
                          {
                            item.coberturaDias
                          }{' '}
                          dias
                        </td>

                        <td className="px-4 py-3 border-b border-gray-800">
                          {
                            item.projeção90Dias
                          }
                        </td>

                        <td className="px-4 py-3 border-b border-gray-800 text-green-400 font-bold">
                          {
                            item.sugestaoCompra
                          }
                        </td>

                        <td
                          className={`px-4 py-3 border-b border-gray-800 font-semibold ${corUrgencia(
                            item.urgencia
                          )}`}
                        >
                          {
                            item.urgencia
                          }
                        </td>

                      </tr>
                    )
                  )
                ) : (
                  <tr>

                    <td
                      colSpan="9"
                      className="text-center py-8 text-gray-400"
                    >
                      Nenhuma
                      sugestão de
                      compra no
                      momento.
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>
        )}

    </main>
  );
}
