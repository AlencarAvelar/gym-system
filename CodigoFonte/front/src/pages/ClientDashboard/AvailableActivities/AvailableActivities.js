import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal';
import { getAvailableActivities, createSchedule } from '../../../services/activityService'; // Importa o serviço
import './AvailableActivities.css';

function AvailableActivities() {
  const [activities, setActivities] = useState([]); // Dados carregados
  const [loading, setLoading] = useState(true);

  // --- CARREGAR DADOS (GET) ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAvailableActivities();
        setActivities(data);
      } catch (error) {
        console.error("Erro ao buscar atividades", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Estados de Filtro
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- ESTADOS DO MODAL ---
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [date, setDate] = useState(''); 
  const [time, setTime] = useState(''); 

  // Lógica de Filtragem
  const filteredActivities = activities.filter(activity => {
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

  const handleConfirmSchedule = async (e) => {
    e.preventDefault();
    
    // Chama o serviço para criar o agendamento (Simulação de POST)
    await createSchedule(selectedActivity.id, date, time);

    alert(`Agendamento confirmado para ${selectedActivity.name} no dia ${date} às ${time}!`);
    
    setModalOpen(false);
    setSelectedActivity(null);
    setDate('');
    setTime('');
  };

  if (loading) {
    return <div className="activities-container"><p>Carregando atividades...</p></div>;
  }

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
                  onClick={() => handleOpenSchedule(item)} 
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