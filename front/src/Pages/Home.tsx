import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHandsHelping, FaUserShield, FaArrowRight, FaChild, FaCar, FaCalendarAlt, FaHeart, FaTools } from 'react-icons/fa';
import { getEventosWithStats } from '../services/eventoService';
import { EventoWithStats } from '../services/types';
import imagen1 from '../assets/imagen 1.png';
import imagen2 from '../assets/imagen 2.png';
import imagen3 from '../assets/imagen 3.png';
import imagen4 from '../assets/imagen 4.png';
import imagen5 from '../assets/imagen 5.png';
import imagen6 from '../assets/imagen 6.png';
import logoBabyGo from '../assets/Logo-Go-baby-Go-2024-02-1.png';

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
      image: imagen1,
      link: proximosEventos.length > 0 ? `/voluntario/registro/${proximosEventos[0].id}` : "/registro-voluntario"
    },
    {
      title: "Adaptación",
      icon: <FaTools className="text-3xl text-[#73a31d]" />,
      description: "Vehículos adaptados",
      image: imagen2,
      link: "/about"
    },
    {
      title: "Impacto",
      icon: <FaHeart className="text-3xl text-[#73a31d]" />,
      description: "Historias de éxito",
      image: imagen3,
      link: "/impact"
    },
    {
      title: "Educación",
      icon: <FaChild className="text-3xl text-[#73a31d]" />,
      description: "Aprende con nosotros",
      image: imagen4,
      link: "/education"
    },
    {
      title: "Comunidad",
      icon: <FaUserShield className="text-3xl text-[#73a31d]" />,
      description: "Nuestra familia",
      image: imagen5,
      link: "/community"
    },
    {
      title: "Eventos",
      icon: <FaCalendarAlt className="text-3xl text-[#73a31d]" />,
      description: "Próximas actividades",
      image: imagen6,
      link: "/events"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff]/80 via-[#e6f1ff]/70 to-[#dce9ff]/60 overflow-hidden">
      {/* Sistema Solar en el fondo */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Órbitas grandes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[800px] h-[800px]">
            <div className="absolute inset-0 rounded-full border-[1px] border-blue-500/20 animate-orbit-slow"></div>
            <div className="absolute inset-[-50px] rounded-full border-[1px] border-blue-400/15 animate-orbit-reverse"></div>
            <div className="absolute inset-[-100px] rounded-full border-[1px] border-blue-300/10 animate-orbit-slower"></div>
            {/* Puntos orbitando */}
            <div className="absolute inset-0 animate-orbit-slow">
              <div className="absolute top-1/2 right-0 w-3 h-3 rounded-full bg-blue-500/30"></div>
            </div>
            <div className="absolute inset-[-50px] animate-orbit-reverse">
              <div className="absolute top-1/2 left-0 w-3 h-3 rounded-full bg-blue-400/30"></div>
            </div>
            <div className="absolute inset-[-100px] animate-orbit-slower">
              <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-blue-300/30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20">
        {/* Elementos de fondo ajustados */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-indigo-400/25 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-tl from-blue-500/30 via-indigo-400/25 to-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
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

        {/* Círculos flotantes */}
        <div className="absolute inset-0 overflow-hidden">
          {categories.map((category, index) => {
            const isLeftSide = index < 3;
            const verticalPosition = index % 3;
            
            // Definimos tamaños diferentes para cada círculo
            const sizes = [
              { w: '160px', h: '160px' }, // Tu Causa - más grande
              { w: '140px', h: '140px' }, // Adaptación
              { w: '150px', h: '150px' }, // Impacto
              { w: '145px', h: '145px' }, // Educación
              { w: '155px', h: '155px' }, // Comunidad
              { w: '135px', h: '135px' }  // Eventos - más pequeño
            ];
            
            // Posiciones X ajustadas para cada círculo
            let xPosition;
            if (isLeftSide) {
              xPosition = verticalPosition === 1 ? '18%' : '22%';
            } else {
              xPosition = verticalPosition === 1 ? '82%' : '78%';
            }
            
            // Posiciones Y ajustadas para distribución asimétrica
            const yPositions = ['25%', '50%', '75%'];
            let yPosition = yPositions[verticalPosition];
            
            // Ajustes adicionales para crear asimetría
            if (index === 1) yPosition = '45%';
            if (index === 4) yPosition = '55%';

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
                <div className={`relative rounded-full overflow-hidden group-hover:shadow-2xl transition-all duration-500 ${
                  verticalPosition === 1 ? 'scale-110' : ''
                }`}
                style={{
                  width: sizes[index].w,
                  height: sizes[index].h
                }}>
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
                  {/* Contenedor de la imagen */}
                  <div className="absolute inset-[8px] bg-white rounded-full overflow-hidden shadow-lg">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;

// Actualizar las animaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes orbit-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes orbit-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }

  @keyframes orbit-slower {
    from { transform: rotate(180deg); }
    to { transform: rotate(-180deg); }
  }

  .animate-orbit-slow {
    animation: orbit-slow 40s linear infinite;
  }

  .animate-orbit-reverse {
    animation: orbit-reverse 50s linear infinite;
  }

  .animate-orbit-slower {
    animation: orbit-slower 60s linear infinite;
  }

  /* Resto de las animaciones existentes */
  @keyframes spin-once {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .animate-spin-once {
    animation: spin-once 2s linear;
    animation-fill-mode: forwards;
  }

  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes spin-slow-reverse {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }

  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
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
  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-10px, 15px); }
    50% { transform: translate(10px, -15px); }
    75% { transform: translate(15px, 10px); }
  }

  @keyframes float-delayed {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(15px, -10px); }
    50% { transform: translate(-15px, 15px); }
    75% { transform: translate(-10px, -15px); }
  }

  @keyframes float-slow {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(-15px, 10px); }
    66% { transform: translate(10px, 15px); }
  }

  @keyframes float-slower {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(15px, -15px); }
    66% { transform: translate(-10px, -10px); }
  }

  @keyframes float-slowest {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-15px, 15px); }
  }

  .animate-float {
    animation: float 8s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float-delayed 9s ease-in-out infinite;
  }

  .animate-float-slow {
    animation: float-slow 10s ease-in-out infinite;
  }

  .animate-float-slower {
    animation: float-slower 11s ease-in-out infinite;
  }

  .animate-float-slowest {
    animation: float-slowest 12s ease-in-out infinite;
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
`;
document.head.appendChild(style);