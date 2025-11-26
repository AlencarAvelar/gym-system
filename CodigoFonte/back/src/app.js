
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const agendamentoRoutes = require('./routes/agendamentoRoutes');





const atividadeRoutes = require('./routes/atividadeRoutes');

const app = express();

// Middlewares
app.use(cors()); // Necessário para permitir requisições do Postman/Front-end
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
// ...
});

// Rotas da API
app.use('/api/atividades', atividadeRoutes);
app.use('/api/agendamentos', agendamentoRoutes);

// ...
module.exports = app;