import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import './DashboardLayout.css';

/**
 * Layout principal para as áreas logadas (Dashboard).
 * Gerencia o menu de navegação dinâmico com base no perfil do usuário.
 */
function DashboardLayout() {
  const location = useLocation();
  const user = authService.getCurrentUser();

  // Identificação do contexto atual
  const isProfessional = location.pathname.includes('/profissional');
  const isAdmin = location.pathname.includes('/admin');

  let areaTitle = "Área do Cliente";
  if (isProfessional) areaTitle = "Área do Profissional";
  if (isAdmin) areaTitle = "Área Administrativa";

  const handleLogout = (e) => {
    e.preventDefault();
    authService.logout();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo-small">GYM<span>SYSTEM</span></h1>
          <span className="portal-badge">{areaTitle}</span>
        </div>

        <nav className="dashboard-nav">

          {/* Menu Admin */}
          {isAdmin && (
            <>
              <Link to="/admin" className="nav-item">Gerenciar Atividades</Link>
              <Link to="/admin/agendamentos" className="nav-item">Gerenciar Agendamentos</Link>
              <Link to="/admin/relatorios" className="nav-item">Relatórios</Link>
            </>
          )}

          {/* Menu Profissional */}
          {isProfessional && (
            <>
              <Link to="/profissional" className="nav-item">Minhas Aulas</Link>
              <Link to="/profissional/nova-atividade" className="nav-item highlight">+ Nova Atividade</Link>
              <Link to="/profissional/inscritos" className="nav-item">Inscritos</Link>
            </>
          )}

          {/* Menu Cliente */}
          {!isAdmin && !isProfessional && (
            <>
              <Link to="/dashboard" className="nav-item">Meus Agendamentos</Link>
              <Link to="/dashboard/atividades" className="nav-item">Agendar Aula</Link>
            </>
          )}

          <div className="user-info">
            <span className="user-name">
              Olá, {user ? user.nome : 'Visitante'}
            </span>
            <a href="/" onClick={handleLogout} className="logout-btn">Sair</a>
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