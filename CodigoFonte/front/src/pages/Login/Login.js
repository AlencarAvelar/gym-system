import React from 'react';
import './Login.css';

function Login() {
  return (
    // 'login-page' agora é nossa "Seção Hero"
    <div className="login-page"> 
      
      {/* Novo container para o layout de 2 colunas */}
      <div className="login-content">
        
        {/* Coluna 1: O "Chamariz" */}
        <div className="attention-text">
          <h1>Transforme seu corpo.</h1>
          <h1>Transforme sua vida.</h1>
          <p>Acesse seu painel e agende seu próximo treino.</p>
        </div>

        <form id="login-form" className="login-form">
          <h2>Área do Cliente</h2>
          
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" placeholder="seuemail@exemplo.com" required />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Senha:</label>
            <input type="password" id="password" placeholder="Sua senha" required />
          </div>
          
          <button type="submit" className="login-button">Entrar</button>

          <div className="login-links">
            <a href="#">Esqueci minha senha</a>
          </div>
        </form>
      </div>
      
    </div>
  );
}

export default Login;