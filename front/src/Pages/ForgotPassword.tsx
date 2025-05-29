import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import { requestPasswordReset } from '../services/passwordResetService';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email.trim()) {
      const errorMsg = 'Por favor, ingresa tu correo electrónico';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return;
    }

    if (!validateEmail(email)) {
      const errorMsg = 'Por favor, ingresa un correo electrónico válido';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await requestPasswordReset(email);
      setIsSuccess(true);
      showNotification('Se ha enviado un enlace de recuperación a tu correo', 'success');
      
    } catch (err: any) {
      console.error('Error al solicitar recuperación:', err);
      // Por seguridad, siempre mostramos el mismo mensaje
      setIsSuccess(true);
      showNotification('Si el correo está registrado, recibirás un enlace de recuperación', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Enlace enviado
            </h2>
            
            <p className="text-gray-600 mb-6">
              Si tu correo está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Revisa tu bandeja de entrada y spam.</strong> El enlace expira en 30 minutos.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBack}
                className="w-full form-button-primary px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                Volver al inicio de sesión
              </button>
              
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                }}
                className="w-full form-button-secondary px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                Enviar otro enlace
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-2">
            El Comité
          </h2>
          <p className="text-gray-600">Recuperación de contraseña</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¿Olvidaste tu contraseña?
            </h3>
            <p className="text-gray-600 text-sm">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="ejemplo@correo.com"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full form-button-primary px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Enviando enlace...
                  </>
                ) : (
                  <>
                    <FaEnvelope className="mr-2" />
                    Enviar enlace de recuperación
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full form-button-secondary px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                <FaArrowLeft className="mr-2" />
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 