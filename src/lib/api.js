const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: "POST", body: data }),
  put: (endpoint, data) => request(endpoint, { method: "PUT", body: data }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};

export const authApi = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }),
  register: (name, email, password, addresses) =>
    api.post("/auth/register", { name, email, password, addresses }),
  getMe: (token) =>
    request("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export const productApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/products${query ? `?${query}` : ""}`);
  },
  getById: (id) => api.get(`/products/${id}`),
  create: (data, token) =>
    request("/products", {
      method: "POST",
      body: data,
      headers: { Authorization: `Bearer ${token}` },
    }),
  update: (id, data, token) =>
    request(`/products/${id}`, {
      method: "PUT",
      body: data,
      headers: { Authorization: `Bearer ${token}` },
    }),
  delete: (id, token) =>
    request(`/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export const orderApi = {
  getAll: (token) =>
    request("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getById: (id, token) =>
    request(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  create: (data, token) =>
    request("/orders", {
      method: "POST",
      body: data,
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateStatus: (id, data, token) =>
    request(`/orders/${id}/status`, {
      method: "PUT",
      body: data,
      headers: { Authorization: `Bearer ${token}` },
    }),
};
