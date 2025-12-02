import axios from 'axios';

const api = axios.create({
  // O back-end roda na porta 5000 e todas as rotas começam com /api
  baseURL: 'http://localhost:5000/api', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gym_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;