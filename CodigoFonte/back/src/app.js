const express = require('express');
const cors = require('cors');
require('dotenv').config();

const atividadeRoutes = require('./routes/atividadeRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes'); // ← ADICIONE ESTA LINHA

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Gym System rodando!',
    version: '1.0.0'
  });
});

// Rotas da API
app.use('/api/atividades', atividadeRoutes);
app.use('/api/agendamentos', agendamentoRoutes); // ← ADICIONE ESTA LINHA

module.exports = app;
