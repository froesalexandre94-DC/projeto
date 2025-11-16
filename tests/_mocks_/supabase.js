export const supabase = {
  from: jest.fn(() => supabase),

  select: jest.fn(() => ({
    data: [{ id: 1, nome: "Produto Teste", quantidade: 10 }],
    error: null
  })),

  insert: jest.fn(() => ({
    data: { id: 2, nome: "Cabo USB-C", quantidade: 5 },
    error: null
  }))
};
