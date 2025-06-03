import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import { useAuth } from '../context/AuthContext';
import { getFormularios } from '../services/formularioService';
import { getEventosWithStats } from '../services/eventoService';
import { getVoluntarios } from '../services/voluntarioService';
import { Formulario, Voluntario, EventoWithStats } from '../services/types';
import { FaClipboard, FaCalendarAlt, FaUsers, FaChartLine, FaStar, FaHandsHelping, FaChild } from 'react-icons/fa';
import logoBabyGo from '../assets/Logo-Go-baby-Go-2024-02-1.png';

interface DashboardCardProps {
  title: string;
  value: string | number;
  borderColor: string;
  textColor: string;
  bgGradient: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  borderColor, 
  textColor, 
  bgGradient,
  icon,
  isLoading = false,
  onClick
}) => {
  return (
    <div 
      className={`relative overflow-hidden group hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
      onClick={onClick}
    >
      {/* Card container with glassmorphism effect */}
      <div className="relative bg-white/80 rounded-2xl p-6 border border-white/50 backdrop-blur-sm">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon container */}
          <div className={`w-14 h-14 ${bgGradient} rounded-2xl flex items-center justify-center shadow-lg mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white text-xl">
              {icon}
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Recoleta Medium', serif" }}>
            {title}
          </h3>
          
          {/* Value */}
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-10 w-20 bg-gray-200 rounded-lg shimmer"></div>
            </div>
          ) : (
            <div className="flex items-baseline space-x-2">
              <p className={`text-3xl font-bold ${textColor}`} style={{ fontFamily: "'Recoleta Bold', serif" }}>
                {value}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Hover effect border */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [eventos, setEventos] = useState<EventoWithStats[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [formulariosData, eventosData, voluntariosData] = await Promise.all([
          getFormularios(),
          getEventosWithStats(),
          getVoluntarios()
        ]);
        
        setFormularios(formulariosData);
        setEventos(eventosData);
        setVoluntarios(voluntariosData);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const proximosEventos = eventos.filter(evento => {
    const fechaEvento = new Date(evento.fecha_evento);
    const hoy = new Date();
    return fechaEvento >= hoy;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff]/80 via-[#e6f1ff]/70 to-[#dce9ff]/60 overflow-hidden flex flex-col">
        {/* Elementos decorativos sutiles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-indigo-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tl from-blue-500/10 via-indigo-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header fijo */}
        <div className="relative z-20">
          {/* Welcome Section */}
          <div className="p-6">
            <div className="relative">
              <div className="relative rounded-2xl p-6 shadow-xl overflow-hidden" style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.7)'
              }}>
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/30"></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: '#1e3766', fontFamily: "'Recoleta Bold', serif" }}>
                      Bienvenido, {user?.nombre || 'Administrador'}
                    </h1>
                    <p className="text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                      Panel de control y estadísticas
                    </p>
                  </div>
                  <div className="hidden md:flex items-center space-x-2">
                    <div className="w-24 h-24 flex items-center justify-center">
                      <img src={logoBabyGo} alt="Go Baby Go Logo" className="w-20 h-20 object-contain" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 rounded-xl flex items-center shadow-md bg-white/90 backdrop-blur-sm" style={{
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-100 mr-2">
                      <FaChartLine className="text-red-500 text-xs" />
                    </div>
                    <p className="text-red-700 text-sm" style={{ fontFamily: "'Recoleta Light', serif" }}>{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                title="Formularios Creados"
                value={formularios.length}
                borderColor="border-blue-500"
                textColor="text-blue-700"
                bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
                icon={<FaClipboard />}
                isLoading={isLoading}
                onClick={() => navigate('/formularios/gestionar')}
              />
              <DashboardCard
                title="Próximos Eventos"
                value={proximosEventos.length}
                borderColor="border-green-500"
                textColor="text-green-700"
                bgGradient="bg-gradient-to-br from-green-500 to-green-600"
                icon={<FaCalendarAlt />}
                isLoading={isLoading}
                onClick={() => navigate('/eventos/gestionar')}
              />
              <DashboardCard
                title="Total Voluntarios"
                value={voluntarios.length}
                borderColor="border-orange-500"
                textColor="text-orange-600"
                bgGradient="bg-gradient-to-br from-orange-500 to-orange-600"
                icon={<FaUsers />}
                isLoading={isLoading}
                onClick={() => {
                  const goBabyGoEvent = eventos.find(evento => 
                    evento.nombre.toLowerCase().includes('go baby go') && 
                    new Date(evento.fecha_evento) >= new Date()
                  );
                  navigate('/eventos/gestionar', { 
                    state: { 
                      showVolunteers: true,
                      eventId: goBabyGoEvent?.id 
                    }
                  });
                }}
              />
              <DashboardCard
                title="Eventos Totales"
                value={eventos.length}
                borderColor="border-purple-500"
                textColor="text-purple-600"
                bgGradient="bg-gradient-to-br from-purple-500 to-purple-600"
                icon={<FaCalendarAlt />}
                isLoading={isLoading}
                onClick={() => navigate('/eventos/gestionar')}
              />
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Eventos Stats */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl transform rotate-1 blur-xl"></div>
                <div className="relative bg-white/90 rounded-2xl p-8 shadow-xl border border-white/50" style={{
                  backdropFilter: 'blur(20px)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
                }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                      Eventos
                    </h3>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{
                      background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)'
                    }}>
                      <FaCalendarAlt className="text-white text-lg" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium" style={{ fontFamily: "'Recoleta Light', serif" }}>Eventos activos</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-purple-700 text-lg">{proximosEventos.length}</span>
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600 font-medium" style={{ fontFamily: "'Recoleta Light', serif" }}>Total histórico</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700 text-lg">{eventos.length}</span>
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comunidad Stats */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 blur-xl"></div>
                <div className="relative bg-white/90 rounded-2xl p-8 shadow-xl border border-white/50" style={{
                  backdropFilter: 'blur(20px)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
                }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                      Comunidad
                    </h3>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{
                      background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)'
                    }}>
                      <FaUsers className="text-white text-lg" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium" style={{ fontFamily: "'Recoleta Light', serif" }}>Voluntarios registrados</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-orange-700 text-lg">{voluntarios.length}</span>
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600 font-medium" style={{ fontFamily: "'Recoleta Light', serif" }}>Formularios disponibles</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700 text-lg">{formularios.length}</span>
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animations */}
        <style>
          {`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }

            .shimmer {
              position: relative;
              overflow: hidden;
            }

            .shimmer::after {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.6) 50%,
                rgba(255, 255, 255, 0) 100%
              );
              animation: shimmer 2s infinite;
            }
          `}
        </style>
      </div>
    </Layout>
  );
};

export default Dashboard;
