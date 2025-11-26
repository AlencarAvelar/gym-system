import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal';
import { getMyAppointments, deleteAppointment, updateAppointment } from '../../../services/appointmentService'; // Importa o serviço
import './MyAppointments.css';

function MyAppointments() {
  const [appointments, setAppointments] = useState([]); // Começa vazio
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // --- CARREGAR DADOS (GET) ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- ESTADOS DOS MODAIS ---
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // --- AÇÕES (DELETE) ---
  const handleOpenDelete = (item) => {
    setSelectedAppointment(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAppointment) return;
    
    // Chama o serviço para deletar
    await deleteAppointment(selectedAppointment.id);
    
    // Atualiza a lista localmente (ou recarrega tudo com loadData())
    setAppointments(appointments.filter(a => a.id !== selectedAppointment.id));
    
    setDeleteModalOpen(false);
    setSelectedAppointment(null);
    alert("Agendamento excluído com sucesso!");
  };

  // --- AÇÕES (UPDATE) ---
  const handleOpenEdit = (item) => {
    setSelectedAppointment({ ...item }); // Cria uma cópia para edição
    setEditModalOpen(true);
  };

  const handleConfirmEdit = async (e) => {
    e.preventDefault();
    
    // Chama o serviço para atualizar
    await updateAppointment(selectedAppointment);

    // Atualiza a lista localmente
    setAppointments(appointments.map(a => 
      a.id === selectedAppointment.id ? selectedAppointment : a
    ));

    setEditModalOpen(false);
    setSelectedAppointment(null);
    alert("Agendamento atualizado!");
  };

  // --- RENDERIZAÇÃO ---
  if (loading) {
    return <div className="appointments-container"><p>Carregando seus agendamentos...</p></div>;
  }

  return (
    <div className="appointments-container">
      <div className="page-header">
        <h1>Meus Agendamentos</h1>
      </div>

      <div className="appointments-grid">
        {appointments.length > 0 ? (
          appointments.map((item) => (
            <div key={item.id} className="appointment-card">
              <div className="card-header">
                <span className={`tag ${item.type.toLowerCase()}`}>{item.type}</span>
                <span className="vacancies-info">Vagas: {item.vacancies}</span>
              </div>
              <div className="card-body">
                <h3>{item.activity}</h3>
                <p className="professional">Profissional: {item.professional}</p>
                <div className="datetime-info">
                  <div className="info-item"><strong>Data:</strong> {item.date}</div>
                  <div className="info-item"><strong>Horário:</strong> {item.time}</div>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleOpenEdit(item)}>Editar</button>
                <button className="btn-cancel" onClick={() => handleOpenDelete(item)}>Excluir</button>
              </div>
            </div>
          ))
        ) : (
          <p>Você ainda não tem agendamentos.</p>
        )}
      </div>

      {/* --- MODAL DE EXCLUSÃO --- */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <p>Tem certeza que deseja excluir o agendamento de <strong>{selectedAppointment?.activity}</strong>?</p>
        <div className="modal-actions">
          <button className="btn-cancel-modal" onClick={() => setDeleteModalOpen(false)}>Cancelar</button>
          <button className="btn-danger" onClick={handleConfirmDelete}>Confirmar</button>
        </div>
      </Modal>

      {/* --- MODAL DE EDIÇÃO --- */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setEditModalOpen(false)}
        title="Editar Agendamento"
      >
        <form onSubmit={handleConfirmEdit}>
          <div className="modal-form-group">
            <label>Nova Data:</label>
            <input 
              type="text" 
              defaultValue={selectedAppointment?.date} 
              onChange={(e) => setSelectedAppointment({...selectedAppointment, date: e.target.value})}
            />
          </div>
          <div className="modal-form-group">
            <label>Novo Horário:</label>
            <input 
              type="text" 
              defaultValue={selectedAppointment?.time}
              onChange={(e) => setSelectedAppointment({...selectedAppointment, time: e.target.value})}
            />
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

export default MyAppointments;