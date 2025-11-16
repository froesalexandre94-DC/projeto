import { GET, POST } from "@/app/api/estoque/route";

describe("API de Estoque", () => {
  it("deve retornar a lista de produtos", async () => {
    const req = new Request("http://localhost/api/estoque", { method: "GET" });

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("deve criar um novo produto", async () => {
    const req = new Request("http://localhost/api/estoque", {
      method: "POST",
      body: JSON.stringify({ nome: "Cabo USB-C", quantidade: 5 }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.data).toHaveProperty("id");
    expect(body.data.nome).toBe("Cabo USB-C");
  });
});
