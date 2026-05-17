const BASE_URL = "http://localhost:3000/api";

// =========================
// SERVIÇOS DO FEED
// =========================
export const feedAPI = {
  listar: async () => {
    const res = await fetch(`${BASE_URL}/feed`);
    return res.json();
  },
  criar: async (dados) => {
    const res = await fetch(`${BASE_URL}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    return { ok: res.ok, data: await res.json() };
  },
  editar: async (id, dados) => {
    return fetch(`${BASE_URL}/feed/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  },
  apagar: async (id) => {
    return fetch(`${BASE_URL}/feed/${id}`, { method: "DELETE" });
  },
};

// =========================
// SERVIÇOS DE EVENTOS
// =========================
export const eventosAPI = {
  listar: async () => {
    const res = await fetch(`${BASE_URL}/eventos`);
    return res.json();
  },
  criar: async (dados) => {
    return fetch(`${BASE_URL}/eventos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  },
  apagar: async (id) => {
    return fetch(`${BASE_URL}/eventos/${id}`, { method: "DELETE" });
  },
  marcarInteresse: async (id, vulgo) => {
    return fetch(`${BASE_URL}/eventos/${id}/interesse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vulgo }),
    });
  },
};

// =========================
// SERVIÇOS DE USUÁRIOS
// =========================
export const usuariosAPI = {
  buscar: async (vulgo) => {
    return fetch(`${BASE_URL}/usuarios/buscar/${vulgo}`);
  },
};
