import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHandsHelping, FaUserShield } from 'react-icons/fa';
import { getEventosWithStats } from '../services/eventoService';
import { EventoWithStats } from '../services/types';

const Home = () => {
  const [proximosEventos, setProximosEventos] = useState<EventoWithStats[]>([]);

  // Cargar eventos desde la API
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await getEventosWithStats();
        const hoy = new Date();
        const eventosFuturos = data.filter(evento => {
          const fechaEvento = new Date(evento.fecha_evento);
          return fechaEvento >= hoy;
        }).sort((a, b) => {
          return new Date(a.fecha_evento).getTime() - new Date(b.fecha_evento).getTime();
        });
        
        setProximosEventos(eventosFuturos);
      } catch (err) {
        console.error('Error al cargar eventos:', err);
        setProximosEventos([]);
      }
    };
    
    fetchEventos();
  }, []);

  // Estilos minimalistas
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .hero-container {
        background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
        min-height: 100vh;
        position: relative;
        overflow: hidden;
      }

      .hero-content {
        position: relative;
        z-index: 10;
        padding: 3rem;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(20px);
        border-radius: 30px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        margin: 0 auto;
        animation: fadeIn 1s ease forwards;
        border: 1px solid rgba(255, 255, 255, 0.5);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .hero-title {
        font-size: 7rem;
        font-weight: 900;
        background: linear-gradient(135deg, #1e3766 0%, #2563eb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        line-height: 1.1;
        margin-bottom: 3rem;
        position: relative;
        letter-spacing: -0.02em;
      }

      .cta-buttons {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
        margin-top: 2rem;
      }

      .cta-button {
        padding: 1.2rem 2.5rem;
        border-radius: 15px;
        font-weight: 600;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        font-size: 1.1rem;
      }

      .primary-button {
        background: linear-gradient(135deg, #1e3766 0%, #2563eb 100%);
        color: white;
        transform-origin: center;
        transition: all 0.3s ease;
      }

      .primary-button:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
      }

      .secondary-button {
        background: rgba(255, 255, 255, 0.9);
        color: #1e3766;
        border: 2px solid #1e3766;
        transform-origin: center;
        transition: all 0.3s ease;
      }

      .secondary-button:hover {
        transform: scale(1.05);
        background: rgba(30, 55, 102, 0.05);
        box-shadow: 0 10px 20px rgba(30, 55, 102, 0.1);
      }

      @media (max-width: 768px) {
        .hero-title {
          font-size: 4rem;
        }
        .cta-buttons {
          flex-direction: column;
        }
        .cta-button {
          width: 100%;
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="hero-container">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-8" style={{
        background: 'linear-gradient(135deg, rgba(30, 55, 102, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%)'
      }}>
        <div className="hero-content">
          <h1 className="hero-title" style={{ fontFamily: "'Recoleta Bold', serif" }}>
            Go Baby Go
          </h1>

          <div className="cta-buttons">
            <Link 
              to={proximosEventos.length > 0 ? `/voluntario/registro/${proximosEventos[0].id}` : "/registro-voluntario"}
              className="cta-button primary-button"
              style={{ fontFamily: "'Recoleta Medium', serif" }}
            >
              <FaHandsHelping />
              Únete como Voluntario
            </Link>
            
            <Link 
              to="/login" 
              className="cta-button secondary-button"
              style={{ fontFamily: "'Recoleta Medium', serif" }}
            >
              <FaUserShield />
              Acceso Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
