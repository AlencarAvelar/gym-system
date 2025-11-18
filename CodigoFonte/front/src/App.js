import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import Header from './components/Header/Header'; 
import Footer from './components/Footer/Footer'; 
import DashboardLayout from './layouts/DashboardLayout'; // <-- Importe o novo layout

// Pages Públicas
import Login from './pages/Login/Login'; 
import PasswordRecovery from './pages/PasswordRecovery/PasswordRecovery';

import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          {/* --- ROTAS PÚBLICAS (Com Header/Footer da Home) --- */}
          <Route path="/" element={
            <>
              <Header />
              <Login />
              {/* Seção Dummy */}
              <div id="sobre-section" className="dummy-section">
                  {/* ... seu texto ... */}
                  <p>Descubra um novo jeito de treinar...</p>
              </div>
              <Footer />
            </>
          } />

          <Route path="/recuperar-senha" element={
            <>
              <Header />
              <PasswordRecovery />
              <Footer />
            </>
          } />


          {/* --- ROTAS PRIVADAS (Painel do Cliente) --- */}
          {/* Aqui usamos o DashboardLayout como "Pai" */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            
            {/* Esta será a página inicial do painel (/dashboard) */}
            <Route index element={<div style={{color: '#333'}}><h1>Meus Agendamentos</h1><p>Aqui entrará a lista...</p></div>} />
            
            {/* Outras páginas internas virão aqui depois, ex: */}
            {/* <Route path="atividades" element={<Atividades />} /> */}
          
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;