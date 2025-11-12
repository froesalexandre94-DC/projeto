import { GET, POST, PUT, DELETE } from '@/app/api/estoque/route';

describe('API de Estoque', () => {
  it('deve retornar a lista de produtos', async () => {
    const req = new Request('http://localhost/api/estoque', { method: 'GET' });
    const res = await GET(req);
    expect(res.status).toBe(200);
  });

  it('deve criar um novo produto', async () => {
    const req = new Request('http://localhost/api/estoque', {
      method: 'POST',
      body: JSON.stringify({ nome: 'Cabo USB-C', quantidade: 5 })
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});
