import axios from 'axios';

// In production the frontend is served by the same Express server,
// so /api works as a relative path. In dev, Vite proxies /api to localhost:5000.
const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
