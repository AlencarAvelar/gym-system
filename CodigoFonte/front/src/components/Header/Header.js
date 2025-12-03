import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

/**
 * Cabeçalho da página pública (Landing Page).
 * Gerencia a navegação interna (scroll suave) e acesso ao login.
 */
function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="main-header">
      <div className="logo">
        GYM<span>SYSTEM</span>
      </div>
      <nav className="main-nav">
        {/* Navegação inteligente: Scroll se na home, Link se fora */}
        {isHome ? (
          <a href="#sobre-section">Sobre</a>
        ) : (
          <Link to="/">Sobre</Link>
        )}

        {isHome ? (
          <a href="#login-form" className="nav-highlight">Área do Cliente</a>
        ) : (
          <Link to="/" className="nav-highlight">Área do Cliente</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;