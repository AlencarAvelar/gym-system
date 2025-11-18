import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PasswordRecovery.css';

function PasswordRecovery() {
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui futuramente faremos a chamada para a API
    console.log('Recuperar senha para:', identifier);
    alert('Se este usuário existir, enviaremos um link de recuperação.');
  };

  return (
    <div className="recovery-page">
      
      <div className="recovery-content">
        <form className="recovery-form" onSubmit={handleSubmit}>
          <h2>Recuperar Senha</h2>
          
          <p className="recovery-description">
            Esqueceu sua senha? Não se preocupe. Digite seu e-mail ou nome de usuário abaixo para iniciar o processo de recuperação.
          </p>
          
          <div className="input-group">
            <label htmlFor="identifier">E-mail ou Usuário:</label>
            <input 
              type="text" 
              id="identifier" 
              placeholder="Digite seu e-mail ou usuário" 
              required 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          
          <button type="submit" className="recovery-button">Enviar Link</button>

          <div className="recovery-links">
            <Link to="/">Voltar para o Login</Link>
          </div>
        </form>
      </div>
      
    </div>
  );
}

export default PasswordRecovery;