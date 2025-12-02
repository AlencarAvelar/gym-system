import api from './api';

// ==========================================
// SEÇÃO 1: GERENCIAMENTO DE ATIVIDADES
// ==========================================

// GET: Buscar TODAS as atividades
export const getAllActivities = async () => {
  try {
    const response = await api.get('/atividades');
    
    // Tratamento para garantir que pegamos a lista (seja array direto ou dentro de .data)
    const listaAtividades = Array.isArray(response.data) ? response.data : response.data.data || [];

    // ADAPTADOR (Back -> Front)
    return listaAtividades.map(item => ({
      id: item.id_atividade,
      name: item.nome_atividade,
      type: item.tipo_atividade,
      description: item.descricao,
      duration: item.duracao ? `${item.duracao} min` : '0 min',
      capacity: item.capacidade_max,
      professional: item.nome_profissional || `Instrutor (ID: ${item.id_profissional})`,
      time: "A definir", 
      vacancies: `${item.capacidade_max}/${item.capacidade_max}`
    }));
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return [];
  }
};

// POST: Criar nova atividade
export const createActivityAdmin = async (newActivity) => {
  try {
    const payload = {
      nome_atividade: newActivity.name,
      tipo_atividade: newActivity.type,
      descricao: newActivity.description,
      duracao: parseInt(newActivity.duration),
      capacidade_max: parseInt(newActivity.capacity),
      
      // MUDANÇA: Usa o ID que você digitou no formulário
      id_profissional: parseInt(newActivity.professional) 
    };

    console.log("Payload Enviado para o Back:", payload);

    const response = await api.post('/atividades', payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    
    // TRATAMENTO DE ERRO DETALHADO
    // Tenta pegar a mensagem específica do back-end para mostrar no alert
    const serverMessage = error.response?.data?.message || "Erro desconhecido";
    const validationDetails = error.response?.data?.error || ""; // Alguns backs mandam 'error' com detalhes
    
    alert(`O Back-End recusou o cadastro:\nMotivo: ${serverMessage}\nDetalhe: ${validationDetails}`);
    
    throw error;
  }
};

// DELETE: Excluir atividade
export const deleteActivityAdmin = async (id) => {
  try {
    await api.delete(`/atividades/${id}`);
    return true;
  } catch (error) {
    console.error("Erro ao excluir:", error);
    throw error;
  }
};

// PUT: Editar atividade
export const updateActivityAdmin = async (updatedActivity) => {
  try {
    const payload = {
      nome_atividade: updatedActivity.name,
      tipo_atividade: updatedActivity.type,
      descricao: updatedActivity.description,
      duracao: parseInt(updatedActivity.duration.replace(' min', '')),
      capacidade_max: parseInt(updatedActivity.capacity)
    };
    
    const response = await api.put(`/atividades/${updatedActivity.id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    throw error;
  }
};

// ==========================================
// SEÇÃO 2: GERENCIAMENTO DE AGENDAMENTOS
// ==========================================

// GET: Buscar TODOS os agendamentos
export const getAllAppointments = async () => {
  try {
    const response = await api.get('/agendamentos');
    
    const listaAgendamentos = Array.isArray(response.data) ? response.data : response.data.data || [];

    return listaAgendamentos.map(item => {
      const rawDate = item.data_agendada ? item.data_agendada.split('T')[0] : '';
      
      return {
        id: item.id_agendamento,
        activity: item.atividade?.nome_atividade || "Atividade",
        type: item.atividade?.tipo_atividade || "Treino",
        client: item.usuario?.nome || "Aluno",
        professional: item.profissional?.nome || "Instrutor",
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

// ==========================================
// SEÇÃO 3: RELATÓRIOS
// ==========================================

export const generateReport = async (startDate, endDate) => {
  return new Promise((resolve) => resolve({ data: [], summary: { totalStudents: 0, totalActivities: 0 } }));
};