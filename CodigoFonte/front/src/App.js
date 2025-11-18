import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importamos o roteador

import Header from './components/Header/Header'; 
import Footer from './components/Footer/Footer'; 
import Login from './pages/Login/Login'; // Garanta que o caminho está certo (Login ou login)
import PasswordRecovery from './pages/PasswordRecovery/PasswordRecovery';
import './App.css'; 

function App() {
  return (
    <Router> {/* O 'Router' envolve o site inteiro */}
      <div className="App">
        <Header />
        
        <Routes> {/* Aqui definimos as "trocas" de página */}
          
          {/* Rota da Home/Login (O caminho raiz "/") */}
          <Route path="/" element={
            <>
              <Login />
              {/* A seção dummy só aparece na Home */}
              <div id="sobre-section" className="dummy-section">
                <h2>O que oferecemos</h2>
                <p>
                  Descubra um novo jeito de treinar. No Gym System, oferecemos equipamentos de última geração, 
                  uma equipe de instrutores certificados e um ambiente motivador para você alcançar seus objetivos.
                </p>
                <p>
                  Nossas modalidades incluem Musculação, Treinamento Funcional, Aulas de Spinning e Yoga.
                  Use nosso sistema para agendar sua próxima aula!
                </p>
              </div>
            </>
          } />

          {/* Rota de Recuperação de Senha */}
          <Route path="/recuperar-senha" element={<PasswordRecovery />} />

        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
