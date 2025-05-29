import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdCard, FaCheck, FaExclamationTriangle, FaArrowLeft, FaSpinner, FaTimes } from 'react-icons/fa';
import { getEventoById } from '../services/eventoService';
import { getFormularioById } from '../services/formularioService';
import { inscribirVoluntario, guardarRespuestas } from '../services/voluntarioService';
import { Evento, VoluntarioInscripcion, Formulario, RespuestaDetalle } from '../services/types';
import { useNotification } from '../context/NotificationContext';

const RegistroVoluntario = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  
  const [evento, setEvento] = useState<Evento | null>(null);
  const [formulario, setFormulario] = useState<Formulario | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const [formData, setFormData] = useState<VoluntarioInscripcion>({
    nombre: '',
    correo: '',
    confirmacion_correo: '',
    numero_identificacion: '',
    evento_id: 0,
    aceptacion_terminos: false
  });

  // Estado para las respuestas del formulario
  const [respuestasFormulario, setRespuestasFormulario] = useState<RespuestaDetalle>({});

  // Cargar datos del evento y formulario
  useEffect(() => {
    const fetchEventoYFormulario = async () => {
      if (!id) {
        setError('ID de evento no válido');
        showNotification('ID de evento no válido', 'error');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const eventoData = await getEventoById(parseInt(id));
        setEvento(eventoData);
        setFormData(prev => ({ ...prev, evento_id: parseInt(id) }));

        // Cargar formulario pre-evento si existe
        if (eventoData.formulario_pre) {
          try {
            setFormulario(eventoData.formulario_pre);
            // Inicializar respuestas vacías
            const respuestasIniciales: RespuestaDetalle = {};
            eventoData.formulario_pre.preguntas.forEach(pregunta => {
              if (pregunta.id) {
                if (pregunta.tipo === 'textual') {
                  respuestasIniciales[pregunta.id.toString()] = '';
                } else if (pregunta.tipo === 'seleccion_unica') {
                  respuestasIniciales[pregunta.id.toString()] = '';
                } else if (pregunta.tipo === 'seleccion_multiple') {
                  respuestasIniciales[pregunta.id.toString()] = [];
                }
              }
            });
            setRespuestasFormulario(respuestasIniciales);
          } catch (formError) {
            console.warn('Error al procesar el formulario pre-evento:', formError);
            // No es un error fatal, el registro puede continuar sin formulario
          }
        }
      } catch (err: any) {
        console.error('Error al cargar evento:', err);
        const errorMsg = 'No se pudo cargar la información del evento. Por favor, intenta más tarde.';
        setError(errorMsg);
        showNotification(errorMsg, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventoYFormulario();
  }, [id, showNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error al editar
    if (error) {
      setError(null);
    }
  };

  // Manejar respuestas del formulario
  const handleRespuestaChange = (preguntaId: string, valor: any) => {
    setRespuestasFormulario(prev => ({
      ...prev,
      [preguntaId]: valor
    }));
  };

  // Manejar selección múltiple
  const handleSeleccionMultiple = (preguntaId: string, opcionId: string, checked: boolean) => {
    setRespuestasFormulario(prev => {
      const respuestasActuales = Array.isArray(prev[preguntaId]) ? prev[preguntaId] as string[] : [];
      if (checked) {
        return {
          ...prev,
          [preguntaId]: [...respuestasActuales, opcionId]
        };
      } else {
        return {
          ...prev,
          [preguntaId]: respuestasActuales.filter(id => id !== opcionId)
        };
      }
    });
  };

  const validateForm = (): boolean => {
    // Validar campos obligatorios
    if (!formData.nombre.trim()) {
      const errorMsg = 'El nombre es obligatorio';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }
    
    if (!formData.correo.trim()) {
      const errorMsg = 'El correo es obligatorio';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }
    
    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      const errorMsg = 'El formato del correo electrónico no es válido';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }
    
    // Validar que los correos coincidan
    if (formData.correo !== formData.confirmacion_correo) {
      const errorMsg = 'Los correos electrónicos no coinciden';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }
    
    if (!formData.numero_identificacion.trim()) {
      const errorMsg = 'El número de identificación es obligatorio';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }
    
    if (!formData.aceptacion_terminos) {
      const errorMsg = 'Debes aceptar los términos y condiciones';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }

    // Validar respuestas del formulario si existe
    if (formulario && formulario.preguntas.length > 0) {
      for (const pregunta of formulario.preguntas) {
        if (pregunta.id) {
          const preguntaId = pregunta.id.toString();
          const respuesta = respuestasFormulario[preguntaId];
          
          if (pregunta.tipo === 'textual') {
            if (!respuesta || (typeof respuesta === 'string' && !respuesta.trim())) {
              const errorMsg = `Por favor responde: ${pregunta.texto}`;
              setError(errorMsg);
              showNotification(errorMsg, 'error');
              return false;
            }
          } else if (pregunta.tipo === 'seleccion_unica') {
            if (!respuesta || respuesta === '' || respuesta === 0) {
              const errorMsg = `Por favor selecciona una opción para: ${pregunta.texto}`;
              setError(errorMsg);
              showNotification(errorMsg, 'error');
              return false;
            }
          } else if (pregunta.tipo === 'seleccion_multiple') {
            if (!Array.isArray(respuesta) || respuesta.length === 0) {
              const errorMsg = `Por favor selecciona al menos una opción para: ${pregunta.texto}`;
              setError(errorMsg);
              showNotification(errorMsg, 'error');
              return false;
            }
          }
        }
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setError(null);
      setSubmitting(true);
      
      // Inscribir voluntario
      const inscripcion = await inscribirVoluntario(formData);
      
      // Si hay formulario pre-evento, guardar respuestas
      if (formulario && formulario.preguntas.length > 0 && inscripcion.id) {
        try {
          // Formatear respuestas según el formato esperado por el backend
          const respuestasFormateadas: RespuestaDetalle = {};
          
          for (const pregunta of formulario.preguntas) {
            if (pregunta.id) {
              const preguntaId = pregunta.id.toString();
              const respuesta = respuestasFormulario[preguntaId];
              
              if (pregunta.tipo === 'textual') {
                respuestasFormateadas[preguntaId] = respuesta;
              } else if (pregunta.tipo === 'seleccion_unica') {
                respuestasFormateadas[preguntaId] = { opcion_id: parseInt(respuesta as string) };
              } else if (pregunta.tipo === 'seleccion_multiple') {
                respuestasFormateadas[preguntaId] = respuesta as string[];
              }
            }
          }
          
          await guardarRespuestas({
            inscripcion_id: inscripcion.id,
            tipo_formulario: 'pre',
            respuestas: respuestasFormateadas
          });
        } catch (respuestasError) {
          console.warn('Error al guardar respuestas del formulario:', respuestasError);
          // No fallar si no se pueden guardar las respuestas
        }
      }
      
      // Mostrar mensaje de éxito
      setSuccess(true);
      showNotification('Registro completado con éxito', 'success');
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        correo: '',
        confirmacion_correo: '',
        numero_identificacion: '',
        evento_id: parseInt(id || '0'),
        aceptacion_terminos: false
      });
      
      // Limpiar respuestas del formulario
      setRespuestasFormulario({});
      
    } catch (err: any) {
      console.error('Error al registrar voluntario:', err);
      const errorMsg = err.message || 'Error al enviar el registro. Por favor, intenta más tarde.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Modal de Términos y Condiciones
  const TermsModal = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-white/80 via-blue-50/90 to-gray-100/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
              Términos y Condiciones
            </h2>
            <button
              onClick={() => setShowTermsModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-xl text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-6 text-gray-700" style={{ fontFamily: "'Recoleta Light', serif" }}>
            <section>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                Autorización de Tratamiento de Datos Personales
              </h3>
              <p className="leading-relaxed text-justify mb-6">
                En virtud de la Ley 1581 de 2012 y del Decreto 1377 de 2013, declaro de manera libre, expresa, inequívoca e informada, que autorizo a <strong>EL COMITÉ DE REHABILITACIÓN DE ANTIOQUIA</strong>, para que realice la recolección, almacenamiento, uso, transferencia, circulación, supresión, y en general, tratamiento de mis datos personales, incluyendo datos sensibles, y los que puedan llegar a ser considerados como tal de conformidad con la Ley, para que dicho Tratamiento se realice con el fin de brindarme información de interés y comercial de EL COMITÉ DE REHABILITACIÓN DE ANTIOQUIA.
              </p>
              
              <p className="leading-relaxed text-justify mb-6">
                Declaro que se me ha informado de manera clara y comprensible que tengo derecho a conocer, actualizar y rectificar los datos personales proporcionados, a solicitar prueba de esta autorización, a solicitar información sobre el uso que se le ha dado a mis datos personales, a presentar quejas inicialmente ante EL COMITÉ DE REHABILITACIÓN DE ANTIOQUIA y en segunda instancia ante la Superintendencia de Industria y Comercio por el uso indebido de mis datos personales, a revocar esta autorización o solicitar la supresión de los datos personales suministrados y a acceder de forma gratuita a los mismos.
              </p>
              
              <p className="leading-relaxed text-justify mb-6">
                Declaro que me han informado sobre la Política para el Tratamiento de Datos Personales, la cual se encuentra disponible en{' '}
                <a 
                  href="https://www.elcomite.org.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium hover:underline transition-all duration-200"
                  style={{ color: '#1e3766' }}
                >
                  www.elcomite.org.co
                </a>
                , y que la información por mí proporcionada es veraz, completa, exacta, actualizada y verificable.
              </p>
              
              <p className="leading-relaxed text-justify">
                Mediante la firma del presente documento, manifiesto que reconozco y acepto que cualquier consulta o reclamación relacionada con el Tratamiento de mis datos personales podrá ser elevada verbalmente o por escrito ante EL COMITÉ DE REHABILITACIÓN DE ANTIOQUIA, como Responsable del Tratamiento, cuya página web es{' '}
                <a 
                  href="https://www.elcomite.org.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium hover:underline transition-all duration-200"
                  style={{ color: '#1e3766' }}
                >
                  www.elcomite.org.co
                </a>
                {' '}y su teléfono de atención es{' '}
                <a 
                  href="tel:3202160"
                  className="font-medium hover:underline transition-all duration-200"
                  style={{ color: '#1e3766' }}
                >
                  3202160
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setShowTermsModal(false)}
              className="px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: '#1e3766',
                color: 'white',
                fontFamily: "'Recoleta Medium', serif"
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto text-4xl mb-6" style={{ color: '#1e3766' }} />
          <p className="text-gray-600 text-lg" style={{ fontFamily: "'Recoleta Light', serif" }}>
            Cargando información del evento...
          </p>
        </div>
      </div>
    );
  }

  if (error && !evento) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
          <div className="text-center text-red-600 mb-6">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Recoleta Medium', serif" }}>Error</h2>
          </div>
          <p className="text-gray-700 mb-8 text-center leading-relaxed" style={{ fontFamily: "'Recoleta Light', serif" }}>
            {error}
          </p>
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: '#1e3766',
                color: 'white',
                fontFamily: "'Recoleta Medium', serif"
              }}
            >
              <FaArrowLeft className="mr-2" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
          <div className="text-center text-green-600 mb-6">
            <FaCheck className="text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Recoleta Medium', serif" }}>
              ¡Registro exitoso!
            </h2>
          </div>
          <p className="text-gray-700 mb-6 text-center leading-relaxed" style={{ fontFamily: "'Recoleta Light', serif" }}>
            Tu inscripción al evento <strong>{evento?.nombre}</strong> ha sido registrada correctamente.
          </p>
          <p className="text-gray-700 mb-8 text-center leading-relaxed" style={{ fontFamily: "'Recoleta Light', serif" }}>
            Te enviaremos un correo electrónico a <strong>{formData.correo}</strong> con la confirmación y más detalles.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/"
              className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: '#1e3766',
                color: 'white',
                fontFamily: "'Recoleta Medium', serif"
              }}
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen py-12 px-4" style={{ 
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 25%, rgba(241, 245, 249, 0.85) 75%, rgba(226, 232, 240, 0.9) 100%)'
      }}>
        <div className="max-w-4xl mx-auto">
          {/* Header mejorado */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl transform rotate-1"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e3766' }}>
                    <FaUser className="text-white text-3xl" />
                  </div>
                </div>
                <h1 className="text-5xl font-extrabold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                  Go Baby Go
                </h1>
                <p className="text-2xl text-gray-600 mb-2" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  Registro de Voluntario
                </p>
                <p className="text-lg text-gray-500" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  Únete a nuestra misión de crear sonrisas y movilidad
                </p>
              </div>
            </div>
          </div>
          
          {/* Información del evento mejorada */}
          {evento && (
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl transform -rotate-1"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transform hover:-translate-y-1 transition-all duration-300" style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(241, 245, 249, 0.98) 100%)',
                backdropFilter: 'blur(15px)'
              }}>
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e3766' }}>
                      <span className="text-white font-bold text-2xl">📅</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                      {evento.nombre}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 shadow-sm">
                          <span className="text-blue-600 font-semibold text-sm">📅</span>
                        </div>
                        <div>
                          <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>Fecha:</span>
                          <p className="text-gray-700" style={{ fontFamily: "'Recoleta Light', serif" }}>
                            {new Date(evento.fecha_evento).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 shadow-sm">
                          <span className="text-green-600 font-semibold text-sm">📍</span>
                        </div>
                        <div>
                          <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>Lugar:</span>
                          <p className="text-gray-700" style={{ fontFamily: "'Recoleta Light', serif" }}>
                            {evento.lugar}
                          </p>
                        </div>
                      </div>
                    </div>
                    {evento.descripcion && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                        <h3 className="font-semibold text-lg mb-3" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                          Sobre el evento
                        </h3>
                        <p className="leading-relaxed text-gray-700" style={{ fontFamily: "'Recoleta Light', serif" }}>
                          {evento.descripcion}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulario de registro mejorado */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl transform rotate-1"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 transform hover:-translate-y-1 transition-all duration-300" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(241, 245, 249, 0.98) 100%)',
              backdropFilter: 'blur(15px)'
            }}>
              {error && (
                <div className="mb-8 p-6 rounded-2xl flex items-center shadow-lg" style={{
                  background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(252, 231, 243, 0.9) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 mr-4 shadow-lg">
                    <FaExclamationTriangle className="text-red-500 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-800 text-lg" style={{ fontFamily: "'Recoleta Medium', serif" }}>Error</p>
                    <p className="text-red-700" style={{ fontFamily: "'Recoleta Light', serif" }}>{error}</p>
                  </div>
                </div>
              )}

              <div className="text-center mb-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e3766' }}>
                    <span className="text-white font-bold text-2xl">📝</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                  Formulario de Inscripción
                </h3>
                <p className="text-xl text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                  Completa tu información para registrarte como voluntario
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Sección de información personal */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-3xl border border-gray-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e3766' }}>
                      <FaUser className="text-white text-lg" />
                    </div>
                    <h4 className="text-2xl font-bold" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                      Información Personal
                    </h4>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                        Nombre completo *
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                          <FaUser />
                        </span>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          className="pl-12 w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                          style={{ fontFamily: "'Recoleta Light', serif" }}
                          placeholder="Ej. Juan Pérez García"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                        Número de identificación *
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                          <FaIdCard />
                        </span>
                        <input
                          type="text"
                          name="numero_identificacion"
                          value={formData.numero_identificacion}
                          onChange={handleChange}
                          className="pl-12 w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                          style={{ fontFamily: "'Recoleta Light', serif" }}
                          placeholder="Ej. 1098765432"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                        Correo electrónico *
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                          <FaEnvelope />
                        </span>
                        <input
                          type="email"
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          className="pl-12 w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                          style={{ fontFamily: "'Recoleta Light', serif" }}
                          placeholder="correo@ejemplo.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                        Confirmar correo electrónico *
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                          <FaEnvelope />
                        </span>
                        <input
                          type="email"
                          name="confirmacion_correo"
                          value={formData.confirmacion_correo}
                          onChange={handleChange}
                          className="pl-12 w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                          style={{ fontFamily: "'Recoleta Light', serif" }}
                          placeholder="Confirma tu correo electrónico"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Renderizar preguntas del formulario después de los campos básicos */}
                {formulario && formulario.preguntas.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-3xl border border-purple-200">
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e3766' }}>
                          <span className="text-white font-bold text-2xl">📋</span>
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                        {formulario.nombre}
                      </h3>
                      <p className="text-xl text-gray-600" style={{ fontFamily: "'Recoleta Light', serif" }}>
                        Por favor completa las siguientes preguntas
                      </p>
                    </div>
                    <div className="space-y-8">
                      {formulario.preguntas.map((pregunta, index) => {
                        const preguntaId = pregunta.id?.toString() || '';
                        
                        return (
                          <div key={pregunta.id || index} className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                            <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 rounded-full text-white flex items-center justify-center font-semibold shadow-lg"
                                       style={{ backgroundColor: '#1e3766' }}>
                                    {index + 1}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <label className="block text-xl font-medium text-gray-900 mb-6" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                                    {pregunta.texto}
                                  </label>
                                  
                                  {pregunta.tipo === 'textual' && (
                                    <textarea
                                      value={respuestasFormulario[preguntaId] as string || ''}
                                      onChange={(e) => handleRespuestaChange(preguntaId, e.target.value)}
                                      className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm resize-none hover:shadow-md bg-white"
                                      style={{ fontFamily: "'Recoleta Light', serif" }}
                                      rows={4}
                                      placeholder="Escribe tu respuesta aquí..."
                                      required
                                    />
                                  )}
                                  
                                  {pregunta.tipo === 'seleccion_unica' && (
                                    <div className="space-y-4">
                                      {pregunta.opciones.map((opcion) => (
                                        <label key={opcion.id} className="flex items-center space-x-4 cursor-pointer p-4 rounded-2xl hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-gray-200 hover:border-blue-300">
                                          <input
                                            type="radio"
                                            name={`pregunta_${preguntaId}`}
                                            value={opcion.id}
                                            checked={respuestasFormulario[preguntaId] === opcion.id?.toString()}
                                            onChange={(e) => handleRespuestaChange(preguntaId, e.target.value)}
                                            className="h-6 w-6 border-gray-300 focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                            style={{ accentColor: '#1e3766' }}
                                            required
                                          />
                                          <span className="text-gray-700 flex-1 text-lg" style={{ fontFamily: "'Recoleta Light', serif" }}>
                                            {opcion.texto_opcion}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {pregunta.tipo === 'seleccion_multiple' && (
                                    <div className="space-y-4">
                                      {pregunta.opciones.map((opcion) => {
                                        const respuestaActual = respuestasFormulario[preguntaId] as string[] || [];
                                        const isChecked = respuestaActual.includes(opcion.id?.toString() || '');
                                        
                                        return (
                                          <label key={opcion.id} className="flex items-center space-x-4 cursor-pointer p-4 rounded-2xl hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border border-gray-200 hover:border-blue-300">
                                            <input
                                              type="checkbox"
                                              checked={isChecked}
                                              onChange={(e) => handleSeleccionMultiple(preguntaId, opcion.id?.toString() || '', e.target.checked)}
                                              className="h-6 w-6 border-gray-300 rounded focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                              style={{ accentColor: '#1e3766' }}
                                            />
                                            <span className="text-gray-700 flex-1 text-lg" style={{ fontFamily: "'Recoleta Light', serif" }}>
                                              {opcion.texto_opcion}
                                            </span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Términos y condiciones mejorados */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-8 rounded-3xl border border-orange-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e3766' }}>
                        <span className="text-white font-bold text-xl">⚖️</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold mb-4" style={{ color: '#1e3766', fontFamily: "'Recoleta Medium', serif" }}>
                        Términos y Condiciones
                      </h4>
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center h-6 mt-1">
                          <input
                            type="checkbox"
                            name="aceptacion_terminos"
                            checked={formData.aceptacion_terminos}
                            onChange={handleChange}
                            className="h-6 w-6 border-gray-300 rounded focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                            style={{ accentColor: '#1e3766' }}
                            required
                          />
                        </div>
                        <div className="text-lg">
                          <label className="text-gray-700 cursor-pointer" style={{ fontFamily: "'Recoleta Light', serif" }}>
                            Acepto los{' '}
                            <button
                              type="button"
                              onClick={() => setShowTermsModal(true)}
                              className="font-semibold hover:underline transition-all duration-200 hover:scale-105 px-2 py-1 rounded-lg hover:bg-blue-100"
                              style={{ color: '#1e3766' }}
                            >
                              términos y condiciones
                            </button>
                            {' '}de participación como voluntario en Go Baby Go
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción mejorados */}
                <div className="space-y-6">
                  <button
                    type="submit"
                    className="w-full px-10 py-6 rounded-3xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-2xl hover:shadow-3xl text-xl"
                    style={{
                      background: 'linear-gradient(135deg, #1e3766 0%, #2563eb 50%, #3b82f6 100%)',
                      color: 'white',
                      fontFamily: "'Recoleta Medium', serif"
                    }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-4 text-xl" /> 
                        Procesando inscripción...
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-4 text-xl" />
                        Inscribirme como voluntario
                      </>
                    )}
                  </button>

                  <Link 
                    to="/" 
                    className="w-full px-10 py-6 rounded-3xl font-semibold transition-all duration-300 border-3 hover:bg-gray-50 flex items-center justify-center hover:scale-105 text-xl shadow-lg hover:shadow-xl"
                    style={{
                      backgroundColor: 'white',
                      color: '#1e3766',
                      borderColor: '#1e3766',
                      fontFamily: "'Recoleta Medium', serif"
                    }}
                  >
                    <FaArrowLeft className="mr-4 text-xl" />
                    Volver al inicio
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      {showTermsModal && <TermsModal />}
    </>
  );
};

export default RegistroVoluntario;
