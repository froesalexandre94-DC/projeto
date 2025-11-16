export const supabase = {
  from: jest.fn((table) => ({
    select: jest.fn().mockResolvedValue(
      table === "vendas"
        ? { data: [{ codigo: 1, produto: "Cabo", quantidade: 5 }], error: null }
        : { data: [{ codigo: 1, produto: "Cabo", quantidade: 80 }], error: null }
    )
  }))
};
