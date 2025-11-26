// src/services/adminService.js

// --- MOCK DATA (Todas as atividades da academia) ---
let MOCK_ALL_ACTIVITIES = [
  { id: 1, name: "Musculação Livre", type: "Treino", description: "Treino livre com acompanhamento", duration: "60 min", capacity: "Ilimitado", professional: "João Paulo", time: "08:00 - 22:00", vacancies: "Ilimitado" },
  { id: 2, name: "Pilates Solo", type: "Aula", description: "Aula de pilates focada em core", duration: "50 min", capacity: "10", professional: "Maria Clara", time: "09:00", vacancies: "3/10" },
  { id: 3, name: "Crossfit", type: "Aula", description: "Treino de alta intensidade", duration: "60 min", capacity: "20", professional: "Roberto Lima", time: "18:30", vacancies: "20/20" },
  { id: 4, name: "Zumba", type: "Aula", description: "Dança aeróbica", duration: "45 min", capacity: "20", professional: "Ana Souza", time: "19:00", vacancies: "15/20" }
];

// GET: Buscar todas as atividades
export const getAllActivities = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_ALL_ACTIVITIES]);
    }, 300);
  });
};

// DELETE: Excluir atividade (Admin tem poder total)
export const deleteActivityAdmin = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      MOCK_ALL_ACTIVITIES = MOCK_ALL_ACTIVITIES.filter(a => a.id !== id);
      resolve(true);
    }, 300);
  });
};

// PUT: Editar atividade
export const updateActivityAdmin = async (updatedActivity) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      MOCK_ALL_ACTIVITIES = MOCK_ALL_ACTIVITIES.map(a => 
        a.id === updatedActivity.id ? updatedActivity : a
      );
      resolve(updatedActivity);
    }, 300);
  });
};

// POST: Criar nova atividade (Admin define o profissional)
export const createActivityAdmin = async (newActivity) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const created = { 
        ...newActivity, 
        id: Math.floor(Math.random() * 10000), // ID aleatório
        vacancies: `${newActivity.capacity}/${newActivity.capacity}`, // Inicializa vagas
        time: "A definir" // Valor padrão já que removemos o input de horário
      };
      MOCK_ALL_ACTIVITIES.push(created);
      resolve(created);
    }, 300);
  });
};

// ... (Código anterior das Atividades) ...

// --- MOCK DATA (Todos os agendamentos do sistema) ---
const MOCK_ALL_APPOINTMENTS = [
  { id: 1, date: "2025-11-20", time: "08:00", activity: "Musculação", client: "Ana Beatriz", professional: "João Paulo", status: "Confirmado" },
  { id: 2, date: "2025-11-20", time: "09:00", activity: "Pilates Solo", client: "Carlos Eduardo", professional: "Maria Clara", status: "Confirmado" },
  { id: 3, date: "2025-11-20", time: "14:00", activity: "Avaliação Física", client: "Roberto Justus", professional: "Dra. Fernanda", status: "Pendente" },
  { id: 4, date: "2025-11-21", time: "18:30", activity: "Crossfit", client: "Julia Roberts", professional: "Roberto Lima", status: "Cancelado" },
  { id: 5, date: "2025-11-22", time: "10:00", activity: "Yoga", client: "Michael Scott", professional: "Maria Clara", status: "Confirmado" },
];

// GET: Buscar todos os agendamentos
export const getAllAppointments = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_ALL_APPOINTMENTS]);
    }, 300);
  });
};

// ... (Código anterior de Atividades e Agendamentos) ...

// --- MOCK DATA (Dados brutos para Relatórios) ---
const MOCK_REPORT_DATA = [
  { id: 1, date: "2025-11-20", activity: "Musculação", total: 15, type: "Treino" },
  { id: 2, date: "2025-11-20", activity: "Pilates Solo", total: 8, type: "Aula" },
  { id: 3, date: "2025-11-21", activity: "Crossfit", total: 20, type: "Aula" },
  { id: 4, date: "2025-11-22", activity: "Yoga", total: 10, type: "Aula" },
  { id: 5, date: "2025-11-23", activity: "Musculação", total: 12, type: "Treino" },
  { id: 6, date: "2025-11-24", activity: "Boxe", total: 5, type: "Aula" },
];

// POST/GET: Gerar Relatório (Simula o processamento no servidor)
export const generateReport = async (startDate, endDate) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filtra por data
      const filtered = MOCK_REPORT_DATA.filter(item => item.date >= startDate && item.date <= endDate);

      // Calcula totais (O back-end faria isso)
      const totalStudents = filtered.reduce((acc, curr) => acc + curr.total, 0);
      const totalActivities = filtered.length;

      // Retorna o objeto pronto
      resolve({
        data: filtered,
        summary: { totalStudents, totalActivities }
      });
    }, 500); // Simula delay de cálculo
  });
};