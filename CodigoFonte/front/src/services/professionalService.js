import api from './api';
import { authService } from './authService';

// GET: Buscar atividades que EU ministro
export const getMyOfferedActivities = async () => {
  try {
    const user = authService.getCurrentUser();
    if (!user || !user.id_usuario) {
      throw new Error("Usuário não identificado");
    }

    const response = await api.get(`/atividades/profissional/${user.id_usuario}`);

    const lista = response.data.data || [];

    return lista.map(item => {
      // --- CORREÇÃO DA MATEMÁTICA DE VAGAS ---
      const total = parseInt(item.capacidade_max || 0);

      // O endpoint do profissional retorna 'agendamentos_ativos'
      const ocupadas = item.agendamentos_ativos ? parseInt(item.agendamentos_ativos) : 0;

      return {
        id: item.id_atividade,
        name: item.nome_atividade,
        type: item.tipo_atividade,
        description: item.descricao,
        // Garante que mostramos a duração formatada
        duration: item.duracao ? `${item.duracao} min` : '0 min',
        capacity: total,

        // Exibe o horário real se tiver (para professor, geralmente não tem horário fixo na atividade base, igual ao admin)
        time: item.duracao ? `${item.duracao} min` : "A definir",

        // Formato: "Ocupadas / Total" (Ex: 0/20)
        vacancies: `${ocupadas}/${total}`
      };
    });
  } catch (error) {
    console.error("Erro ao buscar minhas atividades:", error);
    return [];
  }
};

// POST: Criar atividade (Professor)
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

// DELETE: Excluir uma atividade minha
export const deleteOfferedActivity = async (id) => {
  try {
    await api.delete(`/atividades/${id}`);
    return true;
  } catch (error) {
    console.error("Erro ao excluir atividade:", error);
    const msg = error.response?.data?.message || "Erro ao excluir.";
    throw msg;
  }
};

// GET: Buscar lista de alunos inscritos
export const getEnrolledStudents = async () => {
  try {
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

    // --- FILTRO: Remove os cancelados da lista de chamada ---
    return inscritosFormatados.filter(item => item.status !== 'Cancelado');

  } catch (error) {
    console.error("Erro ao buscar inscritos:", error);
    return [];
  }
};

// PUT: Editar atividade
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
    const msg = error.response?.data?.message || "Erro ao atualizar.";
    throw msg;
  }
};