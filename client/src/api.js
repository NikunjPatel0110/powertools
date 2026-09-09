const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = `${API_BASE}/api`;

export const getToken = () => localStorage.getItem('admin_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

export const api = {
  getProducts: () => fetch(`${API}/products`).then(r => r.json()),
  getProduct: (id) => fetch(`${API}/products/${id}`).then(r => r.json()),
  createProduct: (data) => fetch(`${API}/products`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  updateProduct: (id, data) => fetch(`${API}/products/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  deleteProduct: (id) => fetch(`${API}/products/${id}`, { method: 'DELETE', headers: authHeaders() }).then(r => r.json()),

  getCategories: () => fetch(`${API}/categories`).then(r => r.json()),
  createCategory: (data) => fetch(`${API}/categories`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  updateCategory: (id, data) => fetch(`${API}/categories/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  deleteCategory: (id) => fetch(`${API}/categories/${id}`, { method: 'DELETE', headers: authHeaders() }).then(r => r.json()),

  getEnquiries: () => fetch(`${API}/enquiries`, { headers: authHeaders() }).then(r => r.json()),
  createEnquiry: (data) => fetch(`${API}/enquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),

  login: (data) => fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),

  uploadImage: (file) => {
    const fd = new FormData(); fd.append('image', file);
    return fetch(`${API}/upload`, { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body: fd }).then(r => r.json());
  },
};
