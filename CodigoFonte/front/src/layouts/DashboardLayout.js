import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './DashboardLayout.css';

function DashboardLayout() {
  return (
    <div className="dashboard-container">
      {/* --- BARRA SUPERIOR (Internal Header) --- */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo-small">GYM<span>SYSTEM</span></h1>
        </div>
        
        <nav className="dashboard-nav">
          {/* Links de navegação interna */}
          <Link to="/dashboard" className="nav-item">Meus Agendamentos</Link>
          <Link to="/dashboard/atividades" className="nav-item">Nova Atividade</Link>
          
          <div className="user-info">
            <span className="user-name">Olá, Cliente</span>
            {/* Botão de Sair (por enquanto volta pra home) */}
            <Link to="/" className="logout-btn">Sair</Link>
          </div>
        </nav>
      </header>

      {/* --- ÁREA DE CONTEÚDO (Onde as páginas vão aparecer) --- */}
      <main className="dashboard-content">
        {/* O 'Outlet' é o componente mágico do Router que renderiza a página filha */}
        <Outlet />
      </main>

      {/* Rodapé simples interno */}
      <footer className="dashboard-footer">
        <p>&copy; 2025 Gym System - Painel do Cliente</p>
      </footer>
    </div>
  );
}

export default DashboardLayout;