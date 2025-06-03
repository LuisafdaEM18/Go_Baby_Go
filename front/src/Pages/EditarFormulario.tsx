import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaExclamationTriangle, FaSave, FaSpinner, FaFileAlt, FaPlus, FaTimes, FaGripVertical } from 'react-icons/fa';
import Layout from '../Components/Layout';
import { getFormularioById, updateFormulario } from '../services/formularioService';
import { useNotification } from '../context/NotificationContext';
import { Formulario, Pregunta, Opcion } from '../services/types';

interface PreguntaForm extends Omit<Pregunta, 'opciones'> {
  opciones: Opcion[];
}

const EditarFormulario = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<Formulario>({
    nombre: '',
    descripcion: '',
    preguntas: []
  });

  useEffect(() => {
    if (!id) {
      setError('No se proporcionó ID del formulario');
      setCargando(false);
      return;
    }

    const cargarFormulario = async () => {
      try {
        setCargando(true);
        setError('');
        
        const formularioData = await getFormularioById(parseInt(id));
        setFormData(formularioData);
      } catch (err: any) {
        console.error('Error al cargar el formulario:', err);
        setError('Error al cargar el formulario. Por favor, intenta de nuevo más tarde.');
        showNotification('Error al cargar el formulario', 'error');
      } finally {
        setCargando(false);
      }
    };

    cargarFormulario();
  }, [id, showNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreguntaChange = (index: number, campo: string, valor: string) => {
    const nuevasPreguntas = [...formData.preguntas];
    if (campo === 'tipo') {
      nuevasPreguntas[index] = {
        ...nuevasPreguntas[index],
        tipo: valor as 'textual' | 'seleccion_multiple' | 'seleccion_unica',
        opciones: valor === 'textual' ? [] : [{ texto_opcion: '', es_correcta: false }]
      };
    } else {
      nuevasPreguntas[index] = {
        ...nuevasPreguntas[index],
        [campo]: valor
      };
    }
    setFormData(prev => ({ ...prev, preguntas: nuevasPreguntas }));
  };

  const agregarPregunta = () => {
    setFormData(prev => ({
      ...prev,
      preguntas: [...prev.preguntas, { texto: '', tipo: 'textual', opciones: [] }]
    }));
  };

  const eliminarPregunta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preguntas: prev.preguntas.filter((_, i) => i !== index)
    }));
  };

  const agregarOpcion = (preguntaIndex: number) => {
    const nuevasPreguntas = [...formData.preguntas];
    if (!nuevasPreguntas[preguntaIndex].opciones) {
      nuevasPreguntas[preguntaIndex].opciones = [];
    }
    nuevasPreguntas[preguntaIndex].opciones?.push({
      texto_opcion: '',
      es_correcta: false
    });
    setFormData(prev => ({ ...prev, preguntas: nuevasPreguntas }));
  };

  const eliminarOpcion = (preguntaIndex: number, opcionIndex: number) => {
    const nuevasPreguntas = [...formData.preguntas];
    nuevasPreguntas[preguntaIndex].opciones = nuevasPreguntas[preguntaIndex].opciones?.filter(
      (_, i) => i !== opcionIndex
    );
    setFormData(prev => ({ ...prev, preguntas: nuevasPreguntas }));
  };

  const handleOpcionChange = (preguntaIndex: number, opcionIndex: number, campo: string, valor: string | boolean) => {
    const nuevasPreguntas = [...formData.preguntas];
    if (nuevasPreguntas[preguntaIndex].opciones) {
      nuevasPreguntas[preguntaIndex].opciones![opcionIndex] = {
        ...nuevasPreguntas[preguntaIndex].opciones![opcionIndex],
        [campo]: valor
      };
      setFormData(prev => ({ ...prev, preguntas: nuevasPreguntas }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setError('El nombre del formulario es requerido');
      showNotification('El nombre del formulario es requerido', 'error');
      return;
    }
    setMostrarConfirmacion(true);
  };

  const confirmarActualizacion = async () => {
    try {
      setGuardando(true);
      setError('');
      
      await updateFormulario(parseInt(id!), formData);
      showNotification('Formulario actualizado correctamente', 'success');
      navigate('/formularios/gestionar', { state: { message: 'Formulario actualizado correctamente' } });
    } catch (err: any) {
      console.error('Error al actualizar el formulario:', err);
      setError('Error al actualizar el formulario. Por favor, intenta de nuevo más tarde.');
      showNotification('Error al actualizar el formulario', 'error');
    } finally {
      setGuardando(false);
      setMostrarConfirmacion(false);
    }
  };

  const cancelarActualizacion = () => {
    setMostrarConfirmacion(false);
  };

  if (cargando) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Cargando formulario...</p>
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
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl transform rotate-1"></div>
            <div className="relative bg-white rounded-2xl p-4 shadow-xl border border-gray-100" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-1" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                  Editar Formulario
                </h1>
                <p className="text-sm text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  Modifica la configuración del formulario seleccionado
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

          {/* Formulario */}
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
                    <FaFileAlt className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                    Información del formulario
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                    Nombre del Formulario
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 transition-all duration-300"
                    style={{ 
                      fontFamily: "'Recoleta Light', serif",
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                    }}
                    placeholder="Ingresa el nombre del formulario"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                    Descripción
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
                    placeholder="Describe el propósito y contenido del formulario"
                  />
                </div>

                {/* Sección de Preguntas */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                      Preguntas del Formulario
                    </h3>
                    <button
                      type="button"
                      onClick={agregarPregunta}
                      className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-2"
                      style={{
                        background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                        color: 'white',
                        fontFamily: "'Recoleta Medium', serif",
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)'
                      }}
                    >
                      <FaPlus className="text-sm" />
                      <span>Agregar Pregunta</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {formData.preguntas.map((pregunta, preguntaIndex) => (
                      <div key={preguntaIndex} className="bg-white/50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <FaGripVertical className="text-gray-400" />
                            <h4 className="font-semibold text-gray-900" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                              Pregunta {preguntaIndex + 1}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => eliminarPregunta(preguntaIndex)}
                            className="text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <FaTimes />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <input
                              type="text"
                              value={pregunta.texto}
                              onChange={(e) => handlePreguntaChange(preguntaIndex, 'texto', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                              placeholder="Escribe la pregunta"
                              style={{ fontFamily: "'Recoleta Light', serif" }}
                            />
                          </div>

                          <div>
                            <select
                              value={pregunta.tipo}
                              onChange={(e) => handlePreguntaChange(preguntaIndex, 'tipo', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                              style={{ fontFamily: "'Recoleta Light', serif" }}
                            >
                              <option value="textual">Respuesta de texto</option>
                              <option value="seleccion_unica">Selección única</option>
                              <option value="seleccion_multiple">Selección múltiple</option>
                            </select>
                          </div>

                          {(pregunta.tipo === 'seleccion_unica' || pregunta.tipo === 'seleccion_multiple') && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                                  Opciones de respuesta
                                </h5>
                                <button
                                  type="button"
                                  onClick={() => agregarOpcion(preguntaIndex)}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  + Agregar opción
                                </button>
                              </div>

                              {pregunta.opciones?.map((opcion, opcionIndex) => (
                                <div key={opcionIndex} className="flex items-center space-x-3">
                                  <input
                                    type="text"
                                    value={opcion.texto_opcion}
                                    onChange={(e) => handleOpcionChange(preguntaIndex, opcionIndex, 'texto_opcion', e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                                    placeholder={`Opción ${opcionIndex + 1}`}
                                    style={{ fontFamily: "'Recoleta Light', serif" }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => eliminarOpcion(preguntaIndex, opcionIndex)}
                                    className="text-red-500 hover:text-red-600 p-1"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/formularios/gestionar')}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 bg-white"
                    style={{
                      color: '#1e3766',
                      borderColor: '#1e3766',
                      fontFamily: "'Recoleta Medium', serif",
                      boxShadow: '0 4px 6px -1px rgba(30, 55, 102, 0.1), 0 2px 4px -1px rgba(30, 55, 102, 0.05)'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center"
                    style={{
                      background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                      color: 'white',
                      fontFamily: "'Recoleta Medium', serif",
                      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)'
                    }}
                    disabled={guardando}
                  >
                    {guardando ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    ) : (
                      <FaSave className="mr-3" />
                    )}
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-gradient-to-br from-white/80 via-blue-50/90 to-gray-100/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl transform rotate-1 blur-xl"></div>
            <div className="relative bg-white/90 rounded-3xl shadow-2xl max-w-md w-full border border-white/50" style={{
              backdropFilter: 'blur(20px)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
            }}>
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                  }}>
                    <FaSave className="text-3xl text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                    Confirmar cambios
                  </h3>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Recoleta Light', serif" }}>
                    ¿Estás seguro de que deseas guardar los cambios realizados al formulario?
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={cancelarActualizacion}
                    className="flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 bg-white"
                    style={{
                      color: '#1e3766',
                      borderColor: '#1e3766',
                      fontFamily: "'Recoleta Medium', serif",
                      boxShadow: '0 4px 6px -1px rgba(30, 55, 102, 0.1), 0 2px 4px -1px rgba(30, 55, 102, 0.05)'
                    }}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarActualizacion}
                    className="flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                      color: 'white',
                      fontFamily: "'Recoleta Medium', serif",
                      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)'
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
        </div>
      )}
    </Layout>
  );
};

export default EditarFormulario;
