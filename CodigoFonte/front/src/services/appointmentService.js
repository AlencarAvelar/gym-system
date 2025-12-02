import api from './api';
import { getAvailableActivities } from './activityService'; // Importamos para pegar as vagas

// GET: Buscar MEUS agendamentos
export const getMyAppointments = async () => {
  try {
    // 1. Busca os agendamentos do usuário
    const responseAppointments = await api.get('/agendamentos');
    const listaAgendamentos = responseAppointments.data.data || [];

    // 2. Busca todas as atividades disponíveis (que contém a info de vagas atualizada)
    const atividadesDetalhadas = await getAvailableActivities();

    const dataAdapted = listaAgendamentos.map(item => {
      const rawDate = item.data_agendada ? item.data_agendada.split('T')[0] : '';
      const rawTime = item.horario_agendado ? item.horario_agendado.slice(0, 5) : '';

      // Tenta encontrar a atividade correspondente para pegar as vagas reais
      const atividadeInfo = atividadesDetalhadas.find(atv => atv.id === item.id_atividade);
      
      // Se achou, usa as vagas dela. Se não, usa um fallback.
      const vagasReais = atividadeInfo ? atividadeInfo.vacancies : "-";

      return {
        id: item.id_agendamento,
        // Garante que mostramos o nome, seja do join do agendamento ou da busca cruzada
        activity: item.nome_atividade || (atividadeInfo ? atividadeInfo.name : "Atividade"), 
        type: item.tipo_atividade || (atividadeInfo ? atividadeInfo.type : "Treino"), 
        professional: item.nome_profissional || "Instrutor",
        date: rawDate, 
        time: rawTime,
        vacancies: vagasReais, // <--- AQUI ESTÁ A CORREÇÃO VISUAL
        status: item.status 
      };
    });

    // Filtra para não mostrar os cancelados na lista principal
    return dataAdapted.filter(item => item.status !== 'Cancelado');

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
    const msg = error.response?.data?.message || "Erro ao cancelar.";
    alert(msg); 
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
    const msg = error.response?.data?.message || "Erro ao remarcar.";
    alert(msg);
    throw error;
  }
};