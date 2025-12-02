import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Chama o serviço de autenticação
      const usuario = await authService.login(email, password);

      // Redirecionamento inteligente baseado no tipo
      if (usuario) {
        const tipo = usuario.tipo_usuario;
        
        if (tipo === 'Administrador') {
          navigate('/admin');
        } else if (tipo === 'Professor' || tipo === 'Personal Trainer') {
          navigate('/profissional');
        } else {
          navigate('/dashboard'); // Cliente
        }
      }
    } catch (msg) {
      setError(msg || 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page"> 
      <div className="login-content">
        
        {/* --- NOVO TEXTO DE MARKETING --- */}
        <div className="attention-text">
          <h1>Desperte sua</h1>
          <h1 className="highlight-text">Melhor Versão.</h1>
          
          <p>
            Tecnologia e performance unidas para transformar sua rotina. 
            Gerencie seus horários com facilidade, garanta seu lugar nas melhores aulas 
            e foque no que realmente importa: <strong>seus resultados</strong>.
          </p>
          
          <p className="sub-text">O primeiro passo para a mudança começa agora.</p>
        </div>

        <form id="login-form" className="login-form" onSubmit={handleSubmit}>
          <h2>Acesse sua conta</h2>

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
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="login-links">
            <Link to="/recuperar-senha">Esqueci minha senha</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;