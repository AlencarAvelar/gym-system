import React, { useState } from 'react';
import './EnrolledStudents.css';

function EnrolledStudents() {
  // --- MOCK DATA (Alunos inscritos nas aulas deste professor) ---
  const enrollments = [
    { id: 1, date: "20/11/2025", time: "08:00", activity: "Musculação A", student: "Ana Beatriz Costa" },
    { id: 2, date: "20/11/2025", time: "08:00", activity: "Musculação A", student: "Carlos Eduardo" },
    { id: 3, date: "20/11/2025", time: "09:00", activity: "Pilates Solo", student: "Fernanda Lima" },
    { id: 4, date: "21/11/2025", time: "14:00", activity: "Avaliação Física", student: "Roberto Justus" },
    { id: 5, date: "21/11/2025", time: "18:30", activity: "Crossfit", student: "Julia Roberts" },
    { id: 6, date: "22/11/2025", time: "10:00", activity: "Yoga", student: "Michael Scott" },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de Filtragem (Busca por Atividade, Aluno ou Data)
  const filteredEnrollments = enrollments.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.activity.toLowerCase().includes(searchLower) ||
      item.student.toLowerCase().includes(searchLower) ||
      item.date.includes(searchLower)
    );
  });

  return (
    <div className="enrolled-container">
      <div className="page-header">
        <h1>Consultar Inscritos</h1>
        
        {/* Barra de Busca Simples */}
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

      {/* Container da Tabela (com scroll horizontal para mobile) */}
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