import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Importamos o useNavigate
import './Login.css';

function Login() {
  const navigate = useNavigate(); // Hook para navegação

  // Estados para guardar o que o usuário digita
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para mensagem de erro

  // Função que roda ao clicar em "Entrar"
  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (password === '123') {
      navigate('/dashboard'); // Cliente
    } else if (password === '456') {
      navigate('/profissional'); // Profissional
    } else if (password === 'admin') {
      navigate('/admin'); // <-- NOVA ROTA: Admin
    } else {
      setError('Senhas: "123" (Cliente), "456" (Profissional), "admin" (Admin).');
    }
  };

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

        {/* Adicionamos o onSubmit aqui no form */}
        <form id="login-form" className="login-form" onSubmit={handleSubmit}>
          <h2>Área do Cliente</h2>

          {/* Exibe mensagem de erro se houver */}
          {error && <p className="login-error-message">{error}</p>}

          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="seuemail@exemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              placeholder="Sua senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Atualiza o estado
            />
          </div>

          <button type="submit" className="login-button">Entrar</button>

          <div className="login-links">
            <Link to="/recuperar-senha">Esqueci minha senha</Link>
          </div>
        </form>
      </div>

    </div>
  );
}

export default Login;