const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/agendamentoController');
const { validateAgendamento, validateAgendamentoUpdate } = require('../middlewares/agendamentoValidation');
// const { protect, restrictTo } = require('../middlewares/authMiddleware'); // Para implementar depois

// Rotas para CRUD de Agendamentos

// [RF006] Criar novo agendamento (Cliente)
// router.post('/', protect, restrictTo('Cliente'), validateAgendamento, AgendamentoController.create);
router.post('/', validateAgendamento, AgendamentoController.create);

// [RF007] Consultar agendamentos (Cliente, Professor, Personal Trainer)
// router.get('/', protect, restrictTo('Cliente', 'Professor', 'Personal Trainer'), AgendamentoController.getAll);
router.get('/', AgendamentoController.getAll);

// Consultar agendamento por ID
// router.get('/:id', protect, AgendamentoController.getById);
router.get('/:id', AgendamentoController.getById);

// [RF008] Atualizar agendamento (Cliente)
// router.put('/:id', protect, restrictTo('Cliente'), validateAgendamentoUpdate, AgendamentoController.update);
router.put('/:id', validateAgendamentoUpdate, AgendamentoController.update);

// [RF009] Cancelar agendamento (Cliente)
// router.delete('/:id', protect, restrictTo('Cliente'), AgendamentoController.cancel);
router.delete('/:id', AgendamentoController.cancel);

module.exports = router;
