import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal';
import { getMyOfferedActivities, deleteOfferedActivity, updateOfferedActivity } from '../../../services/professionalService'; // Importa o serviço
import './MyOfferedActivities.css';

function MyOfferedActivities() {
  const [myActivities, setMyActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- CARREGAR DADOS ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getMyOfferedActivities();
      setMyActivities(data);
    } catch (error) {
      console.error("Erro ao carregar atividades", error);
    } finally {
      setLoading(false);
    }
  };

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
  
  // 1. Excluir
  const handleDelete = (activity) => {
    setSelectedActivity(activity);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    // Chama o serviço
    await deleteOfferedActivity(selectedActivity.id);
    
    // Atualiza lista local
    setMyActivities(myActivities.filter(a => a.id !== selectedActivity.id));
    
    setDeleteModalOpen(false);
    alert("Atividade excluída com sucesso!");
  };

  // 2. Editar
  const handleEdit = (activity) => {
    setSelectedActivity({ ...activity }); // Cópia
    setEditModalOpen(true);
  };

  const confirmEdit = async () => {
    // Chama o serviço
    await updateOfferedActivity(selectedActivity);

    // Atualiza lista local
    setMyActivities(myActivities.map(a => 
      a.id === selectedActivity.id ? selectedActivity : a
    ));

    setEditModalOpen(false);
    alert("Atividade editada com sucesso!");
  };

  // Handler genérico para inputs do modal de edição
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedActivity(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="offered-activities-container"><p>Carregando suas aulas...</p></div>;
  }

  return (
    <div className="offered-activities-container">
      <div className="page-header">
        <h1>Minhas Atividades Ofertadas</h1>
        
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

      {/* --- MODAL DE EDIÇÃO --- */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setEditModalOpen(false)}
        title="Editar Atividade"
      >
        <div className="modal-form-group">
          <label>Nome da Atividade:</label>
          <input type="text" name="name" defaultValue={selectedActivity?.name} onChange={handleChange} />
        </div>
        <div className="modal-form-group">
          <label>Horário:</label>
          <input type="text" name="time" defaultValue={selectedActivity?.time} onChange={handleChange} />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel-modal" onClick={() => setEditModalOpen(false)}>Cancelar</button>
          <button className="btn-confirm" onClick={confirmEdit}>Salvar</button>
        </div>
      </Modal>

    </div>
  );
}

export default MyOfferedActivities;