import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import { useAuth } from '../context/AuthContext';
import { getFormularios } from '../services/formularioService';
import { getEventosWithStats } from '../services/eventoService';
import { getVoluntarios } from '../services/voluntarioService';
import { Formulario, Voluntario, EventoWithStats } from '../services/types';
import { FaClipboard, FaCalendarAlt, FaUsers, FaChartLine, FaStar } from 'react-icons/fa';
import GoBabyGo from '../assets/logo-babygo.png';

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
      className={`bg-white shadow-sm rounded-2xl p-6 border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:border-gray-200' : ''}`}
      onClick={onClick}
    >
      {/* Subtle background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className={`w-full h-full ${bgGradient} rounded-full transform translate-x-16 -translate-y-16`}></div>
      </div>
      
      {/* Header with icon */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgGradient} rounded-xl flex items-center justify-center shadow-sm`}>
          <div className="text-white text-lg">
            {icon}
          </div>
        </div>
        
        {/* Click indicator */}
        {onClick && (
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
      {isLoading ? (
          <div className="animate-pulse">
            <div className="h-10 w-20 bg-gray-200 rounded-lg shimmer"></div>
          </div>
      ) : (
          <div className="flex items-baseline space-x-2">
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
          </div>
      )}
      </div>
      
      {/* Bottom border accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
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

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Cargar datos
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch data in parallel
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

  // Calcular eventos próximos (fecha posterior a hoy)
  const proximosEventos = eventos.filter(evento => {
    const fechaEvento = new Date(evento.fecha_evento);
    const hoy = new Date();
    return fechaEvento >= hoy;
  });

  return (
    <Layout>
      <div className="flex-1 flex flex-col relative overflow-hidden bg-gray-50">
        <main className="flex-1 p-6 pt-8 overflow-auto relative z-10">
          {/* Enhanced welcome section */}
          <div className="mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Bienvenido, {user?.nombre || 'Administrador'}
          </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-24 h-24 flex items-center justify-center">
                    <img src={GoBabyGo} alt="Go Baby Go Logo" className="h-20 w-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 rounded-2xl shadow-lg modern-card">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-600 font-bold">!</span>
                </div>
              {error}
              </div>
            </div>
          )}

          {/* Enhanced dashboard cards with better spacing */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Panel de Control</h2>
              <div className="text-sm text-gray-500">Estadísticas en tiempo real</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
          </div>

          {/* Enhanced quick stats section */}
          {!isLoading && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Resumen Detallado</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Actualizado</span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Eventos</h3>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FaCalendarAlt className="text-white text-sm" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Eventos activos</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-purple-700 text-lg">{proximosEventos.length}</span>
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Total histórico</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700 text-lg">{eventos.length}</span>
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Comunidad</h3>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <FaUsers className="text-white text-sm" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Voluntarios registrados</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-orange-700 text-lg">{voluntarios.length}</span>
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Formularios disponibles</span>
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
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Dashboard;
