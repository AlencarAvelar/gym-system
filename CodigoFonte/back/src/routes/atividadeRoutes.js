const express = require('express');
const router = express.Router();
const AtividadeController = require('../controllers/atividadeController');
const { validateAtividade, validateAtividadeUpdate } = require('../middlewares/validationMiddleware');
// const { protect, restrictTo } = require('../middlewares/authMiddleware'); // COMENTADO/REMOVIDO

// Rotas para CRUD de Atividades

// [RF002] Cadastrar nova atividade (Sem proteção)
router.post('/', validateAtividade, AtividadeController.create);

// [RF003] Consultar todas as atividades (Sem proteção)
router.get('/', AtividadeController.getAll);

// Consultar atividades disponíveis
router.get('/disponiveis', AtividadeController.getAvailable);

// Consultar atividade por ID
router.get('/:id', AtividadeController.getById);

// Consultar atividades por profissional
router.get('/profissional/:idProfissional', AtividadeController.getByProfissional);

// [RF004] Atualizar atividade (Sem proteção)
router.put('/:id', validateAtividadeUpdate, AtividadeController.update);

// [RF005] Excluir atividade (Sem proteção)
router.delete('/:id', AtividadeController.delete);

module.exports = router;