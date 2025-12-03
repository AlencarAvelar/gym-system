import React from 'react';
import './Modal.css';

/**
 * Componente genérico de Modal (Pop-up).
 * @param {boolean} isOpen - Controla a visibilidade.
 * @param {function} onClose - Função chamada ao fechar.
 * @param {string} title - Título do modal.
 * @param {ReactNode} children - Conteúdo interno do modal.
 */
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

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