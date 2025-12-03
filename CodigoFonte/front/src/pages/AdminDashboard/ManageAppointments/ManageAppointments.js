import React, { useState, useEffect } from 'react';
import { getAllAppointments } from '../../../services/adminService';
import './ManageAppointments.css';

/**
 * Componente da tela "Gerenciamento de Agendamentos" (Painel do Admin).
 * Exibe uma listagem global de todos os agendamentos do sistema, com filtros avançados.
 */
function ManageAppointments() {
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  /**
   * Carrega a lista completa de agendamentos do sistema.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllAppointments();
        setAllAppointments(data);
      } catch (error) {
        console.error("Erro ao buscar agendamentos", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /**
   * Filtra a lista de agendamentos com base na busca textual e data.
   * A busca textual verifica: Nome do Cliente, Nome da Atividade e Nome do Profissional.
   */
  const filteredList = allAppointments.filter(item => {
    const searchLower = searchTerm.toLowerCase();

    const matchesText =
      item.client.toLowerCase().includes(searchLower) ||
      item.activity.toLowerCase().includes(searchLower) ||
      item.professional.toLowerCase().includes(searchLower);

    const matchesDate = dateFilter ? item.date === dateFilter : true;

    return matchesText && matchesDate;
  });

  if (loading) {
    return <div className="manage-appointments-container"><p>Carregando agendamentos...</p></div>;
  }

  return (
    <div className="manage-appointments-container">
      <div className="page-header">
        <h1>Gerenciamento de Agendamentos</h1>

        <div className="filters-bar">
          <div className="search-box-admin">
            <input
              type="text"
              placeholder="Buscar Cliente, Atividade ou Profissional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="date-filter">
            <label>Data:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            {dateFilter && (
              <button className="clear-btn" onClick={() => setDateFilter('')}>
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Data / Hora</th>
              <th>Cliente</th>
              <th>Atividade</th>
              <th>Profissional</th>
              <th>Status</th>
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
                    <span className={`status-badge ${item.status ? item.status.toLowerCase() : 'ativo'}`}>
                      {item.status || 'Ativo'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
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