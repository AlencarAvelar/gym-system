import api from './api';

export const authService = {
  // Login
  async login(email, senha) {
    try {
      const response = await api.post('/auth/login', { email, senha });
      
      if (response.data.success) {
        const { token, usuario } = response.data.data;
        
        // --- CORREÇÃO CRÍTICA ---
        // O Back manda 'id', mas o Front espera 'id_usuario'.
        // Aqui garantimos que 'id_usuario' sempre exista.
        if (!usuario.id_usuario && usuario.id) {
            usuario.id_usuario = usuario.id;
        }

        console.log("✅ Usuário salvo com sucesso:", usuario); // Debug para você ver

        localStorage.setItem('gym_token', token);
        localStorage.setItem('gym_user', JSON.stringify(usuario));
        
        return usuario;
      }
      return null;
    } catch (error) {
      console.error("Erro no login:", error);
      // Tratamento seguro para mensagem de erro
      const errorMsg = error.response?.data?.message || "Erro ao conectar com servidor";
      throw errorMsg;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('gym_token');
    localStorage.removeItem('gym_user');
    window.location.href = '/';
  },

  // Pegar usuário atual
  getCurrentUser() {
    const userStr = localStorage.getItem('gym_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
};