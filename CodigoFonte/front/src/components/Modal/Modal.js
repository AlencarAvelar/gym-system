import React from 'react';
import './Modal.css';

// O componente recebe:
// - isOpen: se deve aparecer ou não
// - onClose: função para fechar
// - title: o título da janela
// - children: o conteúdo (inputs, botões) que vai dentro
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // Se não estiver aberto, não renderiza nada

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;