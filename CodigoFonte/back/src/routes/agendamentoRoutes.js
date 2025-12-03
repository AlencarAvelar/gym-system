const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/agendamentoController');
const { validateAgendamento, validateAgendamentoUpdate } = require('../middlewares/agendamentoValidation');
const { protect, restrictTo } = require('../middlewares/authMiddleware'); // ← ADICIONAR

// ============================================
// ROTAS PÚBLICAS 
// ============================================

// Criar agendamento público (para testes)
router.post('/public', validateAgendamento, AgendamentoController.createPublic);

// Listar agendamentos públicos (para testes)
router.get('/public', AgendamentoController.getAllPublic);

// Atualizar agendamento público (para testes)
router.put('/public/:id', validateAgendamentoUpdate, AgendamentoController.updatePublic);

// Cancelar agendamento público (para testes)
router.delete('/public/:id', AgendamentoController.cancelPublic);

// Buscar agendamento por ID público (para testes)
router.get('/public/:id', AgendamentoController.getById);

// ============================================
// ROTAS PROTEGIDAS 
// ============================================

// [RF006] Criar agendamento (apenas cliente logado)
router.post('/', 
  protect, 
  restrictTo('Cliente'), 
  validateAgendamento, 
  AgendamentoController.create
);

// [RF007] Consultar agendamentos (cliente/profs)
router.get('/', 
  protect, 
  restrictTo('Cliente', 'Professor', 'Personal Trainer', 'Administrador'), 
  AgendamentoController.getAll
);

// Consultar agendamento por ID (qualquer usuário autenticado)
router.get('/:id', 
  protect, 
  AgendamentoController.getById
);

// [RF008] Atualizar agendamento (apenas cliente logado)
router.put('/:id', 
  protect, 
  restrictTo('Cliente'), 
  validateAgendamentoUpdate, 
  AgendamentoController.update
);

// [RF009] Cancelar agendamento (apenas cliente logado)
router.delete('/:id', 
  protect, 
  restrictTo('Cliente'), 
  AgendamentoController.cancel
);

module.exports = router;
