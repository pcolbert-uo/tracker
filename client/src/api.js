const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

async function http(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data?.error || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  health: () => http("GET", "/api/health"),
  listItems: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return http("GET", `/api/items${qs ? `?${qs}` : ""}`);
  },
  getItem: (id) => http("GET", `/api/items/${id}`),
  createItem: (payload) => http("POST", "/api/items", payload),
  updateItem: (id, payload) => http("PUT", `/api/items/${id}`, payload),
  deleteItem: (id) => http("DELETE", `/api/items/${id}`)
};
