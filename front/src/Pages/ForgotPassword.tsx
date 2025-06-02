import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import { requestPasswordReset } from '../services/passwordResetService';
import logoBabyGo from '../assets/Logo-Go-baby-Go-2024-02-1.png';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    // Agregar los estilos de animación
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes radar-pulse {
        0% {
          transform: scale(0.98);
          opacity: 0.3;
        }
        50% {
          transform: scale(1);
          opacity: 0.7;
        }
        100% {
          transform: scale(0.98);
          opacity: 0.3;
        }
      }

      .radar-circle {
        box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.2);
      }

      @media (max-width: 1024px) {
        .radar-circle {
          transform: scale(0.8);
        }
      }

      @media (max-width: 768px) {
        .radar-circle {
          transform: scale(0.6);
        }
      }

      @media (max-width: 480px) {
        .radar-circle {
          transform: scale(0.4);
        }
      }
    `;
    document.head.appendChild(styleElement);

    // Limpiar los estilos cuando el componente se desmonte
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
      setIsSuccess(true); // Por seguridad, siempre mostramos el mismo mensaje
      showNotification('Si el correo está registrado, recibirás un enlace de recuperación', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    console.log('Navegando a login...');
    navigate('/login');
  };

  const handleSendAnotherLink = () => {
    console.log('Reseteando formulario...');
    setIsSuccess(false);
    setEmail('');
    setError(null);
    showNotification('Ingresa tu correo para enviar un nuevo enlace', 'info');
  };

  const SuccessView = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 relative overflow-hidden">
        {/* Título del Comité y línea arcoíris */}
        <div className="relative z-20">
          <div className="flex justify-between items-start px-8 pt-8">
            <h1 
              className="text-5xl font-bold"
              style={{ 
                fontFamily: "'Recoleta SemiBold', serif",
                color: '#1e3766'
              }}
            >
              El Comit<span style={{ color: '#73a31d' }}>é</span>
            </h1>
            <img 
              src={logoBabyGo} 
              alt="Logo Baby Go" 
              className="h-16 w-auto object-contain -mt-4"
            />
          </div>
          <div 
            className="h-1 w-full mt-4"
            style={{
              background: 'linear-gradient(to right, #1e3766, #2563eb, #48b4b1, #60a5fa, #93c5fd)'
            }}
          ></div>
        </div>

        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl transform rotate-1 blur-2xl"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-white/50">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-2xl text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Enlace enviado
                </h2>
                
                <p className="text-gray-600 mb-6 text-center">
                  Si tu correo está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800 text-center">
                    <strong>Revisa tu bandeja de entrada y spam.</strong> El enlace expira en 30 minutos.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                  >
                    Volver al inicio de sesión
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSendAnotherLink}
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                  >
                    Enviar otro enlace
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isSuccess) {
    return <SuccessView />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 relative overflow-hidden">
      {/* Marcas de agua - Círculos concéntricos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Círculos inferiores izquierdos */}
        <div className="absolute left-0 bottom-0 transform -translate-x-1/3 translate-y-1/3">
          {[...Array(6)].map((_, index) => (
            <div
              key={`bottom-left-${index}`}
              className="absolute rounded-full"
              style={{
                width: `${(index + 1) * 200}px`,
                height: `${(index + 1) * 200}px`,
                border: '2px solid rgba(115, 163, 29, 0.3)',
                animation: `radar-pulse ${5 + index * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.8}s`,
                opacity: 0.9 - index * 0.1,
                background: `radial-gradient(circle at center, rgba(115, 163, 29, 0.2) 0%, rgba(115, 163, 29, 0.1) 50%, transparent 70%)`
              }}
            />
          ))}
        </div>

        {/* Círculos inferiores derechos */}
        <div className="absolute right-0 bottom-0 transform translate-x-1/3 translate-y-1/3">
          {[...Array(6)].map((_, index) => (
            <div
              key={`bottom-right-${index}`}
              className="absolute rounded-full"
              style={{
                width: `${(index + 1) * 180}px`,
                height: `${(index + 1) * 180}px`,
                border: '2px solid rgba(30, 55, 102, 0.3)',
                animation: `radar-pulse ${5.5 + index * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.6}s`,
                opacity: 0.85 - index * 0.1,
                background: `radial-gradient(circle at center, rgba(30, 55, 102, 0.2) 0%, rgba(30, 55, 102, 0.1) 50%, transparent 70%)`
              }}
            />
          ))}
        </div>

        {/* Círculos superiores derechos */}
        <div className="absolute right-0 top-0 transform translate-x-1/4 -translate-y-1/4">
          {[...Array(5)].map((_, index) => (
            <div
              key={`top-right-${index}`}
              className="absolute rounded-full"
              style={{
                width: `${(index + 1) * 160}px`,
                height: `${(index + 1) * 160}px`,
                border: '2px solid rgba(30, 55, 102, 0.3)',
                animation: `radar-pulse ${6 + index * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.7}s`,
                opacity: 0.8 - index * 0.1,
                background: `radial-gradient(circle at center, rgba(30, 55, 102, 0.2) 0%, rgba(30, 55, 102, 0.1) 50%, transparent 70%)`
              }}
            />
          ))}
        </div>
      </div>

      {/* Elementos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      {/* Título del Comité y línea arcoíris */}
      <div className="relative z-20">
        <div className="flex justify-between items-start px-8 pt-8">
          <h1 
            className="text-5xl font-bold"
            style={{ 
              fontFamily: "'Recoleta SemiBold', serif",
              color: '#1e3766'
            }}
          >
            El Comit<span style={{ color: '#73a31d' }}>é</span>
          </h1>
          <img 
            src={logoBabyGo} 
            alt="Logo Baby Go" 
            className="h-16 w-auto object-contain -mt-4"
          />
        </div>
        <div 
          className="h-1 w-full mt-4"
          style={{
            background: 'linear-gradient(to right, #1e3766, #2563eb, #48b4b1, #60a5fa, #93c5fd)'
          }}
        ></div>
      </div>

      {/* Contenido Principal */}
      <div className="relative z-10 flex items-center justify-center p-6 mt-20">
        <div className="w-full max-w-md">
          {/* Formulario Principal */}
          <div className="relative animate-fade-in animation-delay-150">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl transform rotate-1 blur-2xl"></div>
            <div className="relative bg-white/80 rounded-3xl p-8 shadow-xl border border-white/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-300"
                 style={{
                   background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
                 }}>
              
              {/* Título del formulario */}
              <h2 
                className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-[#1e3766] to-[#2563eb] bg-clip-text text-transparent"
                style={{ fontFamily: "'Recoleta SemiBold', serif" }}
              >
                Recuperación de Contraseña
              </h2>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope className="text-2xl text-blue-600" />
                </div>
                <p className="text-gray-600 text-sm">
                  Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaExclamationTriangle className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-800 text-sm mb-1">
                        Error
                      </p>
                      <p className="text-red-700 text-sm">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-corporate-primary">
                    Correo Electrónico
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="h-4 w-4 text-gray-400 group-focus-within:text-corporate-secondary transition-colors" />
                    </div>
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
                      className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-corporate-secondary focus:border-transparent transition-all duration-300 hover:bg-white/90"
                      placeholder="correo@ejemplo.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    disabled={isLoading}
                    className="flex-1 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:text-corporate-primary font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:bg-white hover:border-corporate-primary transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                      <span>Volver</span>
                    </div>
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-[#1e3766] via-[#2563eb] to-[#3b82f6] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed hover:from-[#2563eb] hover:via-[#3b82f6] hover:to-[#60a5fa] backdrop-blur-sm"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <FaSpinner className="animate-spin text-lg" />
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      <span>Enviar enlace</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm animate-fade-in animation-delay-300">
            © {new Date().getFullYear()} El Comité. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 