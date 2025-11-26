import React, { useState, useEffect } from 'react';
import { getEnrolledStudents } from '../../../services/professionalService'; // Importa do serviço
import './EnrolledStudents.css';

function EnrolledStudents() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- CARREGAR DADOS ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getEnrolledStudents();
        setEnrollments(data);
      } catch (error) {
        console.error("Erro ao buscar inscritos", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Lógica de Filtragem
  const filteredEnrollments = enrollments.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.activity.toLowerCase().includes(searchLower) ||
      item.student.toLowerCase().includes(searchLower) ||
      item.date.includes(searchLower)
    );
  });

  if (loading) {
    return <div className="enrolled-container"><p>Carregando lista de chamada...</p></div>;
  }

  return (
    <div className="enrolled-container">
      <div className="page-header">
        <h1>Consultar Inscritos</h1>
        
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Buscar por aluno, atividade ou data..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Horário</th>
              <th>Atividade</th>
              <th>Nome do Aluno</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.length > 0 ? (
              filteredEnrollments.map((item) => (
                <tr key={item.id}>
                  <td className="td-date">{item.date}</td>
                  <td className="td-time">{item.time}</td>
                  <td className="td-bold">{item.activity}</td>
                  <td>{item.student}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">Nenhum inscrito encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnrolledStudents;