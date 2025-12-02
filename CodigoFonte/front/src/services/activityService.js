import api from './api';

// GET: Buscar atividades disponíveis para o cliente
export const getAvailableActivities = async () => {
  try {
    const response = await api.get('/atividades/disponiveis'); 
    const lista = response.data.data || [];

    return lista.map(item => {
      // Cálculo Seguro
      const total = parseInt(item.capacidade_max || 0);
      
      // O back de 'disponiveis' já manda 'vagas_disponiveis' (livres)
      const livres = parseInt(item.vagas_disponiveis || 0);
      const ocupadas = total - livres;

      // Verifica se está lotado de verdade
      const isFull = livres <= 0;

      return {
        id: item.id_atividade,          
        name: item.nome_atividade,      
        type: item.tipo_atividade,      
        professional: item.nome_profissional || "Instrutor", 
        
        // --- CORREÇÃO 1: Mostrar Duração em vez de "A definir" ---
        time: item.duracao ? `${item.duracao} min` : "-", 
        
        // --- CORREÇÃO 2: Formato para exibição ---
        // Vamos mostrar "Livres / Total" para o cliente saber quantas sobram?
        // Ou mantemos "Ocupadas / Total"? O print mostra "0/20" (Ocupadas).
        // Vamos manter o padrão Ocupadas/Total.
        vacancies: `${ocupadas}/${total}`,
        
        // --- DADO EXTRA: Flag booleana para o botão saber se bloqueia ---
        isFull: isFull 
      };
    });
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return [];
  }
};

// POST: Criar um agendamento
export const createSchedule = async (activityId, date, time) => {
  try {
    const payload = {
      id_atividade: activityId,
      data_agendada: date,
      horario_agendado: time
    };

    const response = await api.post('/agendamentos', payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    throw error.response?.data?.message || "Erro ao agendar.";
  }
};