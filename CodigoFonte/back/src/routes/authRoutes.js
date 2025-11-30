const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Validação de login/register
const validateLogin = (req, res, next) => {
  const { email, senha } = req.body;
  
  if (!email || !senha) {
    return res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios'
    });
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido'
    });
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { nome, email, senha, tipo_usuario } = req.body;
  
  if (!nome || !email || !senha || !tipo_usuario) {
    return res.status(400).json({
      success: false,
      message: 'Nome, email, senha e tipo de usuário são obrigatórios'
    });
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido'
    });
  }

  // Validação de senha
  if (senha.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Senha deve ter pelo menos 6 caracteres'
    });
  }

  // Validação de tipo de usuário
  const tiposValidos = ['Cliente', 'Professor', 'Personal Trainer'];
  if (!tiposValidos.includes(tipo_usuario)) {
    return res.status(400).json({
      success: false,
      message: 'Tipo de usuário inválido. Opções: Cliente, Professor, Personal Trainer'
    });
  }

  next();
};

// Rotas de autenticação
router.post('/login', validateLogin, AuthController.login);
router.post('/register', validateRegister, AuthController.register);
router.get('/profile', AuthController.getProfile);
router.post('/logout', AuthController.logout);

module.exports = router;
