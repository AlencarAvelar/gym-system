import axios from 'axios';

/**
 * Instância principal do Axios configurada para comunicação com a API.
 * Define a URL base e configurações de credenciais.
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

/**
 * Interceptor de Requisição.
 * Injeta automaticamente o token JWT no cabeçalho Authorization
 * de todas as requisições, caso o usuário esteja autenticado.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gym_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Resposta.
 * Centraliza o tratamento de erros da API.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento para erro 401 (Não Autorizado / Token Expirado)
    if (error.response && error.response.status === 401) {
      // Futuramente, pode-se implementar aqui o logout automático
      // ou a lógica de refresh token.
    }
    return Promise.reject(error);
  }
);

export default api;