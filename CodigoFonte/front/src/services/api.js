import axios from 'axios';

// Configura a URL base
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Porta do Back-End
  withCredentials: true // Importante para cookies, se usado
});

// Interceptor para injetar o Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gym_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para tratar erros globais (Ex: Token expirado)
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Se der erro 401 (Não autorizado), pode ser token vencido
    // Podemos limpar o storage e redirecionar para login (opcional por enquanto)
    // localStorage.removeItem('gym_token');
    // window.location.href = '/';
  }
  return Promise.reject(error);
});

export default api;