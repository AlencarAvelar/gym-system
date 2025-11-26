// src/services/professionalService.js

// --- MOCK DATA (Aulas deste professor específico) ---
let MOCK_MY_ACTIVITIES = [
  { id: 1, name: "Treino Funcional A", type: "Aula", time: "08:00", vacancies: "12/15" },
  { id: 2, name: "Avaliação Física", type: "Treino", time: "10:00 - 12:00", vacancies: "Livre" },
  { id: 3, name: "Crossfit Iniciante", type: "Aula", time: "18:30", vacancies: "20/20" }
];

// GET: Buscar minhas atividades
export const getMyOfferedActivities = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_MY_ACTIVITIES]);
    }, 300);
  });
};

// DELETE: Excluir uma atividade minha
export const deleteOfferedActivity = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      MOCK_MY_ACTIVITIES = MOCK_MY_ACTIVITIES.filter(a => a.id !== id);
      resolve(true);
    }, 300);
  });
};

// PUT: Editar uma atividade minha
export const updateOfferedActivity = async (updatedActivity) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      MOCK_MY_ACTIVITIES = MOCK_MY_ACTIVITIES.map(a => 
        a.id === updatedActivity.id ? updatedActivity : a
      );
      resolve(updatedActivity);
    }, 300);
  });
};

// ... (MOCK_MY_ACTIVITIES e outras funções acima) ...

// --- MOCK DATA (Alunos inscritos nas aulas deste professor) ---
const MOCK_ENROLLED = [
  { id: 1, date: "20/11/2025", time: "08:00", activity: "Musculação A", student: "Ana Beatriz Costa" },
  { id: 2, date: "20/11/2025", time: "08:00", activity: "Musculação A", student: "Carlos Eduardo" },
  { id: 3, date: "20/11/2025", time: "09:00", activity: "Pilates Solo", student: "Fernanda Lima" },
  { id: 4, date: "21/11/2025", time: "14:00", activity: "Avaliação Física", student: "Roberto Justus" },
  { id: 5, date: "21/11/2025", time: "18:30", activity: "Crossfit", student: "Julia Roberts" },
  { id: 6, date: "22/11/2025", time: "10:00", activity: "Yoga", student: "Michael Scott" },
];

// GET: Buscar lista de inscritos
export const getEnrolledStudents = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_ENROLLED]);
    }, 300);
  });
};