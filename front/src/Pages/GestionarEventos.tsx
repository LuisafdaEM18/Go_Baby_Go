import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaExclamationCircle } from 'react-icons/fa';
import Layout from '../Components/Layout';
import { getEventosWithStats, deleteEvento } from '../services/eventoService';
import { EventoWithStats } from '../services/types';
import { isAdmin } from '../services/authService';

const GestionarEventos = () => {
  const navigate = useNavigate();
  const [eventosOriginales, setEventosOriginales] = useState<EventoWithStats[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<EventoWithStats[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticación
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
    }
  }, [navigate]);

  // Cargar eventos
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getEventosWithStats();
        setEventosOriginales(data);
        setEventosFiltrados(data);
      } catch (err) {
        console.error('Error al cargar eventos:', err);
        setError('Error al cargar los eventos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAdmin()) {
      fetchEventos();
    }
  }, []);

  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setTerminoBusqueda(valor);
    
    if (valor === '') {
      setEventosFiltrados(eventosOriginales);
      return;
    }
    
    const filtrados = eventosOriginales.filter(evento =>
      evento.nombre.toLowerCase().includes(valor.toLowerCase())
    );
    
    setEventosFiltrados(filtrados);
  };

  const handleDelete = async () => {
    if (eventoAEliminar) {
      try {
        setIsLoading(true);
        await deleteEvento(eventoAEliminar);
        
        // Actualizar estado local después de eliminar
        const nuevosEventos = eventosOriginales.filter(evento => evento.id !== eventoAEliminar);
        setEventosOriginales(nuevosEventos);
        setEventosFiltrados(nuevosEventos);
      } catch (err) {
        console.error('Error al eliminar evento:', err);
        setError('Error al eliminar el evento. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsLoading(false);
        setMostrarConfirmacion(false);
        setEventoAEliminar(null);
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/eventos/editar/${id}`);
  };

  const solicitarEliminacion = (id: number) => {
    setEventoAEliminar(id);
    setMostrarConfirmacion(true);
  };

  const cancelarEliminacion = () => {
    setMostrarConfirmacion(false);
    setEventoAEliminar(null);
  };
  
  // Formatear fecha para mostrar
  const formatFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Determinar estado del evento
  const getEstadoEvento = (evento: EventoWithStats) => {
    const fechaEvento = new Date(evento.fecha_evento);
    const hoy = new Date();
    
    if (fechaEvento < hoy) {
      return { label: 'completado', clase: 'bg-blue-100 text-blue-800' };
    } else if (fechaEvento.getTime() - hoy.getTime() < 7 * 24 * 60 * 60 * 1000) { // menos de 7 días
      return { label: 'próximo', clase: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'activo', clase: 'bg-green-100 text-green-800' };
    }
  };

  return (
    <Layout>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={terminoBusqueda}
                onChange={handleBuscar}
              />
            </div>
            <button
              onClick={() => navigate('/eventos/crear')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              Nuevo Evento
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voluntarios</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900"></div>
                      </div>
                      <p className="mt-2 text-gray-500">Cargando eventos...</p>
                    </td>
                  </tr>
                ) : eventosFiltrados.length > 0 ? (
                  eventosFiltrados.map((evento) => {
                    const estado = getEstadoEvento(evento);
                    return (
                      <tr key={evento.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{evento.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatFecha(evento.fecha_evento)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evento.lugar}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${estado.clase}`}>
                            {estado.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {evento.voluntarios_aceptados} / {evento.total_voluntarios}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(evento.id!)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            disabled={isLoading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => solicitarEliminacion(evento.id!)}
                            className="text-red-600 hover:text-red-900"
                            disabled={isLoading}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FaExclamationCircle className="text-2xl mb-2" />
                        <p>No se encontraron eventos con ese nombre</p>
                        <button 
                          onClick={() => {
                            setTerminoBusqueda('');
                            setEventosFiltrados(eventosOriginales);
                          }}
                          className="mt-2 text-blue-600 hover:text-blue-800"
                        >
                          Mostrar todos los eventos
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {mostrarConfirmacion && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirmar eliminación</h3>
            <p className="mb-6">¿Estás seguro que deseas eliminar este evento? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelarEliminacion}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default GestionarEventos;
