import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal';
import { getAllActivities, deleteActivityAdmin, updateActivityAdmin, createActivityAdmin } from '../../../services/adminService'; // Importa o serviço
import './ActivityManagement.css';

function ActivityManagement() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- CARREGAR DADOS ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getAllActivities();
      setActivities(data);
    } catch (error) {
      console.error("Erro ao carregar atividades", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtros
  const [filterType, setFilterType] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modais
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Lógica de Filtro
  const filteredActivities = activities.filter(item => {
    const matchesType = filterType === 'Todos' || item.type === filterType;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(searchLower) || 
      item.professional.toLowerCase().includes(searchLower);
    return matchesType && matchesSearch;
  });

  // --- AÇÕES ---

  // 1. Excluir
  const handleDelete = (activity) => {
    setSelectedActivity(activity);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    await deleteActivityAdmin(selectedActivity.id);
    
    setActivities(activities.filter(a => a.id !== selectedActivity.id));
    setDeleteModalOpen(false);
    alert("Atividade excluída pelo Administrador.");
  };

  // 2. Editar
  const handleEdit = (activity) => {
    setSelectedActivity({ ...activity });
    setEditModalOpen(true);
  };

  const confirmEdit = async (e) => {
    e.preventDefault();
    
    const updated = await updateActivityAdmin(selectedActivity);
    
    setActivities(activities.map(a => a.id === updated.id ? updated : a));
    setEditModalOpen(false);
    alert("Atividade atualizada com sucesso!");
  };

  // 3. Criar
  const handleCreate = async (e) => {
    e.preventDefault();
    
    const newActivity = await createActivityAdmin(selectedActivity);
    
    setActivities([...activities, newActivity]);
    setCreateModalOpen(false);
    alert("Nova atividade cadastrada!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedActivity(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="admin-activities-container"><p>Carregando gestão de atividades...</p></div>;
  }

  return (
    <div className="admin-activities-container">
      <div className="page-header">
        <h1>Gerenciamento de Atividades</h1>
        <button className="btn-new-activity" onClick={() => {
          setSelectedActivity({});
          setCreateModalOpen(true);
        }}>
          + Cadastrar Nova Atividade
        </button>
      </div>

      <div className="filters-wrapper-admin">
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

      <div className="activities-grid">
        {filteredActivities.map((item) => (
          <div key={item.id} className="activity-card admin-card">
            <div className="card-header">
              <span className={`tag ${item.type.toLowerCase()}`}>{item.type}</span>
              <span className="vacancies-info">Vagas: {item.vacancies}</span>
            </div>
            <div className="card-body">
              <h3>{item.name}</h3>
              <p className="professional-highlight">Responsável: <strong>{item.professional}</strong></p>
              <div className="time-badge">🕒 {item.time}</div>
            </div>
            <div className="card-actions">
              <button className="btn-edit" onClick={() => handleEdit(item)}>Editar</button>
              <button className="btn-cancel" onClick={() => handleDelete(item)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DE CRIAÇÃO --- */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Cadastrar Nova Atividade">
        <form onSubmit={handleCreate}>
          <div className="modal-form-group">
            <label>Nome:</label>
            <input type="text" name="name" required onChange={handleChange} />
          </div>
          <div className="modal-form-group">
            <label>Tipo:</label>
            <select name="type" required onChange={handleChange} defaultValue="">
              <option value="" disabled>Selecione...</option>
              <option value="Aula">Aula</option>
              <option value="Treino">Treino</option>
            </select>
          </div>
          <div className="modal-form-group">
            <label>Descrição:</label>
            <textarea className="modal-textarea" name="description" rows="3" onChange={handleChange}></textarea>
          </div>
          <div className="modal-row">
            <div className="modal-form-group">
              <label>Duração:</label>
              <input type="text" name="duration" placeholder="Ex: 60 min" required onChange={handleChange} />
            </div>
            <div className="modal-form-group">
              <label>Capacidade Máxima:</label>
              <input type="number" name="capacity" required onChange={handleChange} />
            </div>
          </div>
          {/* Campo de Profissional (Apenas para Admin) */}
          <div className="modal-form-group">
            <label>Profissional Responsável:</label>
            <input type="text" name="professional" required onChange={handleChange} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel-modal" onClick={() => setCreateModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-confirm">Cadastrar</button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL DE EDIÇÃO --- */}
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Atividade">
        <form onSubmit={confirmEdit}>
          <div className="modal-form-group">
            <label>Nome:</label>
            <input type="text" name="name" defaultValue={selectedActivity?.name} onChange={handleChange} />
          </div>
          <div className="modal-form-group">
            <label>Tipo:</label>
            <select name="type" value={selectedActivity?.type} onChange={handleChange}>
              <option value="Aula">Aula</option>
              <option value="Treino">Treino</option>
            </select>
          </div>
          <div className="modal-form-group">
            <label>Descrição:</label>
            <textarea className="modal-textarea" name="description" rows="3" defaultValue={selectedActivity?.description} onChange={handleChange}></textarea>
          </div>
          <div className="modal-row">
            <div className="modal-form-group">
              <label>Duração:</label>
              <input type="text" name="duration" defaultValue={selectedActivity?.duration} onChange={handleChange} />
            </div>
            <div className="modal-form-group">
              <label>Capacidade Máxima:</label>
              <input type="number" name="capacity" defaultValue={selectedActivity?.capacity} onChange={handleChange} />
            </div>
          </div>
          
          {/* Sem Horário e Sem Profissional na Edição */}

          <div className="modal-actions">
            <button type="button" className="btn-cancel-modal" onClick={() => setEditModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-confirm">Salvar</button>
          </div>
        </form>
      </Modal>

      {/* Modal Exclusão */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Excluir Atividade">
        <p>Tem certeza que deseja excluir <strong>{selectedActivity?.name}</strong>?</p>
        <div className="modal-actions">
          <button className="btn-cancel-modal" onClick={() => setDeleteModalOpen(false)}>Cancelar</button>
          <button className="btn-danger" onClick={confirmDelete}>Confirmar</button>
        </div>
      </Modal>
    </div>
  );
}

export default ActivityManagement;