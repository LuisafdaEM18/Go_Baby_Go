import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaExclamationTriangle } from 'react-icons/fa';
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-blue-900 mb-2">Editar Evento</h1>
              <p className="text-gray-600">Modifica la información del evento seleccionado</p>
            </div>

            {error && (
              <div className="mt-6 p-4 text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center">
                <FaExclamationTriangle className="mr-3 text-red-500" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>
          
          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Evento</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Ingresa el nombre del evento"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha del Evento</label>
                  <input
                    type="date"
                    name="fecha_evento"
                    value={formData.fecha_evento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación</label>
                  <input
                    type="text"
                    name="lugar"
                    value={formData.lugar}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Ingresa la ubicación del evento"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    placeholder="Describe el evento y sus objetivos"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Formulario Pre-Evento</label>
                    <select
                      name="formulario_pre_evento"
                      value={formData.formulario_pre_evento || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">Sin formulario pre-evento</option>
                      {formularios.map(form => (
                        <option key={`pre-${form.id}`} value={form.id}>
                          {form.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Formulario Post-Evento</label>
                    <select
                      name="formulario_post_evento"
                      value={formData.formulario_post_evento || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">Sin formulario post-evento</option>
                      {formularios.map(form => (
                        <option key={`post-${form.id}`} value={form.id}>
                          {form.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/eventos/gestionar')}
                    className="form-button-secondary px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="form-button-primary px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                    disabled={guardando}
                  >
                    <FaSave className="mr-2" />
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de confirmación mejorado */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-gradient-to-br from-white/80 via-blue-50/90 to-gray-100/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSave className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar actualización</h3>
                <p className="text-gray-600">
                  ¿Estás seguro de que deseas guardar los cambios realizados al evento?
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={cancelarActualizacion}
                  className="form-button-secondary flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200"
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarActualizacion}
                  className="form-button-primary flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
                  disabled={guardando}
                >
                  {guardando ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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