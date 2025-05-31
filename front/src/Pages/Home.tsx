import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHandsHelping, FaUserShield, FaArrowRight, FaChild, FaCar, FaCalendarAlt, FaHeart, FaTools } from 'react-icons/fa';
import { getEventosWithStats } from '../services/eventoService';
import { EventoWithStats } from '../services/types';
import logoBabyGo from '../assets/logo-babygo.png';

const Home = () => {
  const [proximosEventos, setProximosEventos] = useState<EventoWithStats[]>([]);

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

  const categories = [
    {
      title: "Tu Causa",
      icon: <FaHandsHelping className="text-3xl text-[#73a31d]" />,
      description: "Únete como voluntario",
      image: logoBabyGo,
      link: proximosEventos.length > 0 ? `/voluntario/registro/${proximosEventos[0].id}` : "/registro-voluntario"
    },
    {
      title: "Adaptación",
      icon: <FaTools className="text-3xl text-[#73a31d]" />,
      description: "Vehículos adaptados",
      image: logoBabyGo,
      link: "/about"
    },
    {
      title: "Impacto",
      icon: <FaHeart className="text-3xl text-[#73a31d]" />,
      description: "Historias de éxito",
      image: logoBabyGo,
      link: "/impact"
    },
    {
      title: "Educación",
      icon: <FaChild className="text-3xl text-[#73a31d]" />,
      description: "Aprende con nosotros",
      image: logoBabyGo,
      link: "/education"
    },
    {
      title: "Comunidad",
      icon: <FaUserShield className="text-3xl text-[#73a31d]" />,
      description: "Nuestra familia",
      image: logoBabyGo,
      link: "/community"
    },
    {
      title: "Eventos",
      icon: <FaCalendarAlt className="text-3xl text-[#73a31d]" />,
      description: "Próximas actividades",
      image: logoBabyGo,
      link: "/events"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f7eb]/30 via-[#e8f0d9]/20 to-[#dce8c7]/10 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20">
        {/* Círculos flotantes */}
        <div className="absolute inset-0 overflow-hidden">
          {categories.map((category, index) => {
            const isLeftSide = index < 3;
            const verticalPosition = index % 3;
            
            // Posición X más separada
            let xPosition = isLeftSide ? '20%' : '80%';
            
            // Círculos del medio sobresalen
            if (verticalPosition === 1) {
              xPosition = isLeftSide ? '15%' : '85%';
            }
            
            // Ajustamos las posiciones verticales con más espacio
            let yPosition;
            switch(verticalPosition) {
              case 0:
                yPosition = '20%'; // Más arriba
                break;
              case 1:
                yPosition = '50%'; // Centro
                break;
              case 2:
                yPosition = '80%'; // Más abajo
                break;
              default:
                yPosition = '50%';
            }

            return (
              <Link
                key={index}
                to={category.link}
                className="absolute transition-all duration-500 hover:scale-105 group"
                style={{
                  left: xPosition,
                  top: yPosition,
                  transform: 'translate(-50%, -50%)',
                  zIndex: verticalPosition === 1 ? 11 : 10
                }}
              >
                <div className={`relative w-36 h-36 rounded-full overflow-hidden group-hover:shadow-2xl transition-all duration-500 ${
                  verticalPosition === 1 ? 'scale-110' : ''
                }`}>
                  {/* Borde circular con efecto de progreso */}
                  <div className="absolute inset-0 rounded-full">
                    {/* Capa base */}
                    <div className="absolute inset-0 rounded-full border-[6px] border-[#73a31d]"></div>
                    {/* Capa de progreso animada */}
                    <div 
                      className="absolute inset-0 rounded-full border-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        borderColor: '#73a31d',
                        borderStyle: 'solid',
                        borderLeftColor: 'rgba(115, 163, 29, 0.3)',
                        borderBottomColor: 'rgba(115, 163, 29, 0.3)',
                        animation: 'spin-slow 4s linear infinite'
                      }}
                    ></div>
                  </div>
                  {/* Contenedor de la imagen con efecto de profundidad */}
                  <div className="absolute inset-[8px] bg-white rounded-full overflow-hidden backdrop-blur-sm shadow-lg">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Contenido Central con padding ajustado */}
        <div className="relative z-20 text-center max-w-2xl mx-auto px-4">
          <p className="text-xl text-[#73a31d] mb-6 animate-fade-in" style={{ fontFamily: "'Recoleta', serif" }}>
            Transformando la movilidad infantil
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in-up" style={{ fontFamily: "'Recoleta Bold', serif" }}>
            Juntos Creamos<br />
            <span className="bg-gradient-to-r from-[#73a31d] to-[#90c290] bg-clip-text text-transparent">
              Sonrisas en Movimiento
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-xl mx-auto animate-fade-in" style={{ fontFamily: "'Recoleta Light', serif" }}>
            Únete a nuestra comunidad de voluntarios y ayuda a transformar la vida de niños a través de la movilidad adaptada
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={proximosEventos.length > 0 ? `/voluntario/registro/${proximosEventos[0].id}` : "/registro-voluntario"}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-[#73a31d] rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-bounce-subtle"
            >
              Sé Voluntario
              <FaArrowRight className="ml-2" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-[#73a31d] bg-white/80 border-2 border-[#73a31d] rounded-full shadow-lg hover:shadow-xl hover:bg-[#73a31d] hover:text-white transform hover:-translate-y-1 transition-all duration-300"
            >
              <FaUserShield className="mr-2" />
              Administrador
            </Link>
          </div>
        </div>

        {/* Elementos de fondo ajustados */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-br from-[#73a31d]/10 via-[#90c290]/10 to-[#73a31d]/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-tl from-[#73a31d]/10 via-[#90c290]/10 to-[#73a31d]/5 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;

// Actualizar las animaciones y agregar estilos para el degradado
const style = document.createElement('style');
style.textContent = `
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes spin-slow-reverse {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }

  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }

  .animate-spin-slow-reverse {
    animation: spin-slow-reverse 8s linear infinite;
  }

  /* Agregar soporte para degradados en bordes */
  @supports (-webkit-border-image: initial) {
    .border-gradient {
      border: 6px solid;
      -webkit-border-image: linear-gradient(45deg, #73a31d, #73a31d 20%, #8fb82e 40%, #a6cc40 60%, #bde063 80%, #d4eb74) 1;
      border-image: linear-gradient(45deg, #73a31d, #73a31d 20%, #8fb82e 40%, #a6cc40 60%, #bde063 80%, #d4eb74) 1;
    }
  }

  /* Resto de las animaciones */
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float 6s ease-in-out infinite;
    animation-delay: 3s;
  }

  .animate-bounce-subtle {
    animation: bounce-subtle 2s ease-in-out infinite;
  }

  .animate-fade-in {
    animation: fadeIn 1s ease-out forwards;
  }

  .animate-fade-in-up {
    animation: fadeInUp 1s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
`;
document.head.appendChild(style);