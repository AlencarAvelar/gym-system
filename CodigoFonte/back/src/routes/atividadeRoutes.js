const express = require('express');
const router = express.Router();
const AtividadeController = require('../controllers/atividadeController');
const { protect, restrictTo } = require('../middlewares/authMiddleware'); // ← ADICIONAR
const { validateAtividade, validateAtividadeUpdate } = require('../middlewares/atividadeValidation'); // ← SE EXISTIR

// Rotas SEM autenticação 
router.get('/public', AtividadeController.getAllPublic); 
router.get('/public/disponiveis', AtividadeController.getAvailablePublic); 

// Rotas COM autenticação 
router.get('/', protect, AtividadeController.getAll);
router.get('/disponiveis', protect, AtividadeController.getAvailable); 

// Cadastrar atividade (Apenas Professor/Personal Trainer/Admin)
router.post('/', 
  protect, 
  restrictTo('Professor', 'Personal Trainer', 'Administrador'), 
  validateAtividade, 
  AtividadeController.create
);

// Buscar atividade por ID (qualquer usuário autenticado)
router.get('/:id', protect, AtividadeController.getById);

// Atualizar atividade (Professor/Personal Trainer/Admin)
router.put('/:id', 
  protect, 
  restrictTo('Professor', 'Personal Trainer', 'Administrador'), 
  validateAtividadeUpdate, 
  AtividadeController.update
);

// Buscar atividades por profissional (Professor/Personal Trainer)
router.get('/profissional/:id', 
  protect, 
  restrictTo('Professor', 'Personal Trainer', 'Administrador'), 
  AtividadeController.getByProfissional
);

// Excluir atividade (Apenas Admin/Professor que criou)
router.delete('/:id', 
  protect, 
  restrictTo('Professor', 'Personal Trainer', 'Administrador'), 
  AtividadeController.delete
);

module.exports = router;
