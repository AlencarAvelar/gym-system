import React, { useState } from 'react';
import './AvailableActivities.css';

function AvailableActivities() {
  // --- MOCK DATA ---
  const allActivities = [
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

  // Estados dos Filtros
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState(''); // Novo: Busca por texto

  // Lógica de Filtragem Combinada
  const filteredActivities = allActivities.filter(activity => {
    // 1. Verifica o Tipo
    const matchesType = typeFilter === 'Todos' || activity.type === typeFilter;
    
    // 2. Verifica a Busca (Nome da Atividade OU Nome do Profissional OU Horário)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      activity.name.toLowerCase().includes(searchLower) || 
      activity.professional.toLowerCase().includes(searchLower) ||
      activity.time.toLowerCase().includes(searchLower);

    // Retorna verdadeiro apenas se passar nos DOIS testes
    return matchesType && matchesSearch;
  });

  return (
    <div className="activities-container">
      <div className="page-header">
        <h1>Atividades Disponíveis</h1>
        
        <div className="filters-wrapper">
          {/* Filtro de Texto (Busca) */}
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Buscar profissional, atividade ou horário..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* Filtro de Tipo (Botões) */}
          <div className="filter-controls">
            <button 
              className={typeFilter === 'Todos' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setTypeFilter('Todos')}
            >
              Todos
            </button>
            <button 
              className={typeFilter === 'Aula' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setTypeFilter('Aula')}
            >
              Aulas
            </button>
            <button 
              className={typeFilter === 'Treino' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setTypeFilter('Treino')}
            >
              Treinos
            </button>
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
                <div className="time-badge">
                  🕒 {item.time}
                </div>
              </div>

              <div className="card-actions">
                <button 
                  className="btn-schedule" 
                  disabled={item.vacancies.startsWith("0/")}
                >
                  {item.vacancies.startsWith("0/") ? "Lotado" : "Agendar"}
                </button>
              </div>
            </div>
          ))
        ) : (
          // Feedback visual se não achar nada
          <p className="no-results">Nenhuma atividade encontrada com esses filtros.</p>
        )}
      </div>
    </div>
  );
}

export default AvailableActivities;