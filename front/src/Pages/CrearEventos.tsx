import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaExclamationTriangle, FaCalendarPlus, FaMapMarkerAlt, FaFileAlt, FaClipboardList } from 'react-icons/fa';
import Layout from '../Components/Layout'; 
import { getFormularios } from '../services/formularioService';
import { createEvento } from '../services/eventoService';
import { Formulario } from '../services/types';
import { isAdmin } from '../services/authService';

const CrearEventos = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_evento: '',
    lugar: '',
    descripcion: '',
    formulario_pre_evento: '',
    formulario_post_evento: ''
  });
  
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
    }
  }, [navigate]);

  // Cargar formularios disponibles
  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        setIsLoading(true);
        const data = await getFormularios();
        setFormularios(data);
      } catch (err: any) {
        console.error('Error al cargar formularios:', err);
        setError('Error al cargar los formularios disponibles.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormularios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setError('El nombre del evento es obligatorio');
      return;
    }
    if (!formData.fecha_evento) {
      setError('La fecha del evento es obligatoria');
      return;
    }
    
    const fechaEvento = new Date(formData.fecha_evento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaEvento < hoy) {
      setError('La fecha del evento debe ser posterior a la fecha actual');
      return;
    }
    
    if (!formData.lugar.trim()) {
      setError('La ubicación del evento es obligatoria');
      return;
    }
    
    if (!formData.formulario_pre_evento) {
      setError('El formulario pre-evento es obligatorio');
      return;
    }
    
    if (!formData.formulario_post_evento) {
      setError('El formulario post-evento es obligatorio');
      return;
    }
    
    setError(null);
    setMostrarConfirmacion(true);
  };

  const confirmarCreacion = async () => {
    try {
      setIsSaving(true);
      
      // Crear objeto para enviar al backend
      const eventoData = {
        ...formData,
        formulario_pre_evento: formData.formulario_pre_evento ? parseInt(formData.formulario_pre_evento) : undefined,
        formulario_post_evento: formData.formulario_post_evento ? parseInt(formData.formulario_post_evento) : undefined
      };
      
      await createEvento(eventoData);
      navigate('/eventos/gestionar', { state: { message: 'Evento creado correctamente' } });
    } catch (err: any) {
      console.error('Error al crear evento:', err);
      setError(`Error al crear el evento: ${err.message || 'Error desconocido'}`);
      setMostrarConfirmacion(false);
    } finally {
      setIsSaving(false);
    }
  };

  const cancelarCreacion = () => {
    setMostrarConfirmacion(false);
  };

  return (
    <Layout>
      <div className="min-h-screen" style={{ 
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 25%, rgba(241, 245, 249, 0.85) 75%, rgba(226, 232, 240, 0.9) 100%)'
      }}>
        <div className="max-w-5xl mx-auto p-6">
          {/* Header mejorado */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl transform rotate-1"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e3766' }}>
                    <FaCalendarPlus className="text-white text-2xl" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold mb-2" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                  Crear Evento
                </h1>
                <p className="text-xl text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  Organiza un nuevo evento de Go Baby Go y configura todos sus detalles
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

          {/* Formulario mejorado */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl transform -rotate-1"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(241, 245, 249, 0.98) 100%)',
              backdropFilter: 'blur(15px)'
            }}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Información básica */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1e3766' }}>
                      <FaFileAlt className="text-white text-lg" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
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
                          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                          style={{ fontFamily: "'Recoleta Light', serif" }}
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
                        className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                        style={{ fontFamily: "'Recoleta Light', serif" }}
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
                          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                          style={{ fontFamily: "'Recoleta Light', serif" }}
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
                        className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md resize-none"
                        style={{ fontFamily: "'Recoleta Light', serif" }}
                        placeholder="Describe los objetivos y actividades del evento"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Formularios */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1e3766' }}>
                      <FaClipboardList className="text-white text-lg" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
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
                        value={formData.formulario_pre_evento}
                        onChange={handleChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                        style={{ fontFamily: "'Recoleta Light', serif" }}
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
                        value={formData.formulario_post_evento}
                        onChange={handleChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                        style={{ fontFamily: "'Recoleta Light', serif" }}
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
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-3xl transform rotate-1"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-gray-100" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => navigate('/eventos/gestionar')}
                  className="px-8 py-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 border-2"
                  style={{
                    backgroundColor: 'white',
                    color: '#1e3766',
                    borderColor: '#1e3766',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                >
                  ← Cancelar
                </button>
                
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                    color: 'white',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                  disabled={isLoading || isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-3" />
                      Crear evento
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
                  Confirmar creación
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  ¿Estás seguro de que deseas crear este evento?
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={cancelarCreacion}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 border-2"
                  style={{
                    backgroundColor: 'white',
                    color: '#1e3766',
                    borderColor: '#1e3766',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarCreacion}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                    color: 'white',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                  disabled={isSaving}
                >
                  {isSaving ? (
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

export default CrearEventos;