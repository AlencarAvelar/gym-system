import React from 'react';
import Header from './components/Header/Header'; 
import Footer from './components/Footer/Footer'; 
import Login from './pages/Login/Login';
import './App.css'; 

function App() {
  return (
    <div className="App">
      <Header />
      
      {/* O Login.js agora funciona como a seção "Hero" */}
      <Login /> 

      {/* --- Seção DUMMY (Agora com texto genérico) --- */}
      <div id="sobre-section" className="dummy-section">
        <h2>O que oferecemos</h2>
        
        {/* MUDANÇA: Adicionamos o texto genérico aqui */}
        <p>
          Descubra um novo jeito de treinar. No Gym System, oferecemos equipamentos de última geração, 
          uma equipe de instrutores certificados e um ambiente motivador para você alcançar seus objetivos,
          seja hipertrofia, perda de peso ou qualidade de vida.
        </p>
        <p>
          Nossas modalidades incluem Musculação, Treinamento Funcional, Aulas de Spinning e Yoga.
          Tudo para que você encontre a atividade que mais combina com seu estilo. 
          Use nosso sistema para agendar sua próxima aula!
        </p>
        
      </div>
      {/* --- Fim da Seção Dummy --- */}

      <Footer />
    </div>
  );
}

export default App;
