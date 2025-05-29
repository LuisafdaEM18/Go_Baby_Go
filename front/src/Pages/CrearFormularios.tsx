import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaSave, FaPlus, FaTimes, FaCheck, FaGripVertical, FaQuestionCircle, FaEdit, FaDotCircle, FaCheckSquare, FaFileAlt, FaClipboardList } from 'react-icons/fa';
import Layout from '../Components/Layout';
import { createFormulario } from '../services/formularioService';
import { useNotification } from '../context/NotificationContext';

interface Opcion {
  texto_opcion: string;
  es_correcta?: boolean;
}

interface Pregunta {
  texto: string;
  tipo: 'textual' | 'seleccion_multiple' | 'seleccion_unica';
  opciones?: Opcion[];
}

const FormularioCrear: React.FC = () => {
  const navigate = useNavigate();
  const [nombreFormulario, setNombreFormulario] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errorNombre, setErrorNombre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);

  const agregarPregunta = () => {
    setPreguntas([...preguntas, { texto: '', tipo: 'textual' }]);
  };

  const eliminarPregunta = (index: number) => {
    const nuevas = preguntas.filter((_, i) => i !== index);
    setPreguntas(nuevas);
  };

  const actualizarPregunta = (index: number, campo: string, valor: string) => {
    const nuevas = [...preguntas];
    if (campo === 'tipo') {
      nuevas[index].tipo = valor as 'textual' | 'seleccion_multiple' | 'seleccion_unica';
      if (valor === 'seleccion_multiple' || valor === 'seleccion_unica') {
        nuevas[index].opciones = [{ texto_opcion: '', es_correcta: false }];
      } else {
        delete nuevas[index].opciones;
      }
    } else {
      nuevas[index].texto = valor;
    }
    setPreguntas(nuevas);
  };

  const actualizarOpcion = (index: number, opcionIndex: number, valor: string) => {
    const nuevas = [...preguntas];
    if (nuevas[index].opciones) {
      nuevas[index].opciones![opcionIndex].texto_opcion = valor;
      setPreguntas(nuevas);
    }
  };

  const marcarRespuestaCorrecta = (preguntaIndex: number, opcionIndex: number) => {
    const nuevas = [...preguntas];
    if (nuevas[preguntaIndex].opciones) {
      if (nuevas[preguntaIndex].tipo === 'seleccion_unica') {
        // Para selección única, solo una puede ser correcta
        nuevas[preguntaIndex].opciones!.forEach((op, i) => {
          op.es_correcta = i === opcionIndex;
        });
      } else {
        // Para selección múltiple, toggle la opción
        nuevas[preguntaIndex].opciones![opcionIndex].es_correcta = 
          !nuevas[preguntaIndex].opciones![opcionIndex].es_correcta;
      }
      setPreguntas(nuevas);
    }
  };

  const agregarOpcion = (index: number) => {
    const nuevas = [...preguntas];
    nuevas[index].opciones?.push({ texto_opcion: '', es_correcta: false });
    setPreguntas(nuevas);
  };

  const eliminarOpcion = (preguntaIndex: number, opcionIndex: number) => {
    const nuevas = [...preguntas];
    if (nuevas[preguntaIndex].opciones && nuevas[preguntaIndex].opciones!.length > 1) {
      nuevas[preguntaIndex].opciones = nuevas[preguntaIndex].opciones!.filter((_, i) => i !== opcionIndex);
      setPreguntas(nuevas);
    }
  };

  const validarFormulario = () => {
    let valido = true;
    
    // Validar nombre
    if (!nombreFormulario.trim()) {
      setErrorNombre('El nombre del formulario es obligatorio');
      showNotification('El nombre del formulario es obligatorio', 'error');
      valido = false;
    } else {
      setErrorNombre('');
    }
    
    // Validar preguntas
    if (preguntas.length === 0) {
      setError('Debe agregar al menos una pregunta al formulario');
      showNotification('Debe agregar al menos una pregunta al formulario', 'error');
      valido = false;
      return false;
    }
    
    // Validar cada pregunta
    for (const [index, pregunta] of preguntas.entries()) {
      if (!pregunta.texto.trim()) {
        setError(`Pregunta ${index + 1}: El texto de la pregunta es obligatorio`);
        showNotification(`Pregunta ${index + 1}: El texto de la pregunta es obligatorio`, 'error');
        valido = false;
        return false;
      }
      
      if ((pregunta.tipo === 'seleccion_multiple' || pregunta.tipo === 'seleccion_unica') && 
          (!pregunta.opciones || pregunta.opciones.length === 0)) {
        setError(`Pregunta ${index + 1}: Las preguntas de selección deben tener al menos una opción`);
        showNotification(`Pregunta ${index + 1}: Las preguntas de selección deben tener al menos una opción`, 'error');
        valido = false;
        return false;
      }
      
      if (pregunta.opciones) {
        for (const [opIndex, opcion] of pregunta.opciones.entries()) {
          if (!opcion.texto_opcion.trim()) {
            setError(`Pregunta ${index + 1}, Opción ${opIndex + 1}: El texto de la opción es obligatorio`);
            showNotification(`Pregunta ${index + 1}, Opción ${opIndex + 1}: El texto de la opción es obligatorio`, 'error');
            valido = false;
            return false;
          }
        }
      }
    }
    
    return valido;
  };

  const handleCrearClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      setMostrarConfirmacion(true);
    }
  };

  const confirmarCrear = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Crear el objeto de formulario en el formato que espera el backend
      const preguntasFormateadas = preguntas.map(pregunta => ({
        texto: pregunta.texto,
        tipo: pregunta.tipo,
        opciones: pregunta.opciones || []
      }));
      
      const formularioData = {
        nombre: nombreFormulario,
        preguntas: preguntasFormateadas
      };
      
      console.log('Enviando formulario:', formularioData);
      
      try {
        await createFormulario(formularioData);
        showNotification('Formulario creado con éxito', 'success');
        setMostrarConfirmacion(false);
        navigate('/formularios/gestionar');
      } catch (err: any) {
        console.error('Error al crear formulario:', err);
        
        // Intentar nuevamente si es un error de conexión
        if (err.message && err.message.includes('conexión') && connectionRetries < 2) {
          setConnectionRetries(prev => prev + 1);
          showNotification('Reintentando conexión con el servidor...', 'warning');
          
          // Esperar un momento antes de reintentar
          setTimeout(() => {
            confirmarCrear();
          }, 1500);
          return;
        }
        
        const errorMsg = err.message || 'Error al crear el formulario. Por favor, intenta de nuevo.';
        setError(errorMsg);
        showNotification(errorMsg, 'error');
        setMostrarConfirmacion(false);
      }
    } catch (err: any) {
      console.error('Error general al crear formulario:', err);
      const errorMsg = err.message || 'Error inesperado al crear el formulario.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelarCrear = () => {
    setMostrarConfirmacion(false);
  };

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
                <h1 className="text-xl font-bold mb-1" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                  Crear Formulario
                </h1>
                <p className="text-sm text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  Diseña un nuevo formulario personalizado
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

          {/* Información básica del formulario mejorada */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl transform -rotate-1 blur-xl"></div>
            <div className="relative bg-white/90 rounded-3xl p-8 shadow-2xl border border-white/50" style={{
              backdropFilter: 'blur(20px)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
            }}>
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{
                  background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)'
                }}>
                  <FaFileAlt className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                  Información del formulario
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                    Nombre del formulario *
                  </label>
                  <input
                    type="text"
                    value={nombreFormulario}
                    onChange={(e) => setNombreFormulario(e.target.value)}
                    className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      errorNombre ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/80'
                    }`}
                    style={{ 
                      fontFamily: "'Recoleta Light', serif",
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                    }}
                    placeholder="Ej: Formulario de registro pre-evento"
                  />
                  {errorNombre && <p className="mt-1 text-sm text-red-600 font-medium" style={{ fontFamily: "'Recoleta Medium', serif" }}>{errorNombre}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                    Descripción (opcional)
                  </label>
                  <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                    style={{ 
                      fontFamily: "'Recoleta Light', serif",
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                    }}
                    placeholder="Breve descripción del formulario"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección de preguntas mejorada */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl transform rotate-1 blur-xl"></div>
            <div className="relative bg-white/90 rounded-3xl p-8 shadow-2xl border border-white/50" style={{
              backdropFilter: 'blur(20px)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
            }}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{
                    background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)'
                  }}>
                    <FaQuestionCircle className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                      Preguntas del formulario
                    </h2>
                    <p className="text-gray-600 mt-1" style={{ fontFamily: "'Recoleta Light', serif" }}>
                      Agrega y configura las preguntas para tu formulario
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500 bg-gradient-to-r from-gray-50 to-indigo-50 px-4 py-2 rounded-xl border border-indigo-100/50" style={{ 
                    fontFamily: "'Recoleta Light', serif",
                    backdropFilter: 'blur(8px)'
                  }}>
                    <span className="font-semibold">Total:</span> {preguntas.length} pregunta{preguntas.length !== 1 ? 's' : ''}
                  </div>
                  <button
                    type="button"
                    onClick={agregarPregunta}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center"
                    style={{
                      background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                      color: 'white',
                      fontFamily: "'Recoleta Medium', serif",
                      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)'
                    }}
                  >
                    <FaPlus className="mr-2" />
                    Nueva pregunta
                  </button>
                </div>
              </div>

              {preguntas.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-indigo-200 rounded-3xl bg-gradient-to-br from-white/50 to-indigo-50/30" style={{
                  backdropFilter: 'blur(8px)'
                }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{
                    background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'
                  }}>
                    <FaQuestionCircle className="text-4xl text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                    No hay preguntas aún
                  </h3>
                  <p className="text-gray-600 text-lg" style={{ fontFamily: "'Recoleta Light', serif" }}>
                    Haz clic en "Nueva pregunta" para comenzar a crear tu formulario
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {preguntas.map((pregunta, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 blur-xl"></div>
                      <div className="relative bg-white/80 border border-white/50 rounded-3xl p-6 shadow-lg transform group-hover:-translate-y-1 transition-all duration-300" style={{
                        backdropFilter: 'blur(12px)',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.85) 100%)'
                      }}>
                        {/* Header de la pregunta */}
                        <div className="flex items-start space-x-4 mb-6">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{
                              background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                              border: '2px solid rgba(255, 255, 255, 0.5)'
                            }}>
                              <span className="text-white font-bold">{index + 1}</span>
                            </div>
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="flex items-center space-x-4">
                              <input
                                type="text"
                                placeholder="Escribe tu pregunta aquí..."
                                value={pregunta.texto}
                                onChange={(e) => actualizarPregunta(index, 'texto', e.target.value)}
                                className="flex-1 px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 transition-all duration-300"
                                style={{ 
                                  fontFamily: "'Recoleta Light', serif",
                                  backdropFilter: 'blur(8px)',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => eliminarPregunta(index)}
                                className="p-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                                style={{
                                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                  color: 'white',
                                  boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2), 0 2px 4px -1px rgba(220, 38, 38, 0.1)'
                                }}
                                title="Eliminar pregunta"
                              >
                                <FaTimes />
                              </button>
                            </div>

                            <div className="flex items-center space-x-4">
                              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                                Tipo de respuesta:
                              </label>
                              <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-indigo-50/30 p-2 rounded-xl border border-indigo-100/50" style={{
                                backdropFilter: 'blur(8px)'
                              }}>
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                  {pregunta.tipo === 'textual' && <FaEdit className="text-indigo-600 text-sm" />}
                                  {pregunta.tipo === 'seleccion_unica' && <FaDotCircle className="text-indigo-600 text-sm" />}
                                  {pregunta.tipo === 'seleccion_multiple' && <FaCheckSquare className="text-indigo-600 text-sm" />}
                                </div>
                                <select
                                  value={pregunta.tipo}
                                  onChange={(e) => actualizarPregunta(index, 'tipo', e.target.value)}
                                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 transition-all duration-300"
                                  style={{ 
                                    fontFamily: "'Recoleta Light', serif",
                                    backdropFilter: 'blur(8px)',
                                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.05)'
                                  }}
                                >
                                  <option value="textual">Texto libre</option>
                                  <option value="seleccion_unica">Selección única</option>
                                  <option value="seleccion_multiple">Selección múltiple</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Opciones para preguntas de selección */}
                        {(pregunta.tipo === 'seleccion_multiple' || pregunta.tipo === 'seleccion_unica') && pregunta.opciones && (
                          <div className="ml-16 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                                Opciones de respuesta
                              </h4>
                              <div className="text-xs text-gray-600 bg-gradient-to-r from-yellow-50 to-amber-50/30 px-4 py-2 rounded-xl border border-amber-100/50" style={{
                                backdropFilter: 'blur(8px)'
                              }}>
                                💡 Marca las respuestas correctas
                              </div>
                            </div>

                            <div className="space-y-3">
                              {pregunta.opciones.map((opcion, opcionIndex) => (
                                <div key={opcionIndex} className="flex items-center space-x-3 group/option">
                                  <button
                                    type="button"
                                    onClick={() => marcarRespuestaCorrecta(index, opcionIndex)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                                      opcion.es_correcta
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-white shadow-lg'
                                        : 'bg-white border-2 border-gray-200 hover:border-green-400 text-gray-400'
                                    }`}
                                    style={{
                                      boxShadow: opcion.es_correcta 
                                        ? '0 4px 6px -1px rgba(16, 185, 129, 0.2), 0 2px 4px -1px rgba(16, 185, 129, 0.1)'
                                        : 'none'
                                    }}
                                    title={opcion.es_correcta ? 'Respuesta correcta' : 'Marcar como correcta'}
                                  >
                                    {opcion.es_correcta && <FaCheck className="text-sm" />}
                                  </button>

                                  <input
                                    type="text"
                                    placeholder={`Opción ${opcionIndex + 1}`}
                                    value={opcion.texto_opcion}
                                    onChange={(e) => actualizarOpcion(index, opcionIndex, e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 transition-all duration-300"
                                    style={{ 
                                      fontFamily: "'Recoleta Light', serif",
                                      backdropFilter: 'blur(8px)',
                                      boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.05)'
                                    }}
                                  />

                                  {pregunta.opciones && pregunta.opciones.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => eliminarOpcion(index, opcionIndex)}
                                      className="p-2 rounded-xl transition-all duration-300 transform hover:scale-105 opacity-0 group-hover/option:opacity-100"
                                      style={{
                                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                        color: 'white',
                                        boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2), 0 2px 4px -1px rgba(220, 38, 38, 0.1)'
                                      }}
                                      title="Eliminar opción"
                                    >
                                      <FaTimes className="text-sm" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => agregarOpcion(index)}
                              className="px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center hover:bg-indigo-50/50 border-2 border-dashed border-indigo-200 text-indigo-600"
                              style={{ fontFamily: "'Recoleta Medium', serif" }}
                            >
                              <FaPlus className="mr-2" />
                              Agregar opción
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  onClick={() => navigate('/formularios/gestionar')}
                  className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 bg-white"
                  style={{
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
                  onClick={handleCrearClick}
                  className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center"
                  style={{
                    background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                    color: 'white',
                    fontFamily: "'Recoleta Medium', serif",
                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)'
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-3" />
                      Guardar formulario
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
                  ¿Estás seguro de que deseas crear este formulario con {preguntas.length} pregunta{preguntas.length !== 1 ? 's' : ''}?
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={cancelarCrear}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 border-2"
                  style={{
                    backgroundColor: 'white',
                    color: '#1e3766',
                    borderColor: '#1e3766',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarCrear}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 100%)',
                    color: 'white',
                    fontFamily: "'Recoleta Medium', serif"
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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

export default FormularioCrear;