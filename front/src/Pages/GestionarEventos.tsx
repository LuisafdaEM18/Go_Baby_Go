import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaExclamationCircle, FaCalendarPlus, FaExclamationTriangle, FaUsers, FaTimes, FaEye, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Layout from '../Components/Layout';
import { getEventosWithStats, deleteEvento } from '../services/eventoService';
import { getInscripcionesDetalladas } from '../services/voluntarioService';
import { EventoWithStats, InscripcionDetallada } from '../services/types';
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

  // Estados para modal de voluntarios
  const [mostrarVoluntarios, setMostrarVoluntarios] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoWithStats | null>(null);
  const [inscripciones, setInscripciones] = useState<InscripcionDetallada[]>([]);
  const [loadingVoluntarios, setLoadingVoluntarios] = useState(false);

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

  // Funciones para modal de voluntarios
  const abrirModalVoluntarios = async (evento: EventoWithStats) => {
    setEventoSeleccionado(evento);
    setMostrarVoluntarios(true);
    setLoadingVoluntarios(true);
    
    try {
      const inscripcionesData = await getInscripcionesDetalladas(evento.id!);
      setInscripciones(inscripcionesData);
    } catch (err) {
      console.error('Error al cargar voluntarios:', err);
      setError('Error al cargar los voluntarios del evento');
    } finally {
      setLoadingVoluntarios(false);
    }
  };

  const cerrarModalVoluntarios = () => {
    setMostrarVoluntarios(false);
    setEventoSeleccionado(null);
    setInscripciones([]);
  };

  return (
    <Layout>
      <div className="min-h-screen" style={{ 
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 25%, rgba(241, 245, 249, 0.85) 75%, rgba(226, 232, 240, 0.9) 100%)'
      }}>
        <div className="max-w-7xl mx-auto p-6">
          {/* Header mejorado */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl transform rotate-1"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e3766' }}>
                    <FaCalendarAlt className="text-white text-2xl" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold mb-2" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                  Gestión de Eventos
                </h1>
                <p className="text-xl text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  Administra y organiza todos los eventos de Go Baby Go
                </p>
              </div>

              {error && (
                <div className="mt-6 p-6 rounded-2xl flex items-center shadow-lg" style={{
                  background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(252, 231, 243, 0.9) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 mr-4">
                    <FaExclamationTriangle className="text-red-500 text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-800" style={{ fontFamily: "'Recoleta Medium', serif" }}>Error</p>
                    <p className="text-red-700 text-sm" style={{ fontFamily: "'Recoleta Light', serif" }}>{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel de búsqueda y filtros mejorado */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl transform -rotate-1"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-gray-100" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(241, 245, 249, 0.98) 100%)',
              backdropFilter: 'blur(15px)'
            }}>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <FaSearch className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar eventos por nombre..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    style={{ fontFamily: "'Recoleta Light', serif" }}
                    value={terminoBusqueda}
                    onChange={handleBuscar}
                  />
                </div>
                
                <button
                  onClick={() => navigate('/eventos/crear')}
                  className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                    color: 'white',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                  disabled={isLoading}
                >
                  <FaCalendarPlus className="mr-3" />
                  Nuevo evento
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500 bg-gradient-to-r from-gray-100 to-blue-50 px-4 py-2 rounded-xl" style={{ fontFamily: "'Recoleta Light', serif" }}>
                    <span className="font-semibold">Total:</span> {eventosFiltrados.length} evento{eventosFiltrados.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de eventos mejorado */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="bg-white rounded-3xl p-16 shadow-2xl border border-gray-100 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#1e3766' }}>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                  <p className="text-gray-600 text-xl font-medium" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                    Cargando eventos...
                  </p>
                </div>
              </div>
            ) : eventosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {eventosFiltrados.map((evento) => {
                  const estado = getEstadoEvento(evento);
                  return (
                    <div key={evento.id} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                      <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 transform group-hover:-translate-y-2 transition-all duration-300" style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        {/* Header de la tarjeta */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e3766' }}>
                              <FaCalendarAlt className="text-white text-lg" />
                            </div>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${estado.clase}`} style={{ fontFamily: "'Recoleta Medium', serif" }}>
                              {estado.label}
                            </span>
                          </div>
                        </div>

                        {/* Contenido principal */}
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-gray-900 leading-tight" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                            {evento.nombre}
                          </h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <FaCalendarAlt className="text-gray-400 text-sm" />
                              <span className="text-gray-600 text-sm" style={{ fontFamily: "'Recoleta Light', serif" }}>
                                {formatFecha(evento.fecha_evento)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <FaMapMarkerAlt className="text-gray-400 text-sm" />
                              <span className="text-gray-600 text-sm truncate" style={{ fontFamily: "'Recoleta Light', serif" }}>
                                {evento.lugar}
                              </span>
                            </div>
                            
                            {evento.descripcion && (
                              <p className="text-gray-600 text-sm line-clamp-2" style={{ fontFamily: "'Recoleta Light', serif" }}>
                                {evento.descripcion}
                              </p>
                            )}
                          </div>

                          {/* Voluntarios */}
                          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl">
                            <button
                              onClick={() => abrirModalVoluntarios(evento)}
                              className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-blue-700 transition-all duration-200"
                              style={{ fontFamily: "'Recoleta Medium', serif" }}
                            >
                              <div className="flex items-center space-x-2">
                                <FaUsers className="text-blue-600" />
                                <span>Voluntarios</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                                  {evento.voluntarios_aceptados}/{evento.total_voluntarios}
                                </span>
                                <FaEye className="text-gray-400" />
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleEdit(evento.id!)}
                            className="p-3 rounded-xl text-blue-600 hover:text-blue-900 hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Editar evento"
                            disabled={isLoading}
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => solicitarEliminacion(evento.id!)}
                            className="p-3 rounded-xl text-red-600 hover:text-red-900 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Eliminar evento"
                            disabled={isLoading}
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 shadow-2xl border border-gray-100 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gray-100">
                    <FaExclamationCircle className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                    No se encontraron eventos
                  </h3>
                  {terminoBusqueda ? (
                    <div className="space-y-4">
                      <p className="text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                        No hay eventos que coincidan con "<strong>{terminoBusqueda}</strong>"
                      </p>
                      <button 
                        onClick={() => {
                          setTerminoBusqueda('');
                          setEventosFiltrados(eventosOriginales);
                        }}
                        className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                        style={{
                          backgroundColor: '#1e3766',
                          color: 'white',
                          fontFamily: "'Recoleta Medium', serif"
                        }}
                      >
                        Mostrar todos los eventos
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                        Crea tu primer evento para comenzar
                      </p>
                      <button
                        onClick={() => navigate('/eventos/crear')}
                        className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg hover:shadow-xl"
                        style={{
                          background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                          color: 'white',
                          fontFamily: "'Recoleta Medium', serif"
                        }}
                      >
                        <FaCalendarPlus className="mr-3" />
                        Crear primer evento
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación mejorado */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-gradient-to-br from-white/80 via-blue-50/90 to-gray-100/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaTrash className="text-3xl text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                  Confirmar eliminación
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  ¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={cancelarEliminacion}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 border-2"
                  style={{
                    backgroundColor: 'white',
                    color: '#1e3766',
                    borderColor: '#1e3766',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    color: 'white',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Eliminar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de voluntarios mejorado */}
      {mostrarVoluntarios && eventoSeleccionado && (
        <div className="fixed inset-0 bg-gradient-to-br from-white/80 via-blue-50/90 to-gray-100/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                    Voluntarios: {eventoSeleccionado.nombre}
                  </h2>
                  <div className="flex items-center space-x-6" style={{ fontFamily: "'Recoleta Light', serif" }}>
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span className="text-gray-600">
                        {new Date(eventoSeleccionado.fecha_evento).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaUsers className="text-blue-600" />
                      <span className="text-gray-600">
                        Total inscritos: <strong>{eventoSeleccionado.total_voluntarios}</strong>
                      </span>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Aceptados: {eventoSeleccionado.voluntarios_aceptados}
                    </span>
                  </div>
                </div>
                <button
                  onClick={cerrarModalVoluntarios}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  title="Cerrar"
                >
                  <FaTimes className="text-2xl text-gray-500" />
                </button>
              </div>
              
              {loadingVoluntarios ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#1e3766' }}>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                    <p className="text-gray-600 text-xl" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                      Cargando voluntarios...
                    </p>
                  </div>
                </div>
              ) : inscripciones.length > 0 ? (
                <div className="space-y-6">
                  {inscripciones.map((inscripcion) => (
                    <div key={inscripcion.id} className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl transform rotate-1"></div>
                      <div className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e3766' }}>
                                <span className="text-white font-bold text-lg">
                                  {inscripcion.voluntario.nombre.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                                  {inscripcion.voluntario.nombre}
                                </h3>
                                <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                                  inscripcion.aceptado 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {inscripcion.aceptado ? 'Aceptado' : 'Pendiente'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" style={{ fontFamily: "'Recoleta Light', serif" }}>
                              <div className="bg-gray-50 p-3 rounded-xl">
                                <span className="font-medium text-gray-700">Email:</span>
                                <p className="text-gray-600">{inscripcion.voluntario.correo}</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl">
                                <span className="font-medium text-gray-700">Identificación:</span>
                                <p className="text-gray-600">{inscripcion.voluntario.numero_identificacion}</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl">
                                <span className="font-medium text-gray-700">Fecha inscripción:</span>
                                <p className="text-gray-600">{new Date(inscripcion.fecha_inscripcion).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Respuestas al formulario pre-evento */}
                        {inscripcion.respuestas_pre && inscripcion.respuestas_pre.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                              <FaEye className="mr-3 text-blue-600" />
                              Respuestas al formulario
                            </h4>
                            <div className="space-y-4">
                              {inscripcion.respuestas_pre.map((respuesta, index) => (
                                <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-200">
                                  <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                                        {index + 1}
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                                        {respuesta.pregunta_texto}
                                      </h5>
                                      <div className="text-sm text-gray-700" style={{ fontFamily: "'Recoleta Light', serif" }}>
                                        {respuesta.tipo_pregunta === 'textual' && respuesta.respuesta_texto && (
                                          <div className="bg-white p-3 rounded-xl border border-gray-200">
                                            <p className="italic">"{respuesta.respuesta_texto}"</p>
                                          </div>
                                        )}
                                        {(respuesta.tipo_pregunta === 'seleccion_unica' || respuesta.tipo_pregunta === 'seleccion_multiple') && respuesta.opciones_seleccionadas && (
                                          <div className="space-y-2">
                                            {respuesta.opciones_seleccionadas.map((opcion, opcionIndex) => (
                                              <div key={opcionIndex} className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-gray-200">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                <span>{opcion}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {!inscripcion.respuestas_pre || inscripcion.respuestas_pre.length === 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 italic text-center p-4 bg-gray-50 rounded-xl" style={{ fontFamily: "'Recoleta Light', serif" }}>
                              No se encontraron respuestas al formulario pre-evento
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-100">
                    <FaExclamationCircle className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                    No hay voluntarios inscritos
                  </h3>
                  <p className="text-gray-500 text-lg" style={{ fontFamily: "'Recoleta Light', serif" }}>
                    Aún no se han registrado voluntarios para este evento
                  </p>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={cerrarModalVoluntarios}
                  className="px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{
                    backgroundColor: '#1e3766',
                    color: 'white',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default GestionarEventos;
