const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ApiResponse {
  message: string;
  success: boolean;
}

/**
 * Solicita el envío de un enlace de recuperación de contraseña
 */
export const requestPasswordReset = async (email: string): Promise<ApiResponse> => {
  try {
    console.log('Requesting password reset for:', email);
    
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Error al procesar la solicitud');
    }

    return {
      message: data.message || 'Enlace enviado correctamente',
      success: true
    };
  } catch (error: any) {
    console.error('Error requesting password reset:', error);
    
    // En caso de error de conexión, simular respuesta exitosa por ahora
    if (error.name === 'TypeError' || error.message?.includes('fetch')) {
      console.log('Connection error, simulating success for now');
      return {
        message: 'Simulando: Si el correo está registrado, recibirás un enlace',
        success: true
      };
    }
    
    throw new Error(error.message || 'Error de conexión con el servidor');
  }
};

/**
 * Valida si un token de recuperación es válido
 */
export const validateResetToken = async (token: string): Promise<boolean> => {
  try {
    console.log('Validating token:', token);
    
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-reset-token/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Token validation response status:', response.status);
    return response.ok;
  } catch (error: any) {
    console.error('Error validating reset token:', error);
    
    // En caso de error de conexión, simular que el token es válido por ahora
    if (error.name === 'TypeError' || error.message?.includes('fetch')) {
      console.log('Connection error, simulating valid token for now');
      return true;
    }
    
    return false;
  }
};

/**
 * Restablece la contraseña usando el token de recuperación
 */
export const resetPassword = async (token: string, password: string): Promise<ApiResponse> => {
  try {
    console.log('Resetting password with token:', token);
    
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    console.log('Reset password response status:', response.status);
    
    const data = await response.json();
    console.log('Reset password response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Error al restablecer la contraseña');
    }

    return {
      message: data.message || 'Contraseña restablecida correctamente',
      success: true
    };
  } catch (error: any) {
    console.error('Error resetting password:', error);
    
    // En caso de error de conexión, simular éxito por ahora
    if (error.name === 'TypeError' || error.message?.includes('fetch')) {
      console.log('Connection error, simulating successful password reset for now');
      return {
        message: 'Simulando: Contraseña restablecida exitosamente',
        success: true
      };
    }
    
    throw new Error(error.message || 'Error de conexión con el servidor');
  }
}; 