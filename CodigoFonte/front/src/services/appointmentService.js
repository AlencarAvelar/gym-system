import api from './api';

// GET: Buscar MEUS agendamentos
export const getMyAppointments = async () => {
  try {
    // 1. Chama a rota do Back-End
    // (Pergunte ao Alencar se a rota é '/agendamentos' mesmo e se ela já filtra pelo usuário logado)
    const response = await api.get('/agendamentos'); 

    // 2. MAPPER (Tradutor)
    // O Front espera: id, activity, type, professional, date, time
    // O Back manda: id_agendamento, atividade: { nome, tipo }, profissional: { nome }, data_agendada, horario_agendado
    
    const dataAdapted = response.data.map(item => {
      // Tratamento de data para formato legível (dd/mm/aaaa) ou input (aaaa-mm-dd)
      // Aqui vamos assumir que vem algo como "2025-11-20T00:00:00.000Z" ou direto "2025-11-20"
      const rawDate = item.data_agendada ? item.data_agendada.split('T')[0] : '';
      
      // Formata para exibição PT-BR (dia/mês/ano) se necessário, ou mantém ISO para o input
      // Vamos manter ISO (yyyy-mm-dd) pois o input type="date" exige isso, 
      // mas na tela podemos formatar visualmente depois se quiser.
      
      return {
        id: item.id_agendamento,
        
        // Dados aninhados (JOINs do backend)
        activity: item.atividade?.nome || "Atividade", 
        type: item.atividade?.tipo || "Treino", 
        
        // Nome do professor
        professional: item.profissional?.nome || "Instrutor",
        
        date: rawDate, 
        time: item.horario_agendado?.slice(0, 5), // Pega só HH:mm (corta os segundos se tiver)
        
        // O agendamento em si não tem "vagas", mas a atividade tem.
        // Se o back mandar, usamos. Se não, deixamos genérico.
        vacancies: item.atividade ? `${item.atividade.capacidade_atual || 0}/${item.atividade.capacidade_maxima}` : "-"
      };
    });

    return dataAdapted;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }
};

// DELETE: Cancelar agendamento
export const deleteAppointment = async (id) => {
  try {
    await api.delete(`/agendamentos/${id}`);
    return true;
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    throw error;
  }
};

// PUT: Atualizar agendamento (Remarcar)
export const updateAppointment = async (updatedItem) => {
  try {
    const payload = {
      data_agendada: updatedItem.date,
      horario_agendado: updatedItem.time
    };
    
    const response = await api.put(`/agendamentos/${updatedItem.id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    throw error;
  }
};