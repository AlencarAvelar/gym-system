import React, { useState } from 'react';
import Modal from '../../../components/Modal/Modal'; // <-- Importe o Modal
import './AvailableActivities.css';

function AvailableActivities() {
  // --- MOCK DATA ---
  const allActivities = [
    { id: 101, name: "Musculação Livre", type: "Treino", professional: "João Paulo", time: "08:00 - 22:00", vacancies: "Ilimitado" },
    { id: 102, name: "Pilates Solo", type: "Aula", professional: "Maria Clara", time: "09:00", vacancies: "3/10" },
    { id: 103, name: "Boxe Funcional", type: "Aula", professional: "Pedro Rocha", time: "19:00", vacancies: "12/20" },
    { id: 104, name: "Avaliação Física", type: "Treino", professional: "Dra. Fernanda", time: "Agendável", vacancies: "Livre" },
    { id: 105, name: "Spinning Intenso", type: "Aula", professional: "Roberto Lima", time: "18:30", vacancies: "0/15" },
    { id: 106, name: "Yoga Relax", type: "Aula", professional: "Maria Clara", time: "07:00", vacancies: "5/10" }
  ];

  // Estados
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // --- ESTADOS DO MODAL ---
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [date, setDate] = useState(''); // Para guardar a data escolhida
  const [time, setTime] = useState('');

  // Lógica de Filtragem
  const filteredActivities = allActivities.filter(activity => {
    const matchesType = filter === 'Todos' || activity.type === filter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      activity.name.toLowerCase().includes(searchLower) ||
      activity.professional.toLowerCase().includes(searchLower) ||
      activity.time.toLowerCase().includes(searchLower);
    return matchesType && matchesSearch;
  });

  // --- AÇÕES ---
  const handleOpenSchedule = (activity) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  const handleConfirmSchedule = (e) => {
    e.preventDefault();
    // Agora incluímos o horário na confirmação
    alert(`Agendamento confirmado para ${selectedActivity.name} no dia ${date} às ${time}!`);
    setModalOpen(false);
    setSelectedActivity(null);
    setDate('');
    setTime(''); // Limpa o horário também
  };

  return (
    <div className="activities-container">
      <div className="page-header">
        <h1>Atividades Disponíveis</h1>

        <div className="filters-wrapper">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar profissional, atividade ou horário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-controls">
            <button className={filter === 'Todos' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('Todos')}>Todos</button>
            <button className={filter === 'Aula' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('Aula')}>Aulas</button>
            <button className={filter === 'Treino' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('Treino')}>Treinos</button>
          </div>
        </div>
      </div>

      <div className="activities-grid">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((item) => (
            <div key={item.id} className="activity-card">
              <div className="card-header">
                <span className={`tag ${item.type.toLowerCase()}`}>{item.type}</span>
                <span className="vacancies-info">Vagas: {item.vacancies}</span>
              </div>

              <div className="card-body">
                <h3>{item.name}</h3>
                <p className="professional">Profissional: {item.professional}</p>
                <div className="time-badge">🕒 {item.time}</div>
              </div>

              <div className="card-actions">
                <button
                  className="btn-schedule"
                  disabled={item.vacancies.startsWith("0/")}
                  onClick={() => handleOpenSchedule(item)} // Abre o Modal
                >
                  {item.vacancies.startsWith("0/") ? "Lotado" : "Agendar"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">Nenhuma atividade encontrada com esses filtros.</p>
        )}
      </div>

      {/* --- MODAL DE AGENDAMENTO --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirmar Agendamento"
      >
        <form onSubmit={handleConfirmSchedule}>
          <p>Você está agendando: <strong>{selectedActivity?.name}</strong></p>
          <p className="modal-subtitle">Com {selectedActivity?.professional} às {selectedActivity?.time}</p>

          <div className="modal-form-group">
            <label>Escolha a Data:</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* --- NOVO CAMPO DE HORÁRIO --- */}
          <div className="modal-form-group">
            <label>Escolha o Horário:</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel-modal" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-confirm">Confirmar</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

export default AvailableActivities;