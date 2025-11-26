// src/services/activityService.js

// --- MOCK DATA ---
const MOCK_ACTIVITIES = [
  {
    id: 101,
    name: "Musculação Livre",
    type: "Treino",
    professional: "João Paulo",
    time: "08:00 - 22:00",
    vacancies: "Ilimitado"
  },
  {
    id: 102,
    name: "Pilates Solo",
    type: "Aula",
    professional: "Maria Clara",
    time: "09:00",
    vacancies: "3/10"
  },
  {
    id: 103,
    name: "Boxe Funcional",
    type: "Aula",
    professional: "Pedro Rocha",
    time: "19:00",
    vacancies: "12/20"
  },
  {
    id: 104,
    name: "Avaliação Física",
    type: "Treino",
    professional: "Dra. Fernanda",
    time: "Agendável",
    vacancies: "Livre"
  },
  {
    id: 105,
    name: "Spinning Intenso",
    type: "Aula",
    professional: "Roberto Lima",
    time: "18:30",
    vacancies: "0/15"
  },
  {
    id: 106,
    name: "Yoga Relax",
    type: "Aula",
    professional: "Maria Clara",
    time: "07:00",
    vacancies: "5/10"
  }
];

// GET: Buscar atividades disponíveis
export const getAvailableActivities = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_ACTIVITIES]);
    }, 300);
  });
};

// POST: Criar um agendamento (Simulação)
export const createSchedule = async (activityId, date, time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[API] Agendamento criado: Atividade ${activityId} em ${date} às ${time}`);
      resolve({ success: true });
    }, 500);
  });
};