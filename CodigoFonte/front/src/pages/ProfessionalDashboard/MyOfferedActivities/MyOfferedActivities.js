import React, { useState } from 'react';
import Modal from '../../../components/Modal/Modal'; // Reutilizando nosso Modal!
import './MyOfferedActivities.css';

function MyOfferedActivities() {
  // --- MOCK DATA (Atividades criadas por ESTE professor) ---
  const [myActivities, setMyActivities] = useState([
    { id: 1, name: "Treino Funcional A", type: "Aula", time: "08:00", vacancies: "12/15" },
    { id: 2, name: "Avaliação Física", type: "Treino", time: "10:00 - 12:00", vacancies: "Livre" },
    { id: 3, name: "Crossfit Iniciante", type: "Aula", time: "18:30", vacancies: "20/20" }
  ]);

  // Estados para filtros e modais
  const [filterType, setFilterType] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Lógica de Filtragem
  const filteredActivities = myActivities.filter(activity => {
    const matchesType = filterType === 'Todos' || activity.type === filterType;
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // --- AÇÕES ---
  const handleDelete = (activity) => {
    setSelectedActivity(activity);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setMyActivities(myActivities.filter(a => a.id !== selectedActivity.id));
    setDeleteModalOpen(false);
    alert("Atividade excluída com sucesso!");
  };

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setEditModalOpen(true);
  };

  return (
    <div className="offered-activities-container">
      <div className="page-header">
        <h1>Minhas Atividades Ofertadas</h1>
        
        {/* Filtros (Seguindo o padrão que já criamos) */}
        <div className="filters-wrapper">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Buscar pelo nome..." 
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
          <div key={item.id} className="activity-card pro-card">
            <div className="card-header">
              <span className={`tag ${item.type.toLowerCase()}`}>{item.type}</span>
              <span className="vacancies-info">Vagas: {item.vacancies}</span>
            </div>

            <div className="card-body">
              <h3>{item.name}</h3>
              <div className="time-badge">🕒 {item.time}</div>
            </div>

            <div className="card-actions">
              <button className="btn-edit" onClick={() => handleEdit(item)}>Editar atividade</button>
              <button className="btn-cancel" onClick={() => handleDelete(item)}>Excluir atividade</button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DE EXCLUSÃO --- */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        title="Excluir Atividade"
      >
        <p>Tem certeza que deseja excluir a atividade <strong>{selectedActivity?.name}</strong>?</p>
        <div className="modal-actions">
          <button className="btn-cancel-modal" onClick={() => setDeleteModalOpen(false)}>Cancelar</button>
          <button className="btn-danger" onClick={confirmDelete}>Confirmar</button>
        </div>
      </Modal>

      {/* --- MODAL DE EDIÇÃO (Simples) --- */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setEditModalOpen(false)}
        title="Editar Atividade"
      >
        <div className="modal-form-group">
          <label>Nome da Atividade:</label>
          <input type="text" defaultValue={selectedActivity?.name} />
        </div>
        <div className="modal-form-group">
          <label>Horário:</label>
          <input type="text" defaultValue={selectedActivity?.time} />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel-modal" onClick={() => setEditModalOpen(false)}>Cancelar</button>
          <button className="btn-confirm" onClick={() => {alert('Editado!'); setEditModalOpen(false);}}>Salvar</button>
        </div>
      </Modal>

    </div>
  );
}

export default MyOfferedActivities;