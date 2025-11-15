import React from 'react';
import './Login.css'; // Importa o nosso CSS

function Login() {
  return (
    // Adicionamos um "container" para centralizar
    <div className="login-container"> 
      
      {/* Nosso formulário */}
      <form className="login-form">
        <h2>Página de Login</h2>
        
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Senha:</label>
          <input type="password" id="password" />
        </div>
        
        <button type="submit" className="login-button">Entrar</button>
      </form>
      
    </div>
  );
}

export default Login;