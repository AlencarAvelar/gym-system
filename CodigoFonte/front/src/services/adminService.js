import api from './api';

// ==========================================
// SEÇÃO 1: GERENCIAMENTO DE ATIVIDADES
// ==========================================

// GET: Buscar TODAS as atividades
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

        // Mantemos 'duration' para o formulário de edição funcionar
        duration: item.duracao ? `${item.duracao} min` : '0 min',

        capacity: total,
        professional: item.nome_profissional || `Instrutor (ID: ${item.id_profissional})`,

        // --- CORREÇÃO DO BUG VISUAL ---
        // Antes estava fixo "A definir". Agora mostra a duração (ex: "60 min").
        time: item.duracao ? `${item.duracao} min` : "A definir",

        vacancies: `${ocupadas}/${total}`
      };
    });
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
      // Usa o ID digitado ou fallback para 1
      id_profissional: newActivity.professional ? parseInt(newActivity.professional) : 1
    };

    const response = await api.post('/atividades', payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    const serverMessage = error.response?.data?.message || "Erro desconhecido";
    // Tenta ler erros de validação array
    const errors = error.response?.data?.errors ? "\n" + error.response.data.errors.join("\n") : "";
    alert(`Erro ao Criar: ${serverMessage}${errors}`);
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
    const serverMessage = error.response?.data?.message || "Erro de permissão.";
    alert(`Erro ao Excluir: ${serverMessage}`);
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
      // Limpa string "min" e garante int
      duracao: parseInt(updatedActivity.duration.toString().replace(/\D/g, '')),
      capacidade_max: parseInt(updatedActivity.capacity),

      // AGORA MANDAMOS O ID ATUALIZADO
      id_profissional: parseInt(updatedActivity.professionalId)
    };

    console.log("Enviando Update:", payload); // Debug

    const response = await api.put(`/atividades/${updatedActivity.id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    const serverMessage = error.response?.data?.message || "Erro de validação";
    alert(`Erro ao Editar: ${serverMessage}`);
    throw error;
  }
};

// ==========================================
// SEÇÃO 2: GERENCIAMENTO DE AGENDAMENTOS
// ==========================================

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

// ==========================================
// SEÇÃO 3: RELATÓRIOS
// ==========================================

// RELATÓRIOS (Calculado no Front-End com dados reais)
export const generateReport = async (startDate, endDate) => {
  try {
    // 1. Busca TODOS os agendamentos do sistema
    const allAppointments = await getAllAppointments();

    // 2. Filtra pelo período selecionado
    // Convertemos as datas para objetos Date para comparar corretamente
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ajuste: definir hora para garantir comparação inclusiva
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const filtered = allAppointments.filter(item => {
      const itemDate = new Date(item.date);
      // Filtra apenas os que não foram cancelados e estão na data
      return item.status !== 'Cancelado' && itemDate >= start && itemDate <= end;
    });

    // 3. Agrupa por Atividade para mostrar na tabela (Opcional, ou mostra lista plana)
    // Aqui vamos retornar a lista filtrada para exibir na tabela detalhada

    // Calcula totais
    const totalStudents = filtered.length; // Cada agendamento é um aluno inscrito

    // Conta quantas atividades únicas tiveram aula nesse período
    const uniqueActivities = new Set(filtered.map(item => item.activity)).size;

    // Formata para o padrão que a tela espera
    // A tela espera: { date, activity, type, total (inscritos na sessão) }
    // Como nossa lista é por ALUNO, precisamos agrupar.

    const groupedMap = {};

    filtered.forEach(item => {
      const key = `${item.date}-${item.activity}-${item.time}`; // Chave única por sessão
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