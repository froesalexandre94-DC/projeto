'use client';

import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';

import dynamic from 'next/dynamic';

import { useRouter } from 'next/navigation';

import { supabase } from '../../lib/supabase';

const BarcodeScanner = dynamic(
  () => import('../app/components/BarcodeScanner'),
  {
    ssr: false,
  }
);

export default function EstoquePage() {
  const router = useRouter();

  // ====================================
  // STATES
  // ====================================

  const [produtos, setProdutos] =
    useState([]);

  const [filtro, setFiltro] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [erro, setErro] =
    useState('');

  const [novoProduto,
    setNovoProduto] = useState({
    codigo: '',
    produto: '',
    'GTIN/EAN': '',
    Localizacao: '',
    Unidade: '',
    quantidade: 0,
    preco: 0,
  });

  const [editando,
    setEditando] = useState(null);

  const [mostrandoNovo,
    setMostrandoNovo] =
    useState(false);

  const [
    mostrarScannerPesquisa,
    setMostrarScannerPesquisa,
  ] = useState(false);

  const [
    mostrarScannerCadastro,
    setMostrarScannerCadastro,
  ] = useState(false);

  const [totalProdutos,
    setTotalProdutos] =
    useState(0);

  const [totalPecas,
    setTotalPecas] =
    useState(0);

  const [totalValor,
    setTotalValor] =
    useState(0);

  // ====================================
  // BUSCAR PRODUTOS
  // ====================================

  async function buscarProdutos() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from('estoque')
        .select(`
          codigo,
          "GTIN/EAN",
          produto,
          "Localizacao",
          "Unidade",
          quantidade,
          preco
        `)
        .order('codigo', {
          ascending: true,
        });

    if (error) {
      console.error(
        'Erro ao buscar estoque:',
        error
      );

      setErro(
        'Erro ao carregar estoque.'
      );
    } else {
      setProdutos(data || []);

      calcularTotais(data || []);

      setErro('');
    }

    setLoading(false);
  }

  // ====================================
  // CALCULAR TOTAIS
  // ====================================

  function calcularTotais(lista) {
    const totalItens = lista.length;

    const totalQtd = lista.reduce(
      (sum, item) =>
        sum +
        (Number(item.quantidade) || 0),
      0
    );

    const totalDinheiro =
      lista.reduce(
        (sum, item) =>
          sum +
          (Number(item.quantidade) ||
            0) *
            (Number(item.preco) || 0),
        0
      );

    setTotalProdutos(totalItens);

    setTotalPecas(totalQtd);

    setTotalValor(totalDinheiro);
  }

  // ====================================
  // ADICIONAR PRODUTO
  // ====================================

  async function adicionarProduto() {
    if (!novoProduto.codigo) {
      alert(
        'O código é obrigatório.'
      );
      return;
    }

    const produtoFormatado = {
      ...novoProduto,

      quantidade: Number(
        novoProduto.quantidade
      ),

      preco: Number(
        novoProduto.preco
      ),
    };

    const { error } = await supabase
      .from('estoque')
      .insert([produtoFormatado]);

    if (error) {
      console.error(error);

      alert(
        'Erro ao adicionar produto.'
      );

      return;
    }

    alert(
      'Produto adicionado com sucesso!'
    );

    setNovoProduto({
      codigo: '',
      produto: '',
      'GTIN/EAN': '',
      Localizacao: '',
      Unidade: '',
      quantidade: 0,
      preco: 0,
    });

    setMostrandoNovo(false);

    buscarProdutos();
  }

  // ====================================
  // EXCLUIR PRODUTO
  // ====================================

  async function excluirProduto(
    codigo
  ) {
    if (
      !confirm(
        'Deseja excluir este produto?'
      )
    )
      return;

    const { error } = await supabase
      .from('estoque')
      .delete()
      .eq('codigo', codigo);

    if (error) {
      console.error(error);

      alert(
        'Erro ao excluir produto.'
      );

      return;
    }

    alert(
      'Produto excluído com sucesso!'
    );

    buscarProdutos();
  }

  // ====================================
  // FILTRO
  // ====================================

  const produtosFiltrados =
    useMemo(() => {
      const termo =
        filtro.toLowerCase();

      return produtos.filter((p) => {
        return (
          String(
            p.codigo || ''
          )
            .toLowerCase()
            .includes(termo) ||

          String(
            p.produto || ''
          )
            .toLowerCase()
            .includes(termo) ||

          String(
            p['GTIN/EAN'] || ''
          )
            .toLowerCase()
            .includes(termo)
        );
      });
    }, [filtro, produtos]);

  // ====================================
  // SCANNER PESQUISA
  // ====================================

  function handleScanPesquisa(
    codigo
  ) {
    navigator.vibrate?.(200);

    setFiltro(codigo);

    setMostrarScannerPesquisa(
      false
    );
  }

  // ====================================
  // SCANNER CADASTRO
  // ====================================

  function handleScanCadastro(
    codigo
  ) {
    navigator.vibrate?.(200);

    setNovoProduto((prev) => ({
      ...prev,

      'GTIN/EAN': codigo,
    }));

    setMostrarScannerCadastro(
      false
    );
  }

  // ====================================
  // EFFECT
  // ====================================

  useEffect(() => {
    buscarProdutos();
  }, []);

  // ====================================
  // DASHBOARD
  // ====================================

  const voltarDashboard = () =>
    router.push('/dashboard');

  // ====================================
  // RENDER
  // ====================================

  return (
    <div className="p-6 text-white min-h-screen bg-gray-950">

      {/* TOPO */}

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-2xl font-bold">
          📦 Estoque
        </h1>

        <button
          onClick={
            voltarDashboard
          }
          className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg"
        >
          ← Dashboard
        </button>

      </div>

      {/* ESTATÍSTICAS */}

      <div className="flex flex-wrap gap-4 mb-6">

        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">
            Produtos
          </p>

          <p className="text-xl font-bold">
            {totalProdutos}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">
            Peças
          </p>

          <p className="text-xl font-bold">
            {totalPecas}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">
            Valor Estoque
          </p>

          <p className="text-xl font-bold">
            R${' '}
            {totalValor.toLocaleString(
              'pt-BR',
              {
                minimumFractionDigits: 2,
              }
            )}
          </p>
        </div>

      </div>

      {/* PESQUISA */}

      <div className="flex flex-wrap gap-2 mb-4">

        <input
          type="text"
          placeholder="Pesquisar..."
          value={filtro}
          onChange={(e) =>
            setFiltro(
              e.target.value
            )
          }
          className="flex-1 p-3 rounded bg-gray-900 border border-gray-700"
        />

        <button
          onClick={() =>
            setMostrarScannerPesquisa(
              !mostrarScannerPesquisa
            )
          }
          className="bg-yellow-600 hover:bg-yellow-700 px-4 rounded"
        >
          📷
        </button>

        <button
          onClick={() =>
            setMostrandoNovo(true)
          }
          className="bg-green-600 hover:bg-green-700 px-4 rounded"
        >
          ➕ Novo
        </button>

      </div>

      {/* SCANNER PESQUISA */}

      {mostrarScannerPesquisa && (
        <div className="mb-4">

          <BarcodeScanner
            onScan={
              handleScanPesquisa
            }
            scannerId="reader-pesquisa"
          />

        </div>
      )}

      {/* NOVO PRODUTO */}

      {mostrandoNovo && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">

          <h2 className="text-xl font-bold mb-4">
            Novo Produto
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Código"
              value={
                novoProduto.codigo
              }
              onChange={(e) =>
                setNovoProduto({
                  ...novoProduto,
                  codigo:
                    e.target.value,
                })
              }
              className="p-3 rounded bg-gray-800"
            />

            <input
              placeholder="Produto"
              value={
                novoProduto.produto
              }
              onChange={(e) =>
                setNovoProduto({
                  ...novoProduto,
                  produto:
                    e.target.value,
                })
              }
              className="p-3 rounded bg-gray-800"
            />

            <div className="flex gap-2">

              <input
                placeholder="GTIN/EAN"
                value={
                  novoProduto[
                    'GTIN/EAN'
                  ]
                }
                onChange={(e) =>
                  setNovoProduto({
                    ...novoProduto,
                    'GTIN/EAN':
                      e.target.value,
                  })
                }
                className="flex-1 p-3 rounded bg-gray-800"
              />

              <button
                onClick={() =>
                  setMostrarScannerCadastro(
                    !mostrarScannerCadastro
                  )
                }
                className="bg-yellow-600 hover:bg-yellow-700 px-4 rounded"
              >
                📷
              </button>

            </div>

            <input
              placeholder="Localização"
              value={
                novoProduto.Localizacao
              }
              onChange={(e) =>
                setNovoProduto({
                  ...novoProduto,
                  Localizacao:
                    e.target.value,
                })
              }
              className="p-3 rounded bg-gray-800"
            />

            <input
              placeholder="Unidade"
              value={
                novoProduto.Unidade
              }
              onChange={(e) =>
                setNovoProduto({
                  ...novoProduto,
                  Unidade:
                    e.target.value,
                })
              }
              className="p-3 rounded bg-gray-800"
            />

            <input
              type="number"
              placeholder="Quantidade"
              value={
                novoProduto.quantidade
              }
              onChange={(e) =>
                setNovoProduto({
                  ...novoProduto,
                  quantidade:
                    e.target.value,
                })
              }
              className="p-3 rounded bg-gray-800"
            />

            <input
              type="number"
              placeholder="Preço"
              value={
                novoProduto.preco
              }
              onChange={(e) =>
                setNovoProduto({
                  ...novoProduto,
                  preco:
                    e.target.value,
                })
              }
              className="p-3 rounded bg-gray-800"
            />

          </div>

          {/* SCANNER CADASTRO */}

          {mostrarScannerCadastro && (
            <div className="mt-4">

              <BarcodeScanner
                onScan={
                  handleScanCadastro
                }
                scannerId="reader-cadastro"
              />

            </div>
          )}

          <div className="flex gap-2 mt-6">

            <button
              onClick={
                adicionarProduto
              }
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Salvar
            </button>

            <button
              onClick={() =>
                setMostrandoNovo(
                  false
                )
              }
              className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded"
            >
              Cancelar
            </button>

          </div>

        </div>
      )}

      {/* TABELA */}

      {loading ? (
        <p>Carregando...</p>
      ) : erro ? (
        <p className="text-red-500">
          {erro}
        </p>
      ) : (
        <div className="overflow-x-auto">

          <table className="min-w-full border border-gray-700">

            <thead>

              <tr className="bg-gray-800 text-red-300">

                <th className="border border-gray-700 px-4 py-2">
                  Código
                </th>

                <th className="border border-gray-700 px-4 py-2">
                  Produto
                </th>

                <th className="border border-gray-700 px-4 py-2">
                  GTIN/EAN
                </th>

                <th className="border border-gray-700 px-4 py-2">
                  Localização
                </th>

                <th className="border border-gray-700 px-4 py-2">
                  Unidade
                </th>

                <th className="border border-gray-700 px-4 py-2">
                  Quantidade
                </th>

                <th className="border border-gray-700 px-4 py-2">
                  Ações
                </th>

              </tr>

            </thead>

            <tbody>

              {produtosFiltrados.length >
              0 ? (
                produtosFiltrados.map(
                  (p) => (
                    <tr
                      key={
                        p.codigo
                      }
                      className="hover:bg-gray-800"
                    >

                      <td className="border border-gray-700 px-4 py-2">
                        {p.codigo}
                      </td>

                      <td className="border border-gray-700 px-4 py-2">
                        {p.produto}
                      </td>

                      <td className="border border-gray-700 px-4 py-2">
                        {
                          p[
                            'GTIN/EAN'
                          ]
                        }
                      </td>

                      <td className="border border-gray-700 px-4 py-2">
                        {
                          p.Localizacao
                        }
                      </td>

                      <td className="border border-gray-700 px-4 py-2">
                        {
                          p.Unidade
                        }
                      </td>

                      <td className="border border-gray-700 px-4 py-2">
                        {
                          p.quantidade
                        }
                      </td>

                      <td className="border border-gray-700 px-4 py-2">

                        <button
                          onClick={() =>
                            excluirProduto(
                              p.codigo
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                        >
                          Excluir
                        </button>

                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-4 text-gray-400"
                  >
                    Nenhum produto encontrado.
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}
