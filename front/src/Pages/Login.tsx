import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FaUser, FaLock } from 'react-icons/fa';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import logoBabyGo from '../assets/logo-babygo.png';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    remember: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();
  const { showNotification } = useNotification();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Check if there's a remembered user
    const rememberedUser = localStorage.getItem('rememberUser');
    if (rememberedUser) {
      setFormData(prev => ({
        ...prev,
        email: rememberedUser,
        remember: true
      }));
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    if (!formData.email.trim() && !formData.password.trim()) {
      const errorMsg = 'Por favor, ingresa tu correo y contraseña';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }
    
    if (!formData.email.trim()) {
      const errorMsg = 'El campo de correo electrónico no puede estar vacío';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      const errorMsg = 'El formato del correo electrónico es inválido';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }
    
    if (!formData.password.trim()) {
      const errorMsg = 'El campo de contraseña no puede estar vacío';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }
    
    return true;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setError(null);
      await login(formData.email, formData.password);
      
      if (formData.remember) {
        localStorage.setItem('rememberUser', formData.email);
      } else {
        localStorage.removeItem('rememberUser');
      }
      
      showNotification('Inicio de sesión exitoso', 'success');
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      
      const errorMsg = err.message && typeof err.message === 'string'
        ? err.message
        : 'Error al iniciar sesión';
        
      if (errorMsg.includes('Correo o contraseña incorrectos') || errorMsg.includes('Error de autenticación')) {
        const message = 'Credenciales incorrectas. Verifica tu correo y contraseña';
        showNotification(message, 'error');
        setError('Correo o contraseña incorrectos. Por favor, verifica tus credenciales e intenta nuevamente.');
      } else if (errorMsg.includes('Error de conexión')) {
        const message = 'No se pudo conectar al servidor';
        showNotification(message, 'error');
        setError('No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.');
      } else {
        showNotification('Error al iniciar sesión: ' + errorMsg, 'error');
        setError('No se pudo iniciar sesión. Por favor, intenta nuevamente más tarde.');
      }
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100">
      {/* Elementos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      {/* Título del Comité y línea arcoíris */}
      <div className="relative z-20">
        <div className="flex justify-between items-center px-8 pt-8">
          <h1 
            className="text-4xl font-bold"
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
            className="h-24 w-auto object-contain"
          />
        </div>
        <div 
          className="h-1 w-full mt-2"
          style={{
            background: 'linear-gradient(to right, #ff0000, #ff8000, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)'
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
                Acceso para Administradores
              </h2>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-500 text-sm">⚠️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-red-800 text-sm mb-1" style={{ fontFamily: "'Recoleta Medium', serif" }}>
                        Error de Autenticación
                      </p>
                      <p className="text-red-700 text-sm" style={{ fontFamily: "'Recoleta Light', serif" }}>
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleLogin} noValidate>
                {/* Campo Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-corporate-primary" 
                         style={{ fontFamily: "'Recoleta Medium', serif" }}>
                    Correo Electrónico
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="h-4 w-4 text-gray-400 group-focus-within:text-corporate-secondary transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-corporate-secondary focus:border-transparent transition-all duration-300 hover:bg-white/90"
                      style={{ fontFamily: "'Recoleta Light', serif" }}
                      disabled={loading}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                {/* Campo Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-corporate-primary" 
                         style={{ fontFamily: "'Recoleta Medium', serif" }}>
                    Contraseña
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="h-4 w-4 text-gray-400 group-focus-within:text-corporate-secondary transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-11 pr-12 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-corporate-secondary focus:border-transparent transition-all duration-300 hover:bg-white/90 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                      style={{ fontFamily: "'Recoleta Light', serif" }}
                      disabled={loading}
                      placeholder="••••••••"
                    />
                    {formData.password && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-corporate-secondary transition-colors focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? 
                          <IoEyeOffOutline className="h-5 w-5 transition-transform hover:scale-110" /> : 
                          <IoEyeOutline className="h-5 w-5 transition-transform hover:scale-110" />
                        }
                      </button>
                    )}
                  </div>
                </div>

                {/* Opciones adicionales */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      id="remember-me"
                      name="remember"
                      type="checkbox"
                      checked={formData.remember}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-corporate-secondary focus:ring-corporate-secondary transition-colors"
                      disabled={loading}
                    />
                    <label htmlFor="remember-me" className="text-sm text-gray-600 font-medium" 
                           style={{ fontFamily: "'Recoleta Light', serif" }}>
                      Recordar sesión
                    </label>
                  </div>

                  <button 
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-corporate-secondary hover:text-corporate-primary transition-colors font-medium"
                    style={{ fontFamily: "'Recoleta Light', serif" }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={loading}
                    className="flex-1 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:text-corporate-primary font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:bg-white hover:border-corporate-primary transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Recoleta Medium', serif" }}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                      <span>Volver</span>
                    </div>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#1e3766] via-[#2563eb] to-[#3b82f6] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed hover:from-[#2563eb] hover:via-[#3b82f6] hover:to-[#60a5fa] backdrop-blur-sm"
                    style={{ fontFamily: "'Recoleta Medium', serif" }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <FaSpinner className="animate-spin text-lg" />
                        <span>Iniciando sesión...</span>
                      </div>
                    ) : (
                      <span>Iniciar Sesión</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm animate-fade-in animation-delay-300" 
               style={{ fontFamily: "'Recoleta Light', serif" }}>
            © {new Date().getFullYear()} El Comité. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;