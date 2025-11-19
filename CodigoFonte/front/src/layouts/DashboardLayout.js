import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './DashboardLayout.css';

function DashboardLayout() {
  const location = useLocation();
  
  const isProfessional = location.pathname.includes('/profissional');
  const isAdmin = location.pathname.includes('/admin'); // <-- NOVO

  // Define o título da área com base na rota
  let areaTitle = "Área do Cliente";
  if (isProfessional) areaTitle = "Área do Profissional";
  if (isAdmin) areaTitle = "Área Administrativa";

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo-small">GYM<span>SYSTEM</span></h1>
          <span className="portal-badge">{areaTitle}</span>
        </div>
        
        <nav className="dashboard-nav">
          
          {/* --- MENU DO ADMIN --- */}
          {isAdmin && (
            <>
              <Link to="/admin" className="nav-item">Gerenciar Atividades</Link>
              <Link to="/admin/agendamentos" className="nav-item">Gerenciar Agendamentos</Link>
              <Link to="/admin/relatorios" className="nav-item">Relatórios</Link>
            </>
          )}

          {/* --- MENU DO PROFESSOR --- */}
          {isProfessional && (
            <>
              <Link to="/profissional" className="nav-item">Minhas Aulas</Link>
              <Link to="/profissional/nova-atividade" className="nav-item highlight">+ Nova Atividade</Link>
              <Link to="/profissional/inscritos" className="nav-item">Inscritos</Link>
            </>
          )}

          {/* --- MENU DO CLIENTE (Se não for nem Admin nem Pro) --- */}
          {!isAdmin && !isProfessional && (
            <>
              <Link to="/dashboard" className="nav-item">Meus Agendamentos</Link>
              <Link to="/dashboard/atividades" className="nav-item">Agendar Aula</Link>
            </>
          )}
          
          <div className="user-info">
            <span className="user-name">
              {isAdmin ? "Olá, Administrador" : (isProfessional ? "Olá, Professor" : "Olá, Cliente")}
            </span>
            <Link to="/" className="logout-btn">Sair</Link>
          </div>
        </nav>
      </header>

      <main className="dashboard-content">
        <Outlet />
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Gym System - Painel de Controle</p>
      </footer>
    </div>
  );
}

export default DashboardLayout;