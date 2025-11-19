// Middleware para validação de dados da atividade
const validateAtividade = (req, res, next) => {
  const { nome_atividade, tipo_atividade, descricao, duracao, capacidade_max, id_profissional } = req.body;
  
  const errors = [];
  
  // Validações
  if (!nome_atividade || nome_atividade.trim() === '') {
    errors.push('Nome da atividade é obrigatório');
  }
  
  if (!tipo_atividade || !['Aula', 'Treino'].includes(tipo_atividade)) {
    errors.push('Tipo de atividade deve ser "Aula" ou "Treino"');
  }
  
  if (!descricao || descricao.trim() === '') {
    errors.push('Descrição é obrigatória');
  }
  
  if (!duracao || duracao <= 0) {
    errors.push('Duração deve ser maior que zero');
  }
  
  if (!capacidade_max || capacidade_max <= 0) {
    errors.push('Capacidade máxima deve ser maior que zero');
  }
  
  if (!id_profissional) {
    errors.push('ID do profissional é obrigatório');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: errors
    });
  }
  
  next();
};

// Middleware para validação de atualização
const validateAtividadeUpdate = (req, res, next) => {
  const { nome_atividade, tipo_atividade, descricao, duracao, capacidade_max } = req.body;
  
  const errors = [];
  
  if (!nome_atividade || nome_atividade.trim() === '') {
    errors.push('Nome da atividade é obrigatório');
  }
  
  if (!tipo_atividade || !['Aula', 'Treino'].includes(tipo_atividade)) {
    errors.push('Tipo de atividade deve ser "Aula" ou "Treino"');
  }
  
  if (!descricao || descricao.trim() === '') {
    errors.push('Descrição é obrigatória');
  }
  
  if (!duracao || duracao <= 0) {
    errors.push('Duração deve ser maior que zero');
  }
  
  if (!capacidade_max || capacidade_max <= 0) {
    errors.push('Capacidade máxima deve ser maior que zero');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: errors
    });
  }
  
  next();
};

module.exports = {
  validateAtividade,
  validateAtividadeUpdate
};
