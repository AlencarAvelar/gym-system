import api from './api';

/**
 * Serviço responsável por gerenciar autenticação e sessão do usuário.
 */
export const authService = {
  /**
   * Realiza o login do usuário na plataforma.
   * * @param {string} email - O email do usuário.
   * @param {string} senha - A senha do usuário.
   * @returns {Promise<Object|null>} Retorna os dados do usuário se bem-sucedido, ou null.
   * @throws {string} Mensagem de erro em caso de falha.
   */
  async login(email, senha) {
    try {
      const response = await api.post('/auth/login', { email, senha });

      if (response.data.success) {
        const { token, usuario } = response.data.data;

        // Normalização: Garante que o campo id_usuario exista para consistência no front-end
        if (!usuario.id_usuario && usuario.id) {
          usuario.id_usuario = usuario.id;
        }

        // Persistência da sessão
        localStorage.setItem('gym_token', token);
        localStorage.setItem('gym_user', JSON.stringify(usuario));

        return usuario;
      }
      return null;
    } catch (error) {
      // Extrai a mensagem de erro mais específica possível da resposta
      const errorMsg = error.response?.data?.message || "Erro ao conectar com servidor";
      throw errorMsg;
    }
  },

  /**
   * Encerra a sessão do usuário, limpando o armazenamento local e redirecionando.
   */
  logout() {
    localStorage.removeItem('gym_token');
    localStorage.removeItem('gym_user');
    window.location.href = '/';
  },

  /**
   * Recupera os dados do usuário logado armazenados localmente.
   * * @returns {Object|null} O objeto do usuário ou null se não houver sessão.
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('gym_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Erro ao ler dados do usuário:", e);
      return null;
    }
  }
};