import React, { useState } from 'react';
import Modal from '../../../components/Modal/Modal'; // <-- Importe o Modal
import './MyAppointments.css';

function MyAppointments() {
  // Mock Data
  const [appointments, setAppointments] = useState([ // <-- Agora é um STATE para podermos excluir visualmente
    { id: 1, activity: "Musculação", type: "Treino", professional: "Carlos Silva", date: "20/11/2025", time: "14:00", vacancies: "15/30" },
    { id: 2, activity: "Yoga Matinal", type: "Aula", professional: "Ana Souza", date: "21/11/2025", time: "08:00", vacancies: "8/10" },
    { id: 3, activity: "Crossfit", type: "Aula", professional: "Roberto Lima", date: "22/11/2025", time: "18:30", vacancies: "20/20" }
  ]);

  // --- ESTADOS DOS MODAIS ---
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Guarda qual item foi clicado

  // --- AÇÕES ---
  const handleOpenDelete = (item) => {
    setSelectedAppointment(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Simula a exclusão removendo da lista visualmente
    setAppointments(appointments.filter(a => a.id !== selectedAppointment.id));
    setDeleteModalOpen(false);
    setSelectedAppointment(null);
    alert("Agendamento excluído com sucesso!");
  };

  const handleOpenEdit = (item) => {
    setSelectedAppointment(item);
    setEditModalOpen(true);
  };

  const handleConfirmEdit = (e) => {
    e.preventDefault();
    // Aqui futuramente chamaremos a API de atualização
    alert(`Agendamento atualizado para: ${selectedAppointment.date} às ${selectedAppointment.time}`);
    setEditModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="appointments-container">
      <div className="page-header">
        <h1>Meus Agendamentos</h1>
      </div>

      <div className="appointments-grid">
        {appointments.map((item) => (
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
              {/* Botões agora abrem os modais */}
              <button className="btn-edit" onClick={() => handleOpenEdit(item)}>Editar</button>
              <button className="btn-cancel" onClick={() => handleOpenDelete(item)}>Excluir</button>
            </div>
          </div>
        ))}
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