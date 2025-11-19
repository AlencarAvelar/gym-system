import React from 'react';
import './MyAppointments.css';

function MyAppointments() {
  // --- DADOS FICTÍCIOS (MOCK) ---
  const appointments = [
    {
      id: 1,
      activity: "Musculação",
      type: "Treino",
      professional: "Carlos Silva",
      date: "20/11/2025",
      time: "14:00",
      vacancies: "15/30"
    },
    {
      id: 2,
      activity: "Yoga Matinal",
      type: "Aula",
      professional: "Ana Souza",
      date: "21/11/2025",
      time: "08:00",
      vacancies: "8/10"
    },
    {
      id: 3,
      activity: "Crossfit",
      type: "Aula",
      professional: "Roberto Lima",
      date: "22/11/2025",
      time: "18:30",
      vacancies: "20/20"
    }
  ];

  return (
    <div className="appointments-container">
      <div className="page-header">
        <h1>Meus Agendamentos</h1>
        {/* REMOVIDO: O botão de + Novo Agendamento não deve existir aqui */}
      </div>

      <div className="appointments-grid">
        {appointments.map((item) => (
          <div key={item.id} className="appointment-card">
            
            <div className="card-header">
              <span className={`tag ${item.type.toLowerCase()}`}>{item.type}</span>
              <span className="vacancies-info">Vagas: {item.vacancies}</span>
            </div>

            <div className="card-body">
              <h3>{item.activity}</h3>
              <p className="professional">Profissional: {item.professional}</p>
              
              <div className="datetime-info">
                <div className="info-item">
                  <strong>Data:</strong> {item.date}
                </div>
                <div className="info-item">
                  <strong>Horário:</strong> {item.time}
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-edit">Editar</button>
              <button className="btn-cancel">Excluir</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointments;