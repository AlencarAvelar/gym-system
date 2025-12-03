import api from './api';

/**
 * Módulo de serviços administrativos.
 * Centraliza as operações de gerenciamento de atividades, agendamentos e relatórios
 * exclusivas do perfil Administrador.
 */

// ============================================================================
// GERENCIAMENTO DE ATIVIDADES
// ============================================================================

/**
 * Recupera a lista completa de atividades cadastradas no sistema.
 * Realiza a normalização dos dados vindos do backend para o formato esperado pelo frontend.
 * @returns {Promise<Array>} Lista de atividades formatada.
 */
export const getAllActivities = async () => {
  try {
    const response = await api.get('/atividades');

    const listaAtividades = Array.isArray(response.data) ? response.data : response.data.data || [];

    return listaAtividades.map(item => {
      const total = item.capacidade_max || 0;
      const disponiveis = item.vagas_disponiveis !== undefined ? item.vagas_disponiveis : total;
      const ocupadas = total - disponiveis;

      return {
        id: item.id_atividade,
        name: item.nome_atividade,
        type: item.tipo_atividade,
        description: item.descricao,
        duration: item.duracao ? `${item.duracao} min` : '0 min',
        capacity: total,

        // Mantém o ID original para operações de update
        professionalId: item.id_profissional || 3,
        professional: item.nome_profissional || `Instrutor (ID: ${item.id_profissional})`,

        // --- CORREÇÃO: Exibe a duração no lugar do horário fixo ---
        time: item.duracao ? `${item.duracao} min` : "A definir",

        vacancies: `${ocupadas}/${total}`
      };
    });
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return [];
  }
};

/**
 * Cadastra uma nova atividade no sistema.
 * @param {Object} newActivity - Objeto contendo os dados do formulário.
 * @returns {Promise<Object>} A atividade criada.
 */
export const createActivityAdmin = async (newActivity) => {
  try {
    const payload = {
      nome_atividade: newActivity.name,
      tipo_atividade: newActivity.type,
      descricao: newActivity.description,
      duracao: parseInt(newActivity.duration),
      capacidade_max: parseInt(newActivity.capacity),
      // Fallback para ID 1 caso não seja fornecido
      id_profissional: newActivity.professional ? parseInt(newActivity.professional) : 1
    };

    const response = await api.post('/atividades', payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar atividade:", error);

    const serverMessage = error.response?.data?.message || "Erro desconhecido";
    const errors = error.response?.data?.errors ? "\n" + error.response.data.errors.join("\n") : "";

    alert(`Erro ao Criar: ${serverMessage}${errors}`);
    throw error;
  }
};

/**
 * Remove uma atividade do sistema pelo ID.
 * @param {number|string} id - O identificador da atividade.
 * @returns {Promise<boolean>} Retorna true em caso de sucesso.
 */
export const deleteActivityAdmin = async (id) => {
  try {
    await api.delete(`/atividades/${id}`);
    return true;
  } catch (error) {
    console.error("Erro ao excluir:", error);

    const serverMessage = error.response?.data?.message || "Erro de permissão ou conexão.";
    alert(`Erro ao Excluir: ${serverMessage}`);
    throw error;
  }
};

/**
 * Atualiza os dados de uma atividade existente.
 * @param {Object} updatedActivity - Objeto com os dados atualizados.
 * @returns {Promise<Object>} A atividade atualizada.
 */
export const updateActivityAdmin = async (updatedActivity) => {
  try {
    const payload = {
      nome_atividade: updatedActivity.name,
      tipo_atividade: updatedActivity.type,
      descricao: updatedActivity.description,
      duracao: parseInt(updatedActivity.duration.toString().replace(/\D/g, '')),
      capacidade_max: parseInt(updatedActivity.capacity),
      id_profissional: updatedActivity.professionalId
    };

    const response = await api.put(`/atividades/${updatedActivity.id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar:", error);

    const serverMessage = error.response?.data?.message || "Erro de validação";
    const errors = error.response?.data?.errors ? "\n" + error.response.data.errors.join("\n") : "";

    alert(`Erro ao Editar: ${serverMessage}${errors}`);
    throw error;
  }
};

// ============================================================================
// GERENCIAMENTO DE AGENDAMENTOS
// ============================================================================

/**
 * Recupera a lista global de agendamentos do sistema.
 * @returns {Promise<Array>} Lista de todos os agendamentos formatada.
 */
export const getAllAppointments = async () => {
  try {
    const response = await api.get('/agendamentos');
    const listaAgendamentos = Array.isArray(response.data) ? response.data : response.data.data || [];

    return listaAgendamentos.map(item => {
      const rawDate = item.data_agendada ? item.data_agendada.split('T')[0] : '';

      return {
        id: item.id_agendamento,
        activity: item.nome_atividade || item.atividade?.nome_atividade || "Atividade",
        type: item.tipo_atividade || item.atividade?.tipo_atividade || "Treino",
        client: item.nome_cliente || item.usuario?.nome || "Aluno",
        professional: item.nome_profissional || item.profissional?.nome || "Instrutor",
        date: rawDate,
        time: item.horario_agendado?.slice(0, 5),
        status: item.status || "Ativo"
      };
    });
  } catch (error) {
    console.error("Erro ao buscar todos agendamentos:", error);
    return [];
  }
};

// ============================================================================
// RELATÓRIOS
// ============================================================================

/**
 * Processa os dados de agendamentos para gerar um relatório estatístico local.
 * @param {string} startDate - Data de início do filtro.
 * @param {string} endDate - Data de fim do filtro.
 * @returns {Promise<Object>} Objeto contendo a lista filtrada e o sumário estatístico.
 */
export const generateReport = async (startDate, endDate) => {
  try {
    // Busca dados reais para processamento local
    const allAppointments = await getAllAppointments();

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const filtered = allAppointments.filter(item => {
      const itemDate = new Date(item.date);
      return item.status !== 'Cancelado' && itemDate >= start && itemDate <= end;
    });

    const totalStudents = filtered.length;
    const uniqueActivities = new Set(filtered.map(item => item.activity)).size;

    const groupedMap = {};

    filtered.forEach(item => {
      const key = `${item.date}-${item.activity}-${item.time}`;
      if (!groupedMap[key]) {
        groupedMap[key] = {
          id: Math.random(),
          date: item.date,
          activity: item.activity,
          type: item.type,
          total: 0
        };
      }
      groupedMap[key].total += 1;
    });

    const reportItems = Object.values(groupedMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      data: reportItems,
      summary: { totalStudents, totalActivities: uniqueActivities }
    };

  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return { data: [], summary: { totalStudents: 0, totalActivities: 0 } };
  }
};