import api from './api';
import { getAvailableActivities } from './activityService';

/**
 * Módulo de serviços para gerenciamento de Agendamentos (visão do Cliente).
 * Responsável por listar, atualizar e cancelar os agendamentos do usuário.
 */

/**
 * Recupera a lista de agendamentos do usuário logado.
 * Realiza um cruzamento de dados com o serviço de atividades para obter informações
 * atualizadas de vagas, já que o endpoint de agendamento não fornece esse dado diretamente.
 * * * @returns {Promise<Array>} Lista de agendamentos formatada e filtrada (sem cancelados).
 */
export const getMyAppointments = async () => {
  try {
    // Busca paralela ou sequencial dos dados necessários
    const responseAppointments = await api.get('/agendamentos');
    const listaAgendamentos = responseAppointments.data.data || [];

    // Busca detalhes das atividades para enriquecer os dados (ex: vagas reais)
    const atividadesDetalhadas = await getAvailableActivities();

    const dataAdapted = listaAgendamentos.map(item => {
      const rawDate = item.data_agendada ? item.data_agendada.split('T')[0] : '';
      const rawTime = item.horario_agendado ? item.horario_agendado.slice(0, 5) : '';

      // Encontra a atividade correspondente para obter metadados atualizados
      const atividadeInfo = atividadesDetalhadas.find(atv => atv.id === item.id_atividade);

      const vagasReais = atividadeInfo ? atividadeInfo.vacancies : "-";

      return {
        id: item.id_agendamento,
        // Prioriza o nome vindo do join, ou usa o fallback do cruzamento
        activity: item.nome_atividade || (atividadeInfo ? atividadeInfo.name : "Atividade"),
        type: item.tipo_atividade || (atividadeInfo ? atividadeInfo.type : "Treino"),
        professional: item.nome_profissional || "Instrutor",
        date: rawDate,
        time: rawTime,
        vacancies: vagasReais,
        status: item.status
      };
    });

    // Regra de Negócio: O cliente não precisa ver agendamentos cancelados na lista principal
    return dataAdapted.filter(item => item.status !== 'Cancelado');

  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }
};

/**
 * Cancela um agendamento existente.
 * * @param {number|string} id - O identificador do agendamento.
 * @returns {Promise<boolean>} Retorna true em caso de sucesso.
 * @throws {Object} Objeto de erro contendo a resposta do servidor.
 */
export const deleteAppointment = async (id) => {
  try {
    await api.delete(`/agendamentos/${id}`);
    return true;
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);

    const msg = error.response?.data?.message || "Erro ao cancelar.";
    alert(msg);

    throw error;
  }
};

/**
 * Atualiza a data e horário de um agendamento (Remarcação).
 * * @param {Object} updatedItem - Objeto contendo id, date e time novos.
 * @returns {Promise<Object>} Os dados do agendamento atualizado.
 * @throws {Object} Objeto de erro contendo a resposta do servidor.
 */
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

    const msg = error.response?.data?.message || "Erro ao remarcar.";
    alert(msg);

    throw error;
  }
};