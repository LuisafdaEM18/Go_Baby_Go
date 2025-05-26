import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdCard, FaCheck, FaExclamationTriangle, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { getEventoById } from '../services/eventoService';
import { inscribirVoluntario } from '../services/voluntarioService';
import { Evento, VoluntarioInscripcion } from '../services/types';
import { useNotification } from '../context/NotificationContext';

const RegistroVoluntario = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<VoluntarioInscripcion>({
    nombre: '',
    correo: '',
    confirmacion_correo: '',
    numero_identificacion: '',
    evento_id: 0,
    aceptacion_terminos: false
  });

  // Cargar datos del evento
  useEffect(() => {
    const fetchEvento = async () => {
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
      } catch (err: any) {
        console.error('Error al cargar evento:', err);
        const errorMsg = 'No se pudo cargar la información del evento. Por favor, intenta más tarde.';
        setError(errorMsg);
        showNotification(errorMsg, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvento();
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
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setError(null);
      setSubmitting(true);
      
      await inscribirVoluntario(formData);
      
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
      
    } catch (err: any) {
      console.error('Error al registrar voluntario:', err);
      const errorMsg = err.message || 'Error al enviar el registro. Por favor, intenta más tarde.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto text-3xl text-blue-600 mb-4" />
          <p className="text-gray-600">Cargando información del evento...</p>
        </div>
      </div>
    );
  }

  if (error && !evento) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="text-center text-red-600 mb-4">
            <FaExclamationTriangle className="text-5xl mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Error</h2>
          </div>
          <p className="text-gray-700 mb-6 text-center">{error}</p>
          <div className="text-center">
            <Link to="/" className="text-blue-600 hover:underline flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="text-center text-green-600 mb-4">
            <FaCheck className="text-5xl mx-auto mb-2" />
            <h2 className="text-xl font-semibold">¡Registro exitoso!</h2>
          </div>
          <p className="text-gray-700 mb-6 text-center">
            Tu inscripción al evento <strong>{evento?.nombre}</strong> ha sido registrada correctamente.
          </p>
          <p className="text-gray-700 mb-6 text-center">
            Te enviaremos un correo electrónico a <strong>{formData.correo}</strong> con la confirmación y más detalles.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="flex items-center text-blue-600 hover:underline mb-6">
          <FaArrowLeft className="mr-2" />
          Volver al inicio
        </Link>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-blue-900 mb-2">Registro de voluntario</h1>
          {evento && (
            <div className="mb-6">
              <h2 className="text-xl font-medium">{evento.nombre}</h2>
              <p className="text-gray-600">Fecha: {new Date(evento.fecha_evento).toLocaleDateString()}</p>
              <p className="text-gray-600">Lugar: {evento.lugar}</p>
              {evento.descripcion && <p className="mt-2 text-gray-700">{evento.descripcion}</p>}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar correo electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="confirmacion_correo"
                  value={formData.confirmacion_correo}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de identificación
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaIdCard />
                </span>
                <input
                  type="text"
                  name="numero_identificacion"
                  value={formData.numero_identificacion}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej. 1098765432"
                  required
                />
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  name="aceptacion_terminos"
                  checked={formData.aceptacion_terminos}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="text-gray-700">
                  Acepto los <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a> y la <a href="#" className="text-blue-600 hover:underline">política de privacidad</a>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> 
                    Procesando...
                  </>
                ) : (
                  'Inscribirme como voluntario'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroVoluntario;
