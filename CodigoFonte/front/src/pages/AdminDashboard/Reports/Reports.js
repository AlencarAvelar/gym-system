import React, { useState } from 'react';
import { generateReport } from '../../../services/adminService'; // Importa o serviço
import './Reports.css';

function Reports() {
  // Estados
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      alert("Por favor, selecione as datas de início e fim.");
      return;
    }

    setLoading(true); // Inicia loading

    try {
      // Chama o serviço para processar os dados
      const data = await generateReport(startDate, endDate);
      setReportData(data);
    } catch (error) {
      console.error("Erro ao gerar relatório", error);
      alert("Erro ao gerar relatório.");
    } finally {
      setLoading(false); // Para loading
    }
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

          <button type="submit" className="btn-generate" disabled={loading}>
            {loading ? "Gerando..." : "Gerar Relatório"}
          </button>
        </form>
      </div>

      {/* Resultados */}
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