import api from './api';
import { authService } from './authService';

/**
 * Módulo de serviços para o Painel do Profissional.
 * Gerencia atividades ofertadas pelo usuário logado e a lista de alunos inscritos.
 */

/**
 * Recupera as atividades ministradas pelo profissional atualmente logado.
 * * @returns {Promise<Array>} Lista de atividades formatada com cálculo de vagas.
 * @throws {Error} Se não houver usuário logado.
 */
export const getMyOfferedActivities = async () => {
  try {
    const user = authService.getCurrentUser();
    if (!user || !user.id_usuario) {
      throw new Error("Usuário não identificado");
    }

    const response = await api.get(`/atividades/profissional/${user.id_usuario}`);
    const lista = response.data.data || [];

    return lista.map(item => {
      const total = parseInt(item.capacidade_max || 0);

      // O endpoint específico do profissional retorna 'agendamentos_ativos'
      const ocupadas = item.agendamentos_ativos ? parseInt(item.agendamentos_ativos) : 0;

      return {
        id: item.id_atividade,
        name: item.nome_atividade,
        type: item.tipo_atividade,
        description: item.descricao,
        duration: item.duracao ? `${item.duracao} min` : '0 min',
        capacity: total,
        time: item.duracao ? `${item.duracao} min` : "A definir",

        // Formatação: "Ocupadas / Total"
        vacancies: `${ocupadas}/${total}`
      };
    });
  } catch (error) {
    console.error("Erro ao buscar minhas atividades:", error);
    return [];
  }
};

/**
 * Cadastra uma nova atividade vinculada ao profissional logado.
 * * @param {Object} newActivity - Dados da nova atividade.
 * @returns {Promise<Object>} A atividade criada.
 * @throws {string} Mensagem de erro em caso de falha.
 */
export const createOfferedActivity = async (newActivity) => {
  try {
    const user = authService.getCurrentUser();
    if (!user || !user.id_usuario) throw new Error("Sessão inválida.");

    const payload = {
      nome_atividade: newActivity.name,
      tipo_atividade: newActivity.type,
      descricao: newActivity.description,
      duracao: parseInt(newActivity.duration.toString().replace(/\D/g, '')),
      capacidade_max: parseInt(newActivity.capacity),
      // O ID é injetado aqui para passar na validação do backend
      id_profissional: user.id_usuario
    };

    const response = await api.post('/atividades', payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar:", error);
    const serverMessage = error.response?.data?.message || "Erro ao criar.";
    const validationDetails = error.response?.data?.errors ? "\n" + error.response.data.errors.join("\n") : "";
    throw serverMessage + validationDetails;
  }
};

/**
 * Remove uma atividade ofertada pelo profissional.
 * * @param {number|string} id - ID da atividade.
 * @returns {Promise<boolean>} Retorna true em caso de sucesso.
 * @throws {string} Mensagem de erro (ex: se houver inscritos).
 */
export const deleteOfferedActivity = async (id) => {
  try {
    await api.delete(`/atividades/${id}`);
    return true;
  } catch (error) {
    console.error("Erro ao excluir atividade:", error);
    throw error.response?.data?.message || "Erro ao excluir.";
  }
};

/**
 * Recupera a lista de alunos inscritos em todas as aulas do profissional logado.
 * * @returns {Promise<Array>} Lista de inscrições ativas.
 */
export const getEnrolledStudents = async () => {
  try {
    // A rota /agendamentos retorna dados contextuais baseados no token do profissional
    const response = await api.get('/agendamentos');
    const lista = response.data.data || [];

    const inscritosFormatados = lista.map(item => {
      const rawDate = item.data_agendada ? item.data_agendada.split('T')[0] : '';
      const rawTime = item.horario_agendado ? item.horario_agendado.slice(0, 5) : '';

      return {
        id: item.id_agendamento,
        date: rawDate,
        time: rawTime,
        activity: item.nome_atividade || item.atividade?.nome_atividade || "Atividade",
        student: item.nome_cliente || item.cliente?.nome || "Aluno",
        status: item.status
      };
    });

    // Filtra para remover cancelamentos da lista de chamada
    return inscritosFormatados.filter(item => item.status !== 'Cancelado');

  } catch (error) {
    console.error("Erro ao buscar inscritos:", error);
    return [];
  }
};

/**
 * Atualiza os dados de uma atividade existente.
 * * @param {Object} updatedActivity - Objeto com os dados atualizados.
 * @returns {Promise<Object>} A atividade atualizada.
 * @throws {string} Mensagem de erro.
 */
export const updateOfferedActivity = async (updatedActivity) => {
  try {
    const payload = {
      nome_atividade: updatedActivity.name,
      tipo_atividade: updatedActivity.type,
      descricao: updatedActivity.description,
      duracao: parseInt(updatedActivity.duration.toString().replace(/\D/g, '')),
      capacidade_max: parseInt(updatedActivity.capacity)
    };

    const response = await api.put(`/atividades/${updatedActivity.id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    throw error.response?.data?.message || "Erro ao atualizar.";
  }
};