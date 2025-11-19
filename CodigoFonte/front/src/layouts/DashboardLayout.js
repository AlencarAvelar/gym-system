import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom'; // Importe useLocation
import './DashboardLayout.css';

function DashboardLayout() {
  const location = useLocation();
  
  // Verifica se estamos na rota de profissional
  const isProfessional = location.pathname.includes('/profissional');

  return (
    <div className="dashboard-container">
      {/* --- BARRA SUPERIOR --- */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo-small">GYM<span>SYSTEM</span></h1>
          {/* Uma etiqueta visual para ajudar a saber onde estamos */}
          <span className="portal-badge">
            {isProfessional ? "Área do Profissional" : "Área do Cliente"}
          </span>
        </div>
        
        <nav className="dashboard-nav">
          
          {/* MENU DINÂMICO */}
          {isProfessional ? (
            // --- LINKS DO PROFESSOR ---
            <>
              <Link to="/profissional" className="nav-item">Minhas Aulas</Link>
              <Link to="/profissional/nova-atividade" className="nav-item highlight">+ Nova Atividade</Link>
              <Link to="/profissional/inscritos" className="nav-item">Inscritos</Link>
            </>
          ) : (
            // --- LINKS DO CLIENTE ---
            <>
              <Link to="/dashboard" className="nav-item">Meus Agendamentos</Link>
              <Link to="/dashboard/atividades" className="nav-item">Agendar Aula</Link>
            </>
          )}
          
          <div className="user-info">
            <span className="user-name">
              {isProfessional ? "Olá, Professor" : "Olá, Cliente"}
            </span>
            <Link to="/" className="logout-btn">Sair</Link>
          </div>
        </nav>
      </header>

      <main className="dashboard-content">
        <Outlet />
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Gym System - {isProfessional ? "Painel Administrativo" : "Painel do Aluno"}</p>
      </footer>
    </div>
  );
}

export default DashboardLayout;