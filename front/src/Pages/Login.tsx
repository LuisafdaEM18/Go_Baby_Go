import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

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
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    // Check if both fields are empty
    if (!formData.email.trim() && !formData.password.trim()) {
      const errorMsg = 'Por favor, ingresa tu correo y contraseña';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }
    
    // Check for empty email
    if (!formData.email.trim()) {
      const errorMsg = 'El campo de correo electrónico no puede estar vacío';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      const errorMsg = 'El formato del correo electrónico es inválido';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return false;
    }
    
    // Check for empty password
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
    
    // Validate form fields before submission
    if (!validateForm()) {
      return;
    }
    
    try {
      setError(null);
      
      // Call the login function from context
      await login(formData.email, formData.password);
      
      // If successful, store remember preference
      if (formData.remember) {
        localStorage.setItem('rememberUser', formData.email);
      } else {
        localStorage.removeItem('rememberUser');
      }
      
      showNotification('Inicio de sesión exitoso', 'success');
      // Redirect to dashboard - this will happen automatically via the useEffect
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      
      // Show notification for error
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-6xl font-extrabold text-blue-900">
            El Comité
          </h2>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-medium">Error de inicio de sesión</p>
              <p>{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleLogin} noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={loading}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={loading}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordar cuenta
                </label>
              </div>

              <button 
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-blue-900 hover:text-indigo-500 cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Contenedor para los botones alineados horizontalmente */}
            <div className="flex space-x-4">
               <button
                type="submit"
                className="flex-1 px-6 py-2 rounded-md font-semibold shadow transition"
                style={{
                  backgroundColor: '#1e3766',
                  color: 'white',
                  fontFamily: "'Recoleta', serif",
                  opacity: loading ? 0.7 : 1
                }}
                disabled={loading}
              >
                {loading ? 'Iniciando...' : 'Iniciar sesión'}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-6 py-2 rounded-md font-semibold shadow transition"
                style={{
                  backgroundColor: '#1e3766',
                  color: 'white',
                  fontFamily: "'Recoleta', serif"
                }}
                disabled={loading}
              >
                Regresar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;