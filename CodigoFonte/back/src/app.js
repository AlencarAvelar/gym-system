const express = require('express');
const cors = require('cors');
require('dotenv').config();

const atividadeRoutes = require('./routes/atividadeRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'API Gym System - Backend funcionando!',
    version: '1.0.0',
    endpoints: {
      atividades: '/api/atividades'
    }
  });
});

// Rotas da API
app.use('/api/atividades', atividadeRoutes);

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: err.message
  });
});

module.exports = app;
