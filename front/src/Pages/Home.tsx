import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { getEventosWithStats } from '../services/eventoService';
import { EventoWithStats } from '../services/types';

const Home = () => {
  const [eventos, setEventos] = useState<EventoWithStats[]>([]);
  const [proximosEventos, setProximosEventos] = useState<EventoWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar eventos desde la API
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        const data = await getEventosWithStats();
        setEventos(data);
        
        // Filtrar eventos próximos (fecha posterior a hoy)
        const hoy = new Date();
        const eventosFuturos = data.filter(evento => {
          const fechaEvento = new Date(evento.fecha_evento);
          return fechaEvento >= hoy;
        });
        
        // Ordenar por fecha (los más próximos primero)
        eventosFuturos.sort((a, b) => {
          return new Date(a.fecha_evento).getTime() - new Date(b.fecha_evento).getTime();
        });
        
        setProximosEventos(eventosFuturos);
      } catch (err) {
        console.error('Error al cargar eventos:', err);
        // No mostrar error, solo log
        setProximosEventos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventos();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <main className="flex-grow flex flex-col items-center justify-center p-4 mx-auto max-w-4xl w-full">
        <h1 className="text-4xl font-recolecta medium text-blue-900 mb-30">El Comité</h1>
        
        <div className="space-y-5 w-full max-w-md">
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <FaSpinner className="animate-spin text-xl text-blue-600 mr-2" />
              <p className="text-gray-600">Cargando...</p>
            </div>
          ) : (
            <>
              {proximosEventos.length > 0 && (
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-2">Próximos eventos disponibles</p>
                  <p className="text-xs text-gray-500">Regístrate como voluntario para participar</p>
                </div>
              )}
              
              <Link 
                to={proximosEventos.length > 0 ? `/voluntario/registro/${proximosEventos[0].id}` : "/registro-voluntario"}
                className="w-90 h-13 block w-full bg-white- hover:bg-white text-blue font-medium py-3 px-4 rounded-lg text-center transition duration-200 border-2 border-blue-900"
              >
                Registrarse como Voluntario
              </Link>
              
              <Link 
                to="/login" 
                className="block w-full bg-white- hover:bg-white text-blue font-medium py-3 px-4 rounded-lg text-center transition duration-200 border-2 border-blue-900"
              >
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </main>

      <footer className="p-4 text-center text-gray-500 text-sm">
        <p>Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Home;