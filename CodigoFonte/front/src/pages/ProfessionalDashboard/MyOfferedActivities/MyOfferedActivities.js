import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal';
import { getMyOfferedActivities, deleteOfferedActivity, updateOfferedActivity } from '../../../services/professionalService';
import './MyOfferedActivities.css';

/**
 * Componente da tela "Minhas Atividades" (Painel do Profissional).
 * Permite ao professor visualizar, editar e excluir suas próprias aulas/treinos.
 */
function MyOfferedActivities() {
  const [myActivities, setMyActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados dos Modais
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  /**
   * Carrega a lista de atividades ministradas pelo profissional logado.
   */
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

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Filtra as atividades por tipo e nome.
   */
  const filteredActivities = myActivities.filter(activity => {
    const matchesType = filterType === 'Todos' || activity.type === filterType;
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // --- GERENCIAMENTO DE EXCLUSÃO ---

  const handleDelete = (activity) => {
    setSelectedActivity(activity);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteOfferedActivity(selectedActivity.id);

      // Atualiza a lista localmente removendo o item excluído
      setMyActivities(prev => prev.filter(a => a.id !== selectedActivity.id));
      setDeleteModalOpen(false);
      alert("Atividade excluída com sucesso!");
    } catch (msg) {
      alert(`Erro: ${msg}`);
      setDeleteModalOpen(false);
    }
  };

  // --- GERENCIAMENTO DE EDIÇÃO ---

  const handleEdit = (activity) => {
    // Prepara o objeto para edição, garantindo que campos opcionais tenham valor
    setSelectedActivity({
      ...activity,
      description: activity.description || "",
      duration: activity.duration || "",
      capacity: activity.capacity || activity.vacancies.split('/')[1]
    });
    setEditModalOpen(true);
  };

  const confirmEdit = async (e) => {
    e.preventDefault();
    try {
      await updateOfferedActivity(selectedActivity);

      // Recarrega dados do servidor para garantir sincronia total
      await loadData();

      setEditModalOpen(false);
      alert("Atividade editada com sucesso!");
    } catch (msg) {
      alert(`Erro: ${msg}`);
    }
  };

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
        {filteredActivities.length > 0 ? (
          filteredActivities.map((item) => (
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
                <button className="btn-edit" onClick={() => handleEdit(item)}>Editar</button>
                <button className="btn-cancel" onClick={() => handleDelete(item)}>Excluir</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">Nenhuma atividade encontrada.</p>
        )}
      </div>

      {/* Modal de Exclusão */}
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

      {/* Modal de Edição */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Editar Atividade"
      >
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
              <label>Duração (min):</label>
              <input type="number" name="duration" defaultValue={selectedActivity?.duration} onChange={handleChange} />
            </div>
            <div className="modal-form-group">
              <label>Capacidade:</label>
              <input type="number" name="capacity" defaultValue={selectedActivity?.capacity} onChange={handleChange} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel-modal" onClick={() => setEditModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-confirm">Salvar</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

export default MyOfferedActivities;