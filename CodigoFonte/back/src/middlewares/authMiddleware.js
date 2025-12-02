const AuthService = require('../services/authService');
const UsuarioModel = require('../models/usuarioModel');

/**
 * Middleware para proteger rotas (verifica JWT token)
 */
const protect = async (req, res, next) => {
  try {
    // Buscar token do header ou cookie
    let token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }

    // Verificar token
    const result = AuthService.verifyToken(token);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message
      });
    }

    // Buscar usuário completo
    const usuario = await UsuarioModel.findById(result.user.id_usuario);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Adicionar usuário ao request
    req.user = {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario
    };

    // Adicionar painel info
    req.painel = AuthService.getPainelByTipo(usuario.tipo_usuario);

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno no servidor'
    });
  }
};

/**
 * Middleware para restringir acesso por tipo de usuário
 */
const restrictTo = (...tipos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    if (!tipos.includes(req.user.tipo_usuario)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você não tem permissão para esta operação.'
      });
    }

    next();
  };
};

/**
 * Middleware para verificar permissão específica
 */
const authorize = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    const hasPermission = AuthService.hasPermission(req.user.tipo_usuario, requiredPermission);
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Permissão insuficiente.'
      });
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo,
  authorize
};
