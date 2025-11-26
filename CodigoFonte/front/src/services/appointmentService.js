// src/services/appointmentService.js

// --- DADOS MOCKADOS (Aqui simulam o Banco de Dados) ---
let MOCK_APPOINTMENTS = [
  { id: 1, activity: "Musculação", type: "Treino", professional: "Carlos Silva", date: "20/11/2025", time: "14:00", vacancies: "15/30" },
  { id: 2, activity: "Yoga Matinal", type: "Aula", professional: "Ana Souza", date: "21/11/2025", time: "08:00", vacancies: "8/10" },
  { id: 3, activity: "Crossfit", type: "Aula", professional: "Roberto Lima", date: "22/11/2025", time: "18:30", vacancies: "20/20" }
];

// Função para BUSCAR dados (GET)
export const getMyAppointments = async () => {
  // Simulamos um delay de rede de 300ms
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_APPOINTMENTS]); // Retorna uma cópia
    }, 300);
  });
};

// Função para DELETAR dados (DELETE)
export const deleteAppointment = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      MOCK_APPOINTMENTS = MOCK_APPOINTMENTS.filter(a => a.id !== id);
      resolve(true); // Retorna sucesso
    }, 300);
  });
};

// Função para ATUALIZAR dados (PUT)
export const updateAppointment = async (updatedAppointment) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      MOCK_APPOINTMENTS = MOCK_APPOINTMENTS.map(a => 
        a.id === updatedAppointment.id ? updatedAppointment : a
      );
      resolve(updatedAppointment);
    }, 300);
  });
};