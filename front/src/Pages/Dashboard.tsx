import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import { useAuth } from '../context/AuthContext';
import { getFormularios } from '../services/formularioService';
import { getEventosWithStats } from '../services/eventoService';
import { getVoluntarios } from '../services/voluntarioService';
import { Formulario, Evento, Voluntario, EventoWithStats } from '../services/types';

interface DashboardCardProps {
  title: string;
  value: string | number;
  borderColor: string;
  textColor: string;
  isLoading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, borderColor, textColor, isLoading = false }) => {
  return (
    <div className={`bg-white shadow-md rounded-2xl p-5 border-l-4 ${borderColor}`}>
      <h2 className="text-gray-500 text-sm font-semibold">{title}</h2>
      {isLoading ? (
        <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-2"></div>
      ) : (
        <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
      )}
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
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 overflow-auto ">
          <h1 className="text-2xl font-medium text-blue-900 mb-8">
            Bienvenido, {user?.nombre || 'Administrador'}
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Tarjetas del dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Formularios Creados"
              value={formularios.length}
              borderColor="border-blue-600"
              textColor="text-blue-800"
              isLoading={isLoading}
            />
            <DashboardCard
              title="Próximos Eventos"
              value={proximosEventos.length}
              borderColor="border-green-600"
              textColor="text-green-800"
              isLoading={isLoading}
            />
            <DashboardCard
              title="Total Voluntarios"
              value={voluntarios.length}
              borderColor="border-orange-600"
              textColor="text-orange-600"
              isLoading={isLoading}
            />
            <DashboardCard
              title="Eventos Totales"
              value={eventos.length}
              borderColor="border-purple-600"
              textColor="text-purple-600"
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Dashboard;
