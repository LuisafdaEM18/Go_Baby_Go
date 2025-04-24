import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Pages/styles/Bienvenido.css';

const Bienvenido = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Redirige al login al hacer clic en "Salir"
    navigate('/');
  };

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <h1>El Comité</h1>
        <p className="welcome-subtitle">Go baby GO</p>
      </header>
      
      <main className="welcome-main">
        <div className="welcome-content">
          <h2 className="welcome-title">BIENVENIDO</h2>
          <div className="welcome-message">
            <p className="welcome-baby">Baby</p>
            <p className="welcome-go">go!</p>
          </div>
        </div>
      </main>

      <button className="logout-button" onClick={handleLogout}>
        Salir
      </button>
    </div>
  );
};

export default Bienvenido;