export const supabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      data: [{ id: 1, nome: "Produto Teste", quantidade: 10 }],
      error: null,
    })),

    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => ({
          data: {
            id: 2,
            nome: "Cabo USB-C",
            quantidade: 5,
          },
          error: null,
        })),
      })),
    })),
  })),
};
