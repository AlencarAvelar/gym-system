import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="main-header">
      <div className="logo">
        GYM<span>SYSTEM</span>
      </div>
      <nav className="main-nav">
        <a href="#sobre-section">Sobre</a>
        <a href="#login-form" className="nav-highlight">Área do Cliente</a>
      </nav>
    </header>
  );
}

export default Header;