import React, { useState } from 'react';
import './ManageAppointments.css';

function ManageAppointments() {
  // --- MOCK DATA (Visão de TODOS os agendamentos do sistema) ---
  const allAppointments = [
    { id: 1, date: "2025-11-20", time: "08:00", activity: "Musculação", client: "Ana Beatriz", professional: "João Paulo", status: "Confirmado" },
    { id: 2, date: "2025-11-20", time: "09:00", activity: "Pilates Solo", client: "Carlos Eduardo", professional: "Maria Clara", status: "Confirmado" },
    { id: 3, date: "2025-11-20", time: "14:00", activity: "Avaliação Física", client: "Roberto Justus", professional: "Dra. Fernanda", status: "Pendente" },
    { id: 4, date: "2025-11-21", time: "18:30", activity: "Crossfit", client: "Julia Roberts", professional: "Roberto Lima", status: "Cancelado" },
    { id: 5, date: "2025-11-22", time: "10:00", activity: "Yoga", client: "Michael Scott", professional: "Maria Clara", status: "Confirmado" },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Lógica de Filtragem Avançada
  const filteredList = allAppointments.filter(item => {
    // 1. Filtro de Texto (Busca em Cliente, Atividade ou Profissional)
    const searchLower = searchTerm.toLowerCase();
    const matchesText = 
      item.client.toLowerCase().includes(searchLower) ||
      item.activity.toLowerCase().includes(searchLower) ||
      item.professional.toLowerCase().includes(searchLower);

    // 2. Filtro de Data (Se estiver vazio, ignora)
    const matchesDate = dateFilter ? item.date === dateFilter : true;

    return matchesText && matchesDate;
  });

  return (
    <div className="manage-appointments-container">
      <div className="page-header">
        <h1>Gerenciamento de Agendamentos</h1>
        
        {/* Área de Filtros */}
        <div className="filters-bar">
          
          {/* Busca Textual */}
          <div className="search-box-admin">
            <input 
              type="text" 
              placeholder="Buscar Cliente, Atividade ou Profissional..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* Filtro de Data */}
          <div className="date-filter">
            <label>Data:</label>
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            {dateFilter && <button className="clear-btn" onClick={() => setDateFilter('')}>Limpar</button>}
          </div>

        </div>
      </div>

      {/* Tabela Global */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Data / Hora</th>
              <th>Cliente</th>
              <th>Atividade</th>
              <th>Profissional</th>
              <th>Status</th>
              {/* REMOVIDO: Coluna Ações */}
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((item) => (
                <tr key={item.id}>
                  <td className="td-datetime">
                    <div>{item.date.split('-').reverse().join('/')}</div>
                    <div className="small-time">{item.time}</div>
                  </td>
                  <td className="td-bold">{item.client}</td>
                  <td>{item.activity}</td>
                  <td>{item.professional}</td>
                  <td>
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  {/* REMOVIDO: Botão de Excluir */}
                </tr>
              ))
            ) : (
              <tr>
                {/* Ajustei o colSpan para 5, já que agora temos 5 colunas */}
                <td colSpan="5" className="no-data">Nenhum agendamento encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageAppointments;