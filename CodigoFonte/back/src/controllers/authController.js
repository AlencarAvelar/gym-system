const AuthService = require('../services/authService');

class AuthController {
  /**
   * Login do usuário
   */
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Validações básicas
      if (!email || !senha) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      const result = await AuthService.login(email, senha);

      if (!result.success) {
        return res.status(401).json(result);
      }

      // Configurar cookie
      res.cookie('token', result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller de login:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      });
    }
  }

  /**
   * Registrar novo usuário
   */
  static async register(req, res) {
    try {
      const { nome, email, senha, tipo_usuario } = req.body;

      // Validações
      if (!nome || !email || !senha || !tipo_usuario) {
        return res.status(400).json({
          success: false,
          message: 'Nome, email, senha e tipo de usuário são obrigatórios'
        });
      }

      // Validação de senha (mínimo 6 caracteres)
      if (senha.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Senha deve ter pelo menos 6 caracteres'
        });
      }

      const result = await AuthService.register({ nome, email, senha, tipo_usuario });

      if (!result.success) {
        return res.status(400).json(result);
      }

      // Configurar cookie
      res.cookie('token', result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error('Erro no controller de registro:', error);
      
      if (error.message === 'Email já está cadastrado') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      });
    }
  }

  /**
   * Verificar usuário logado (middleware)
   */
  static async getProfile(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.token;
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token de autenticação não fornecido'
        });
      }

      const result = AuthService.verifyToken(token);

      if (!result.success) {
        return res.status(401).json({
          success: false,
          message: result.message
        });
      }

      // Buscar dados completos do usuário
      const usuario = await UsuarioModel.findById(result.user.id_usuario);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const painelInfo = AuthService.getPainelByTipo(usuario.tipo_usuario);

      return res.status(200).json({
        success: true,
        data: {
          usuario: {
            id: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            tipo_usuario: usuario.tipo_usuario
          },
          painel: painelInfo,
          token: token
        }
      });
    } catch (error) {
      console.error('Erro no controller de perfil:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      });
    }
  }

  /**
   * Logout (invalida cookie)
   */
  static async logout(req, res) {
    try {
      // Limpar cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      console.error('Erro no controller de logout:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      });
    }
  }
}

module.exports = AuthController;
