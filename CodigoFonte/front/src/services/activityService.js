import api from './api';

// GET: Buscar atividades disponíveis (Conectado ao Back-End)
export const getAvailableActivities = async () => {
  try {
    // 1. Chama a rota real do Alencar
    const response = await api.get('/atividades'); 

    // 2. MAPPER (O Tradutor)
    // O Back manda: { id_atividade, nome, tipo, capacidade_maxima, ... }
    // O Front espera: { id, name, type, vacancies, ... }
    const dataAdapted = response.data.map(item => ({
      id: item.id_atividade,          
      name: item.nome,                
      type: item.tipo,                
      
      // Tenta pegar o nome do professor se vier populado, senão põe genérico
      professional: item.usuario?.nome || "Instrutor", 
      
      // O horário não vem no cadastro da atividade, então mantemos o texto padrão
      time: "A definir",              
      
      // Mostra Capacidade (Ex: "20/20")
      // Nota: Se o back não mandar quantos já agendaram, assumimos 0 por enquanto
      vacancies: `${item.capacidade_atual || 0}/${item.capacidade_maxima}`
    }));

    return dataAdapted;
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return []; // Retorna lista vazia para não quebrar a tela
  }
};

// POST: Criar um agendamento
export const createSchedule = async (activityId, date, time) => {
  try {
    // Envia para a rota de agendamento do Alencar
    // Ajuste o nome dos campos se necessário (ex: id_atividade vs activityId)
    const payload = {
      id_atividade: activityId,
      data_agendada: date,
      horario_agendado: time
    };

    const response = await api.post('/agendamentos', payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    throw error; // Lança o erro para a tela tratar
  }
};