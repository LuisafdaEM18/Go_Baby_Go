import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaExclamationTriangle, FaCalendarAlt, FaCalendarPlus, FaMapMarkerAlt, FaClipboardList } from 'react-icons/fa';
import Layout from '../Components/Layout';
import { getEventoById, updateEvento } from '../services/eventoService';
import { getFormularios } from '../services/formularioService';
import { Evento, Formulario } from '../services/types';

const EditarEvento = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  
  const [formData, setFormData] = useState<Evento>({
    nombre: '',
    fecha_evento: '',
    lugar: '',
    descripcion: '',
    formulario_pre_evento: undefined,
    formulario_post_evento: undefined
  });

  // Formato de fecha para input date (YYYY-MM-DD)
  const formatFechaInput = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return fecha.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!id) {
      setError('No se proporcionó ID de evento');
      setCargando(false);
      return;
    }
    
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError('');
        
        // Cargar evento y formularios en paralelo
        const [eventoData, formulariosData] = await Promise.all([
          getEventoById(parseInt(id)),
          getFormularios()
        ]);
        
        setFormData({
          ...eventoData,
          fecha_evento: formatFechaInput(eventoData.fecha_evento)
        });
        
        setFormularios(formulariosData);
      } catch (err: any) {
        console.error('Error al cargar datos:', err);
        setError(`Error al cargar el evento: ${err.message || 'Error desconocido'}`);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'formulario_pre_evento' || name === 'formulario_post_evento') {
      // Convertir a número o undefined si está vacío
      const numValue = value ? parseInt(value) : undefined;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMostrarConfirmacion(true);
  };

  const confirmarActualizacion = async () => {
    if (!id) return;
    
    try {
      setGuardando(true);
      setError('');
      
      // Crear copia de los datos para enviar al backend
      const datosParaGuardar: Evento = {
        ...formData
      };
      
      await updateEvento(parseInt(id), datosParaGuardar);
      
      setMostrarConfirmacion(false);
      navigate('/eventos/gestionar', { state: { message: 'Evento actualizado correctamente' } });
    } catch (err: any) {
      console.error('Error al actualizar evento:', err);
      setError(`Error al guardar: ${err.message || 'Error desconocido'}`);
      setMostrarConfirmacion(false);
    } finally {
      setGuardando(false);
    }
  };

  const cancelarActualizacion = () => {
    setMostrarConfirmacion(false);
  };

  if (cargando) {
    return (
      <Layout>
        <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
            <p className="text-gray-700">Cargando evento...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen" style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.05) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(79, 70, 229, 0.05) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(37, 99, 235, 0.05) 0px, transparent 50%)
        `
      }}>
        <div className="max-w-4xl mx-auto p-4">
          {/* Header mejorado */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl transform rotate-1"></div>
            <div className="relative bg-white rounded-2xl p-4 shadow-xl border border-gray-100" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="text-center">
                <h1 className="text-xl font-bold mb-1" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                  Editar Evento
                </h1>
                <p className="text-sm text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  Modifica los detalles del evento
                </p>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-xl flex items-center shadow-md" style={{
                  background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(252, 231, 243, 0.9) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-100 mr-2">
                    <FaExclamationTriangle className="text-red-500 text-xs" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-800 text-xs" style={{ fontFamily: "'Recoleta Medium', serif" }}>Error</p>
                    <p className="text-red-700 text-xs" style={{ fontFamily: "'Recoleta Light', serif" }}>{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Formulario mejorado */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl transform rotate-1 blur-2xl"></div>
            <div className="relative bg-white/80 rounded-3xl p-8 shadow-xl border border-white/50" style={{
              backdropFilter: 'blur(20px)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)'
            }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{
                    background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)'
                  }}>
                    <FaCalendarAlt className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                    Información del evento
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                      Nombre del evento *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <FaCalendarPlus className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 transition-all duration-300"
                        style={{ 
                          fontFamily: "'Recoleta Light', serif",
                          backdropFilter: 'blur(8px)',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                        }}
                        placeholder="Ej: Evento de construcción de carritos"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                      Fecha del evento *
                    </label>
                    <input
                      type="date"
                      name="fecha_evento"
                      value={formData.fecha_evento}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 transition-all duration-300"
                      style={{ 
                        fontFamily: "'Recoleta Light', serif",
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                      }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                      Ubicación *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="lugar"
                        value={formData.lugar}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 transition-all duration-300"
                        style={{ 
                          fontFamily: "'Recoleta Light', serif",
                          backdropFilter: 'blur(8px)',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                        }}
                        placeholder="Dirección del evento"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                      Descripción *
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 transition-all duration-300 resize-none"
                      style={{ 
                        fontFamily: "'Recoleta Light', serif",
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                      }}
                      placeholder="Describe los objetivos y actividades del evento"
                      required
                    />
                  </div>
                </div>

                {/* Formularios asociados */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{
                      background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)'
                    }}>
                      <FaClipboardList className="text-white text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                      Formularios asociados
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                        Formulario pre-evento *
                      </label>
                      <select
                        name="formulario_pre_evento"
                        value={formData.formulario_pre_evento || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 transition-all duration-300"
                        style={{ 
                          fontFamily: "'Recoleta Light', serif",
                          backdropFilter: 'blur(8px)',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                        }}
                        required
                      >
                        <option value="">Seleccionar formulario pre-evento</option>
                        {formularios.map(form => (
                          <option key={`pre-${form.id}`} value={form.id}>
                            {form.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                        Formulario post-evento *
                      </label>
                      <select
                        name="formulario_post_evento"
                        value={formData.formulario_post_evento || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 transition-all duration-300"
                        style={{ 
                          fontFamily: "'Recoleta Light', serif",
                          backdropFilter: 'blur(8px)',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                        }}
                        required
                      >
                        <option value="">Seleccionar formulario post-evento</option>
                        {formularios.map(form => (
                          <option key={`post-${form.id}`} value={form.id}>
                            {form.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Botones de acción mejorados */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400/10 to-slate-400/10 rounded-3xl transform -rotate-1 blur-xl"></div>
            <div className="relative bg-white/90 rounded-3xl p-6 shadow-2xl border border-white/50" style={{
              backdropFilter: 'blur(20px)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
            }}>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => navigate('/eventos/gestionar')}
                  className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2"
                  style={{
                    backgroundColor: 'white',
                    color: '#1e3766',
                    borderColor: '#1e3766',
                    fontFamily: "'Recoleta Medium', serif",
                    boxShadow: '0 4px 6px -1px rgba(30, 55, 102, 0.1), 0 2px 4px -1px rgba(30, 55, 102, 0.05)'
                  }}
                >
                  ← Cancelar
                </button>
                
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center"
                  style={{
                    background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                    color: 'white',
                    fontFamily: "'Recoleta Medium', serif",
                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)'
                  }}
                  disabled={guardando}
                >
                  {guardando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-3" />
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación mejorado */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-gradient-to-br from-white/80 via-blue-50/90 to-gray-100/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaSave className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                  Confirmar cambios
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  ¿Estás seguro de que deseas guardar los cambios en este evento?
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={cancelarActualizacion}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 border-2"
                  style={{
                    backgroundColor: 'white',
                    color: '#1e3766',
                    borderColor: '#1e3766',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarActualizacion}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                    color: 'white',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                  disabled={guardando}
                >
                  {guardando ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Confirmar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EditarEvento;    