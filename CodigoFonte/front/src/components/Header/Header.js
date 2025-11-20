import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importamos os hooks do roteador
import './Header.css';

function Header() {
  const location = useLocation(); // Pega a informação de qual página estamos
  const isHome = location.pathname === '/'; // Verifica se é a Home

  return (
    <header className="main-header">
      <div className="logo">
        GYM<span>SYSTEM</span>
      </div>
      <nav className="main-nav">
        {/* Lógica para o botão SOBRE:
           Se estiver na Home, rola até a seção.
           Se não, volta para a Home.
        */}
        {isHome ? (
          <a href="#sobre-section">Sobre</a>
        ) : (
          <Link to="/">Sobre</Link>
        )}

        {/* Lógica para o botão ÁREA DO CLIENTE:
           Se estiver na Home, rola até o login.
           Se não, volta para a Home (onde o login está).
        */}
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