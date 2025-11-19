import React, { useState } from 'react';
import './Reports.css';

function Reports() {
  // --- MOCK DATA (Dados brutos para gerar estatísticas) ---
  const rawData = [
    { id: 1, date: "2025-11-20", activity: "Musculação", total: 15, type: "Treino" },
    { id: 2, date: "2025-11-20", activity: "Pilates Solo", total: 8, type: "Aula" },
    { id: 3, date: "2025-11-21", activity: "Crossfit", total: 20, type: "Aula" },
    { id: 4, date: "2025-11-22", activity: "Yoga", total: 10, type: "Aula" },
    { id: 5, date: "2025-11-23", activity: "Musculação", total: 12, type: "Treino" },
    { id: 6, date: "2025-11-24", activity: "Boxe", total: 5, type: "Aula" },
  ];

  // Estados
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null); // null = nenhum relatório gerado ainda

  const handleGenerate = (e) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      alert("Por favor, selecione as datas de início e fim.");
      return;
    }

    // Simula o filtro por data (string comparison funciona para formato yyyy-mm-dd)
    const filtered = rawData.filter(item => item.date >= startDate && item.date <= endDate);

    // Calcula totais
    const totalStudents = filtered.reduce((acc, curr) => acc + curr.total, 0);
    const totalActivities = filtered.length;

    setReportData({
      data: filtered,
      summary: { totalStudents, totalActivities }
    });
  };

  return (
    <div className="reports-container">
      <div className="page-header">
        <h1>Relatórios de Agendamentos</h1>
      </div>

      {/* Filtros de Data */}
      <div className="report-filters">
        <form onSubmit={handleGenerate} className="filters-form">
          <div className="form-group">
            <label>Data de Início:</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              required
            />
          </div>
          
          <div className="form-group">
            <label>Data de Fim:</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="btn-generate">Gerar Relatório</button>
        </form>
      </div>

      {/* Resultados (Só exibe se tiver gerado) */}
      {reportData && (
        <div className="report-results">
          
          {/* Resumo / Cards */}
          <div className="summary-cards">
            <div className="summary-card blue">
              <h3>Total de Alunos</h3>
              <p>{reportData.summary.totalStudents}</p>
            </div>
            <div className="summary-card green">
              <h3>Atividades Realizadas</h3>
              <p>{reportData.summary.totalActivities}</p>
            </div>
          </div>

          {/* Tabela Detalhada */}
          <div className="results-table-container">
            <h2>Detalhamento</h2>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Atividade</th>
                  <th>Tipo</th>
                  <th>Inscritos</th>
                </tr>
              </thead>
              <tbody>
                {reportData.data.length > 0 ? (
                  reportData.data.map((item) => (
                    <tr key={item.id}>
                      <td>{item.date.split('-').reverse().join('/')}</td>
                      <td>{item.activity}</td>
                      <td>
                        <span className={`badge ${item.type.toLowerCase()}`}>{item.type}</span>
                      </td>
                      <td>{item.total}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">Nenhum dado encontrado neste período.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <button className="btn-print" onClick={() => window.print()}>🖨️ Imprimir</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;