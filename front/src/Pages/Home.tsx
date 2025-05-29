import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHandsHelping, FaUserShield, FaArrowRight, FaChild, FaCar, FaCalendarAlt } from 'react-icons/fa';
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

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 25%, rgba(241, 245, 249, 0.85) 75%, rgba(226, 232, 240, 0.9) 100%)'
    }}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Logo watermark */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] -mr-40 mt-[-100px] opacity-[0.05] pointer-events-none">
          <img 
            src={logoBabyGo} 
            alt="" 
            className="w-full h-full object-contain"
            style={{ filter: 'brightness(2)' }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header mejorado */}
            <div className="relative mb-16">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e3766] to-[#2563eb] rounded-3xl transform rotate-1"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100" style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                backdropFilter: 'blur(10px)'
              }}>
                <div className="text-center">
                  <h1 
                    className="text-5xl md:text-6xl lg:text-7xl mb-6"
                    style={{ 
                      fontFamily: "'Recoleta SemiBold', serif",
                      color: '#1e3766'
                    }}
                  >
                    Go Baby Go
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Recoleta', serif" }}>
                    Transformando la movilidad infantil a través de la innovación y el compromiso social
                  </p>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl transform -rotate-1"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 transform hover:-translate-y-1 transition-all duration-300" style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(241, 245, 249, 0.98) 100%)',
                  backdropFilter: 'blur(15px)'
                }}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 shadow-sm">
                      <FaChild className="text-blue-600 text-xl" />
                    </div>
                    <h3 className="text-2xl font-semibold" style={{ color: '#1e3766', fontFamily: "'Recoleta SemiBold', serif" }}>
                      Impacto en la Comunidad
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Recoleta Light', serif" }}>
                    Nuestro programa ha transformado la vida de numerosos niños, brindándoles independencia y alegría a través de la movilidad adaptada.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl transform rotate-1"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 transform hover:-translate-y-1 transition-all duration-300" style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(241, 245, 249, 0.98) 100%)',
                  backdropFilter: 'blur(15px)'
                }}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 shadow-sm">
                      <FaCar className="text-green-600 text-xl" />
                    </div>
                    <h3 className="text-2xl font-semibold" style={{ color: '#1e3766', fontFamily: "'Recoleta SemiBold', serif" }}>
                      Innovación en Movilidad
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Recoleta Light', serif" }}>
                    Adaptamos vehículos eléctricos con tecnología de punta para satisfacer las necesidades específicas de cada niño.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e3766] to-[#2563eb] rounded-3xl transform -rotate-1 opacity-80"></div>
                <Link 
                  to={proximosEventos.length > 0 ? `/voluntario/registro/${proximosEventos[0].id}` : "/registro-voluntario"}
                  className="relative block bg-white/90 rounded-3xl p-8 shadow-lg hover:shadow-xl border-[0.5px] border-gray-200 transform hover:-translate-y-1 transition-all duration-300"
                  style={{
                    backdropFilter: 'blur(15px)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 shadow-sm">
                        <FaHandsHelping className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold mb-2" style={{ color: '#1e3766', fontFamily: "'Recoleta SemiBold', serif" }}>
                          Únete como Voluntario
                        </h3>
                        <p className="text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                          Sé parte del cambio y ayuda a transformar vidas
                        </p>
                      </div>
                    </div>
                    <FaArrowRight className="text-[#1e3766] text-xl transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e3766] to-[#2563eb] rounded-3xl transform rotate-1 opacity-80"></div>
                <Link 
                  to="/login"
                  className="relative block bg-white/90 rounded-3xl p-8 shadow-lg hover:shadow-xl border-[0.5px] border-gray-200 transform hover:-translate-y-1 transition-all duration-300"
                  style={{
                    backdropFilter: 'blur(15px)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 shadow-sm">
                        <FaUserShield className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold mb-2" style={{ color: '#1e3766', fontFamily: "'Recoleta SemiBold', serif" }}>
                          Acceso Administrativo
                        </h3>
                        <p className="text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                          Gestiona y coordina las actividades
                        </p>
                      </div>
                    </div>
                    <FaArrowRight className="text-[#1e3766] text-xl transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

// Estilos globales
const style = document.createElement('style');
style.textContent = `
  .bg-grid-pattern {
    background-image: radial-gradient(circle, #ffffff 1px, transparent 1px);
    background-size: 24px 24px;
  }
`;
document.head.appendChild(style);
