import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOfferedActivity } from '../../../services/professionalService'; // Importa o serviço
import './ActivityForm.css';

function ActivityForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estados do Formulário
  const [formData, setFormData] = useState({
    name: '',
    type: 'Aula', 
    description: '',
    duration: '',
    capacity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Chama o serviço real
      await createOfferedActivity(formData);
      
      alert(`Atividade "${formData.name}" cadastrada com sucesso!`);
      
      // Volta para a lista de aulas
      navigate('/profissional'); 
    } catch (error) {
      alert(`Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-form-container">
      <div className="form-header">
        <h1>Cadastrar Nova Atividade</h1>
        <p>Preencha os dados abaixo para ofertar uma nova aula ou treino.</p>
      </div>

      <form className="activity-form" onSubmit={handleSubmit}>
        
        <div className="form-row">
          <div className="form-group flex-2">
            <label htmlFor="name">Nome da Atividade *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Ex: Yoga Matinal..." 
              required 
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group flex-1">
            <label htmlFor="type">Tipo *</label>
            <select 
              id="type" 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
            >
              <option value="Aula">Aula (Em grupo)</option>
              <option value="Treino">Treino (Individual)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição Detalhada</label>
          <textarea 
            id="description" 
            name="description" 
            rows="4" 
            placeholder="Descreva o treino..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="duration">Duração (minutos) *</label>
            <input 
              type="number" 
              id="duration" 
              name="duration" 
              placeholder="60" 
              required 
              min="10"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacidade Máxima *</label>
            <input 
              type="number" 
              id="capacity" 
              name="capacity" 
              placeholder="20" 
              required 
              min="1"
              value={formData.capacity}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel-form" onClick={() => navigate('/profissional')}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit-form" disabled={loading}>
            {loading ? 'Salvando...' : 'Confirmar Cadastro'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default ActivityForm;