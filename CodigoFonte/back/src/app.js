const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // ← ADICIONAR
require('dotenv').config();

const atividadeRoutes = require('./routes/atividadeRoutes'); // ← ATUALIZAR
const agendamentoRoutes = require('./routes/agendamentoRoutes'); // ← ATUALIZAR
const authRoutes = require('./routes/authRoutes'); // ← NOVO

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], // Frontend URLs
  credentials: true // ← IMPORTANTE para cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ← ADICIONAR para cookies

// Rotas da API
app.use('/api/auth', authRoutes); // ← NOVO
app.use('/api/atividades', atividadeRoutes); // ← JÁ EXISTE
app.use('/api/agendamentos', agendamentoRoutes); // ← JÁ EXISTE

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Gym System rodando!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      atividades: '/api/atividades',
      agendamentos: '/api/agendamentos'
    }
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

module.exports = app;
