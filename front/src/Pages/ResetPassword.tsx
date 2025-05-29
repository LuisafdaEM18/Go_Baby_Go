import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import { validateResetToken, resetPassword } from '../services/passwordResetService';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const token = searchParams.get('token');

  useEffect(() => {
    const validateTokenAsync = async () => {
      if (!token) {
        setError('Token de recuperación no válido');
        setIsValidating(false);
        return;
      }

      try {
        const isValid = await validateResetToken(token);
        if (isValid) {
          setIsValidToken(true);
        } else {
          setError('El enlace de recuperación ha expirado o es inválido');
        }
      } catch (err) {
        console.error('Error validating token:', err);
        setError('Error al validar el enlace de recuperación');
      } finally {
        setIsValidating(false);
      }
    };

    validateTokenAsync();
  }, [token]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.password) {
      const errorMsg = 'Por favor, ingresa tu nueva contraseña';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      showNotification(passwordError, 'error');
      return;
    }

    if (!formData.confirmPassword) {
      const errorMsg = 'Por favor, confirma tu nueva contraseña';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Las contraseñas no coinciden';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      return;
    }

    if (!token) {
      setError('Token de recuperación no válido');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await resetPassword(token, formData.password);
      setIsSuccess(true);
      showNotification('Contraseña restablecida exitosamente', 'success');
      
    } catch (err: any) {
      console.error('Error al restablecer contraseña:', err);
      const errorMsg = err.message || 'Error al restablecer la contraseña';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: 'bg-gray-200' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;

    const strengths = [
      { strength: 0, label: '', color: 'bg-gray-200' },
      { strength: 20, label: 'Muy débil', color: 'bg-red-500' },
      { strength: 40, label: 'Débil', color: 'bg-orange-500' },
      { strength: 60, label: 'Regular', color: 'bg-yellow-500' },
      { strength: 80, label: 'Fuerte', color: 'bg-green-500' },
      { strength: 100, label: 'Muy fuerte', color: 'bg-green-600' }
    ];

    return strengths[score] || strengths[0];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Validando enlace de recuperación...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken && error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-2xl text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Enlace inválido
            </h2>
            
            <p className="text-gray-600 mb-6">
              {error}
            </p>

            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full form-button-primary px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Solicitar nuevo enlace
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Contraseña restablecida!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full form-button-primary px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Ir al inicio de sesión
            </button>
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
          <p className="text-gray-600">Restablecer contraseña</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLock className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nueva contraseña
            </h3>
            <p className="text-gray-600 text-sm">
              Ingresa tu nueva contraseña. Debe ser segura y fácil de recordar.
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
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Fuerza de la contraseña</span>
                    <span className={`font-medium ${passwordStrength.strength >= 80 ? 'text-green-600' : 'text-gray-600'}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center text-xs">
                  {formData.password === formData.confirmPassword ? (
                    <div className="flex items-center text-green-600">
                      <FaCheckCircle className="mr-1" />
                      Las contraseñas coinciden
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <FaExclamationTriangle className="mr-1" />
                      Las contraseñas no coinciden
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 mb-2">Requisitos de la contraseña:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                  <span className="mr-2">{formData.password.length >= 8 ? '✓' : '•'}</span>
                  Al menos 8 caracteres
                </li>
                <li className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <span className="mr-2">{/(?=.*[a-z])/.test(formData.password) ? '✓' : '•'}</span>
                  Una letra minúscula
                </li>
                <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <span className="mr-2">{/(?=.*[A-Z])/.test(formData.password) ? '✓' : '•'}</span>
                  Una letra mayúscula
                </li>
                <li className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <span className="mr-2">{/(?=.*\d)/.test(formData.password) ? '✓' : '•'}</span>
                  Un número
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full form-button-primary px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
              disabled={isLoading || formData.password !== formData.confirmPassword || !formData.password}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Restableciendo contraseña...
                </>
              ) : (
                <>
                  <FaLock className="mr-2" />
                  Restablecer contraseña
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 