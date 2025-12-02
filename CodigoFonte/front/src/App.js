import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import DashboardLayout from './layouts/DashboardLayout'; // <-- Importe o novo layout

// Pages Públicas
import Login from './pages/Login/Login';
import PasswordRecovery from './pages/PasswordRecovery/PasswordRecovery';

// Pages Cliente
import MyAppointments from './pages/ClientDashboard/MyAppointments/MyAppointments';
import AvailableActivities from './pages/ClientDashboard/AvailableActivities/AvailableActivities';

// Pages Profissional
import MyOfferedActivities from './pages/ProfessionalDashboard/MyOfferedActivities/MyOfferedActivities';
import ActivityForm from './pages/ProfessionalDashboard/ActivityForm/ActivityForm';
import EnrolledStudents from './pages/ProfessionalDashboard/EnrolledStudents/EnrolledStudents';

// Pages Administrador
import ActivityManagement from './pages/AdminDashboard/ActivityManagement/ActivityManagement';
import ManageAppointments from './pages/AdminDashboard/ManageAppointments/ManageAppointments';
import Reports from './pages/AdminDashboard/Reports/Reports';

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
                <h2>O que oferecemos</h2>
                {/* ... seu texto ... */}
                <p className="landing-subtitle">
                  Mais do que apenas uma academia, o Gym System é o ponto de partida para a sua <strong>revolução pessoal</strong>.
                  Aqui, unimos tecnologia de ponta e infraestrutura de elite para criar uma experiência de treino que vai muito além do esforço físico:
                  é sobre <strong>superar limites</strong>, construir disciplina e alcançar a <strong>melhor versão de si mesmo</strong>.
                  Com uma equipe de especialistas apaixonados e uma variedade de modalidades desenhadas para todos os objetivos,
                  oferecemos o suporte necessário para que cada movimento conte. Não deixe para depois a saúde que você merece hoje;
                  junte-se a uma comunidade que <strong>transpira evolução</strong>.
                </p>
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
            <Route index element={<MyAppointments />} />
            {/* NOVA ROTA ADICIONADA: */}
            <Route path="atividades" element={<AvailableActivities />} />

            {/* Outras páginas internas virão aqui depois, ex: */}
            {/* <Route path="atividades" element={<Atividades />} /> */}

          </Route>

          {/* --- ROTAS PRIVADAS (Painel do Profissional) --- */}
          {/* Vamos reusar o DashboardLayout por enquanto */}
          <Route path="/profissional" element={<DashboardLayout />}>
            <Route index element={<MyOfferedActivities />} />
            {/* NOVA ROTA AQUI: */}
            <Route path="nova-atividade" element={<ActivityForm />} />
            {/* NOVA ROTA: */}
            <Route path="inscritos" element={<EnrolledStudents />} />
          </Route>
          {/* --- ROTAS PRIVADAS (Painel do Administrador) --- */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<ActivityManagement />} />

            {/* NOVA ROTA AQUI: */}
            <Route path="agendamentos" element={<ManageAppointments />} />

            {/* <Route path="relatorios" element={<Reports />} /> */}
            <Route path="relatorios" element={<Reports />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;