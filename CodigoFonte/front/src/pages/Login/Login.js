import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // 1. A rota correta no back-end é /auth/login
      const response = await api.post('/auth/login', { 
        email: email, 
        senha: password // O back-end espera 'senha', não 'password'
      });

      // 2. O back-end retorna { success: true, data: { token, usuario } }
      const { token, usuario } = response.data.data;

      // 3. Salva o Token e o Tipo de Usuário
      localStorage.setItem('gym_token', token);
      localStorage.setItem('gym_user_type', usuario.tipo_usuario);

      // 4. Redireciona baseado no tipo retornado pelo banco
      const tipo = usuario.tipo_usuario; // Ex: 'Administrador', 'Cliente'

      if (tipo === 'Administrador') {
        navigate('/admin');
      } else if (tipo === 'Professor' || tipo === 'Personal Trainer') {
        navigate('/profissional');
      } else {
        navigate('/dashboard'); // Cliente
      }

    } catch (err) {
      console.error("Erro no login:", err);
      // Tenta pegar a mensagem de erro que o back mandou
      const msg = err.response?.data?.message || 'E-mail ou senha inválidos.';
      setError(msg);
    }
  };

  return (
    <div className="login-page"> 
      <div className="login-content">
        <div className="attention-text">
          <h1>Transforme seu corpo.</h1>
          <h1>Transforme sua vida.</h1>
          <p>Acesse seu painel e agende seu próximo treino.</p>
        </div>

        <form id="login-form" className="login-form" onSubmit={handleSubmit}>
          <h2>Área do Cliente</h2>

          {error && <p className="login-error-message">{error}</p>}
          
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              placeholder="seuemail@exemplo.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
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
              onChange={(e) => setPassword(e.target.value)} 
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