/**
 * Middleware para validação de dados do agendamento (Criação - RF006)
 */
const validateAgendamento = (req, res, next) => {
  const { id_atividade, data_agendada, horario_agendado } = req.body;
  
  const errors = [];
  
  // Validações
  if (!id_atividade) {
    errors.push('ID da atividade é obrigatório');
  }
  
  if (!data_agendada || data_agendada.trim() === '') {
    errors.push('Data do agendamento é obrigatória');
  } else {
    // Valida formato de data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data_agendada)) {
      errors.push('Formato de data inválido. Use YYYY-MM-DD');
    } else {
      // Verifica se a data não é passada
      const dataAgendamento = new Date(data_agendada);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (dataAgendamento < hoje) {
        errors.push('Não é possível agendar para uma data passada');
      }
    }
  }
  
  if (!horario_agendado || horario_agendado.trim() === '') {
    errors.push('Horário do agendamento é obrigatório');
  } else {
    // Valida formato de horário (HH:MM ou HH:MM:SS)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    if (!timeRegex.test(horario_agendado)) {
      errors.push('Formato de horário inválido. Use HH:MM');
    }
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

/**
 * Middleware para validação de atualização de agendamento (Atualização - RF008)
 */
const validateAgendamentoUpdate = (req, res, next) => {
  const { data_agendada, horario_agendado } = req.body;
  
  const errors = [];
  
  if (!data_agendada || data_agendada.trim() === '') {
    errors.push('Data do agendamento é obrigatória');
  } else {
    // Valida formato de data
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data_agendada)) {
      errors.push('Formato de data inválido. Use YYYY-MM-DD');
    } else {
      // Verifica se a data não é passada
      const dataAgendamento = new Date(data_agendada);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (dataAgendamento < hoje) {
        errors.push('Não é possível agendar para uma data passada');
      }
    }
  }
  
  if (!horario_agendado || horario_agendado.trim() === '') {
    errors.push('Horário do agendamento é obrigatório');
  } else {
    // Valida formato de horário
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    if (!timeRegex.test(horario_agendado)) {
      errors.push('Formato de horário inválido. Use HH:MM');
    }
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
  validateAgendamento,
  validateAgendamentoUpdate
};
