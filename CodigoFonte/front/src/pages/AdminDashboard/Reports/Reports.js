import React, { useState } from 'react';
import { generateReport } from '../../../services/adminService';
import './Reports.css';

/**
 * Componente da tela "Relatórios" (Painel do Admin).
 * Permite gerar relatórios estatísticos de agendamentos baseados em um período de tempo.
 */
function Reports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Aciona o serviço de geração de relatórios com as datas selecionadas.
   */
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("Por favor, selecione as datas de início e fim.");
      return;
    }

    setLoading(true);

    try {
      const data = await generateReport(startDate, endDate);
      setReportData(data);
    } catch (error) {
      console.error("Erro ao gerar relatório", error);
      alert("Não foi possível gerar o relatório. Tente novamente.");
    } finally {
      setLoading(false);
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
            {loading ? "Processando..." : "Gerar Relatório"}
          </button>
        </form>
      </div>

      {/* Área de Resultados */}
      {reportData && (
        <div className="report-results">

          {/* Cards de Resumo Estatístico */}
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
                        <span className={`badge ${item.type ? item.type.toLowerCase() : 'aula'}`}>
                          {item.type || 'Atividade'}
                        </span>
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