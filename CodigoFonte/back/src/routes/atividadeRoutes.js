const express = require('express');
const router = express.Router();
const AtividadeController = require('../controllers/atividadeController');
const { validateAtividade, validateAtividadeUpdate } = require('../middlewares/validationMiddleware');

// Rotas para CRUD de Atividades

// [RF002] Cadastrar nova atividade
router.post('/', validateAtividade, AtividadeController.create);

// [RF003] Consultar todas as atividades
router.get('/', AtividadeController.getAll);

// Consultar atividades disponíveis (com vagas)
router.get('/disponiveis', AtividadeController.getAvailable);

// Consultar atividade por ID
router.get('/:id', AtividadeController.getById);

// Consultar atividades por profissional
router.get('/profissional/:idProfissional', AtividadeController.getByProfissional);

// [RF004] Atualizar atividade
router.put('/:id', validateAtividadeUpdate, AtividadeController.update);

// [RF005] Excluir atividade
router.delete('/:id', AtividadeController.delete);

module.exports = router;
