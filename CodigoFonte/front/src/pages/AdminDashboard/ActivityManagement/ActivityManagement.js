import React, { useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import './ActivityManagement.css';

function ActivityManagement() {
  // Mock Data: Lista de TODAS as atividades da academia
  const [activities, setActivities] = useState([
    { id: 1, name: "Musculação Livre", type: "Treino", professional: "João Paulo", time: "08:00 - 22:00", vacancies: "Ilimitado" },
    { id: 2, name: "Pilates Solo", type: "Aula", professional: "Maria Clara", time: "09:00", vacancies: "3/10" },
    { id: 3, name: "Crossfit", type: "Aula", professional: "Roberto Lima", time: "18:30", vacancies: "20/20" },
    { id: 4, name: "Zumba", type: "Aula", professional: "Ana Souza", time: "19:00", vacancies: "15/20" }
  ]);

  // Estados de Filtro
  const [filterType, setFilterType] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de Modal
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Lógica de Filtro (Pode buscar por Nome ou Profissional)
  const filteredActivities = activities.filter(item => {
    const matchesType = filterType === 'Todos' || item.type === filterType;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(searchLower) || 
      item.professional.toLowerCase().includes(searchLower);
    
    return matchesType && matchesSearch;
  });

  // Ações
  const handleDelete = (activity) => {
    setSelectedActivity(activity);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setActivities(activities.filter(a => a.id !== selectedActivity.id));
    setDeleteModalOpen(false);
    alert("Atividade excluída pelo Administrador.");
  };

  return (
    <div className="admin-activities-container">
      <div className="page-header">
        <h1>Gerenciamento de Atividades</h1>
        
        <div className="filters-wrapper">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Buscar por nome ou profissional..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-controls">
            <button className={filterType === 'Todos' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilterType('Todos')}>Todos</button>
            <button className={filterType === 'Aula' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilterType('Aula')}>Aulas</button>
            <button className={filterType === 'Treino' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilterType('Treino')}>Treinos</button>
          </div>
        </div>
      </div>

      <div className="activities-grid">
        {filteredActivities.map((item) => (
          <div key={item.id} className="activity-card admin-card">
            <div className="card-header">
              <span className={`tag ${item.type.toLowerCase()}`}>{item.type}</span>
              <span className="vacancies-info">Vagas: {item.vacancies}</span>
            </div>

            <div className="card-body">
              <h3>{item.name}</h3>
              {/* Destaque para o profissional, pois o Admin precisa saber quem é o dono */}
              <p className="professional-highlight">Responsável: <strong>{item.professional}</strong></p>
              <div className="time-badge">🕒 {item.time}</div>
            </div>

            <div className="card-actions">
              <button className="btn-edit" onClick={() => alert("Abrir modal de edição (igual ao do professor)")}>Editar</button>
              <button className="btn-cancel" onClick={() => handleDelete(item)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Exclusão */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        title="Excluir Atividade (Admin)"
      >
        <p>Você está prestes a excluir a atividade <strong>{selectedActivity?.name}</strong> do professor {selectedActivity?.professional}.</p>
        <p style={{color: 'red', fontSize: '0.9rem'}}>Esta ação não pode ser desfeita.</p>
        <div className="modal-actions">
          <button className="btn-cancel-modal" onClick={() => setDeleteModalOpen(false)}>Cancelar</button>
          <button className="btn-danger" onClick={confirmDelete}>Confirmar Exclusão</button>
        </div>
      </Modal>
    </div>
  );
}

export default ActivityManagement;