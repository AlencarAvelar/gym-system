import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivityForm.css';

function ActivityForm() {
  const navigate = useNavigate();

  // Estados do Formulário
  const [formData, setFormData] = useState({
    name: '',
    type: 'Aula', // Valor padrão
    description: '',
    duration: '',
    capacity: ''
  });

  // Atualiza o estado quando o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulação de envio para o Back-End
    console.log('Dados da Nova Atividade:', formData);
    
    alert(`Atividade "${formData.name}" cadastrada com sucesso!`);
    
    // Redireciona de volta para a lista de atividades
    navigate('/profissional');
  };

  return (
    <div className="activity-form-container">
      <div className="form-header">
        <h1>Cadastrar Nova Atividade</h1>
        <p>Preencha os dados abaixo para ofertar uma nova aula ou treino.</p>
      </div>

      <form className="activity-form" onSubmit={handleSubmit}>
        
        {/* Grupo: Nome e Tipo */}
        <div className="form-row">
          <div className="form-group flex-2">
            <label htmlFor="name">Nome da Atividade *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Ex: Yoga Matinal, Musculação A..." 
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

        {/* Descrição */}
        <div className="form-group">
          <label htmlFor="description">Descrição Detalhada</label>
          <textarea 
            id="description" 
            name="description" 
            rows="4" 
            placeholder="Descreva o que será feito, nível de dificuldade, equipamentos necessários..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Grupo: Duração e Capacidade */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="duration">Duração (em minutos) *</label>
            <input 
              type="number" 
              id="duration" 
              name="duration" 
              placeholder="Ex: 60" 
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
              placeholder="Ex: 20" 
              required 
              min="1"
              value={formData.capacity}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="form-actions">
          <button type="button" className="btn-cancel-form" onClick={() => navigate('/profissional')}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit-form">
            Confirmar Cadastro
          </button>
        </div>

      </form>
    </div>
  );
}

export default ActivityForm;