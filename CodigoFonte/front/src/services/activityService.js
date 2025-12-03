import api from './api';

/**
 * Módulo de serviços relacionados a Atividades (visão do Cliente).
 * Responsável por buscar aulas disponíveis e realizar agendamentos.
 */

/**
 * Recupera a lista de atividades disponíveis para agendamento.
 * Filtra e formata os dados vindos do backend para exibição no card do cliente.
 * * @returns {Promise<Array>} Lista de atividades formatada com status de vagas.
 */
export const getAvailableActivities = async () => {
  try {
    const response = await api.get('/atividades/disponiveis');

    // Garante que a resposta seja tratada como array
    const lista = response.data.data || [];

    return lista.map(item => {
      const total = parseInt(item.capacidade_max || 0);
      const disponiveis = parseInt(item.vagas_disponiveis || 0);

      // Calcula o número de vagas ocupadas para exibição "Ocupadas/Total"
      const ocupadas = total - disponiveis;

      // Define se a atividade está lotada (sem vagas livres)
      const isFull = disponiveis <= 0;

      return {
        id: item.id_atividade,
        name: item.nome_atividade,
        type: item.tipo_atividade,
        professional: item.nome_profissional || "Instrutor",

        // Formatação visual
        time: item.duracao ? `${item.duracao} min` : "-",
        vacancies: `${ocupadas}/${total}`,

        // Flag booleana para controle de UI (botão desabilitado)
        isFull: isFull
      };
    });
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return [];
  }
};

/**
 * Realiza o agendamento de uma atividade para o cliente logado.
 * * @param {number|string} activityId - ID da atividade.
 * @param {string} date - Data do agendamento (YYYY-MM-DD).
 * @param {string} time - Horário do agendamento (HH:MM).
 * @returns {Promise<Object>} Dados do agendamento criado.
 * @throws {string} Mensagem de erro em caso de falha (ex: conflito, sem vaga).
 */
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
    throw error.response?.data?.message || "Erro ao realizar agendamento.";
  }
};