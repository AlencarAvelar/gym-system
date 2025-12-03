import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal';
import { getMyAppointments, deleteAppointment, updateAppointment } from '../../../services/appointmentService';
import './MyAppointments.css';

/**
 * Componente da tela "Meus Agendamentos" (Painel do Cliente).
 * Lista os agendamentos do usuário e permite editar ou cancelar.
 */
function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de controle dos Modais
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  /**
   * Carrega a lista de agendamentos ao montar o componente.
   */
  useEffect(() => {
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
    loadData();
  }, []);

  // --- GERENCIAMENTO DE EXCLUSÃO ---

  const handleOpenDelete = (item) => {
    setSelectedAppointment(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAppointment) return;

    try {
      await deleteAppointment(selectedAppointment.id);

      // Atualiza o estado local removendo o item excluído
      setAppointments(prev => prev.filter(a => a.id !== selectedAppointment.id));

      setDeleteModalOpen(false);
      setSelectedAppointment(null);
      alert("Agendamento excluído com sucesso!");
    } catch (error) {
      // O erro já é tratado/alertado no serviço, mas podemos logar aqui se necessário
    }
  };

  // --- GERENCIAMENTO DE EDIÇÃO ---

  const handleOpenEdit = (item) => {
    setSelectedAppointment({ ...item }); // Cria cópia para evitar mutação direta
    setEditModalOpen(true);
  };

  const handleConfirmEdit = async (e) => {
    e.preventDefault();

    try {
      await updateAppointment(selectedAppointment);

      // Atualiza o estado local com os novos dados
      setAppointments(prev => prev.map(a =>
        a.id === selectedAppointment.id ? selectedAppointment : a
      ));

      setEditModalOpen(false);
      setSelectedAppointment(null);
      alert("Agendamento atualizado com sucesso!");
    } catch (error) {
      // Erro tratado no serviço
    }
  };

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
                <span className={`tag ${item.type ? item.type.toLowerCase() : 'treino'}`}>{item.type}</span>
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
          <p>Você ainda não possui agendamentos.</p>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
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

      {/* Modal de Edição */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Editar Agendamento"
      >
        <form onSubmit={handleConfirmEdit}>
          <div className="modal-form-group">
            <label>Nova Data:</label>
            <input
              type="date"
              required
              defaultValue={selectedAppointment?.date}
              onChange={(e) => setSelectedAppointment({ ...selectedAppointment, date: e.target.value })}
            />
          </div>
          <div className="modal-form-group">
            <label>Novo Horário:</label>
            <input
              type="time"
              required
              defaultValue={selectedAppointment?.time}
              onChange={(e) => setSelectedAppointment({ ...selectedAppointment, time: e.target.value })}
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