import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { authService } from '../services/authService'; // <-- 1. Importamos o serviço
import './DashboardLayout.css';

function DashboardLayout() {
  const location = useLocation();
  
  // 2. Pegamos os dados do usuário logado (que tem o 'nome')
  const user = authService.getCurrentUser();

  const isProfessional = location.pathname.includes('/profissional');
  const isAdmin = location.pathname.includes('/admin');

  // Define o título da área com base na rota
  let areaTitle = "Área do Cliente";
  if (isProfessional) areaTitle = "Área do Profissional";
  if (isAdmin) areaTitle = "Área Administrativa";

  // Função para fazer logout real
  const handleLogout = (e) => {
    e.preventDefault();
    authService.logout(); // Limpa o token e redireciona
  };

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

          {/* --- MENU DO CLIENTE --- */}
          {!isAdmin && !isProfessional && (
            <>
              <Link to="/dashboard" className="nav-item">Meus Agendamentos</Link>
              <Link to="/dashboard/atividades" className="nav-item">Agendar Aula</Link>
            </>
          )}
          
          <div className="user-info">
            {/* 3. Exibe o nome real do usuário (ou 'Visitante' se der erro) */}
            <span className="user-name">
              Olá, {user ? user.nome : 'Visitante'}
            </span>
            
            {/* 4. Botão de Sair com ação real */}
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