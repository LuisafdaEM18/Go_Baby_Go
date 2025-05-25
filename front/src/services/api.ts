// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Helper functions for HTTP requests
const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic request handler
const handleRequest = async <T>(
  url: string,
  method: string,
  body?: any,
  includeAuth = true
): Promise<T> => {
  try {
    const options: RequestInit = {
      method,
      headers: getHeaders(includeAuth),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${url}`, options);
    
    // For DELETE requests with 204 status
    if (response.status === 204) {
      return {} as T;
    }

    // Handle empty responses
    if (response.status === 200 && response.headers.get('content-length') === '0') {
      return {} as T;
    }

    // Try to parse JSON response, handle text response if JSON fails
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (e) {
        console.warn('Failed to parse JSON response:', e);
        data = { message: 'No se pudo procesar la respuesta del servidor' };
      }
    } else {
      try {
        data = await response.text();
        data = { message: data || 'Sin datos' };
      } catch (e) {
        console.warn('Failed to parse text response:', e);
        data = { message: 'Respuesta vacía del servidor' };
      }
    }

    // Handle not found or empty results
    if (response.status === 404) {
      console.info(`Resource not found: ${url}`);
      if (Array.isArray(data)) {
        return [] as unknown as T;
      }
      return {} as T;
    }

    if (!response.ok) {
      const errorMessage = data.detail || data.message || 'Error desconocido';
      console.error(`API error (${response.status}): ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // For list endpoints returning empty arrays
    if (Array.isArray(data) && data.length === 0) {
      console.info(`Empty results for ${url}`);
    }

    return data as T;
  } catch (error: any) {
    // Check for network errors
    if (error instanceof TypeError && error.message.includes('NetworkError')) {
      console.error('Network error - Server may be down:', error);
      throw new Error('Error de conexión con el servidor');
    }
    
    // Check for timeout
    if (error instanceof TypeError && error.message.includes('timeout')) {
      console.error('Request timeout:', error);
      throw new Error('La solicitud tardó demasiado tiempo');
    }
    
    // Log and re-throw
    console.error('API request error:', error);
    throw error;
  }
};

// Helper methods for different HTTP methods
export const api = {
  get: <T>(url: string, includeAuth = true): Promise<T> => 
    handleRequest<T>(`/api${url}`, 'GET', undefined, includeAuth),
  
  post: <T>(url: string, body: any, includeAuth = true): Promise<T> => 
    handleRequest<T>(`/api${url}`, 'POST', body, includeAuth),
  
  put: <T>(url: string, body: any, includeAuth = true): Promise<T> => 
    handleRequest<T>(`/api${url}`, 'PUT', body, includeAuth),
  
  delete: <T>(url: string, includeAuth = true): Promise<T> => 
    handleRequest<T>(`/api${url}`, 'DELETE', undefined, includeAuth)
};

// Authentication helper
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Login method for form data
export const loginWithFormData = async (username: string, password: string) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  try {
    console.log('Attempting login with:', username);
    
    // Input validation before making the API call
    if (!username.trim() || !password.trim()) {
      console.error('Empty username or password');
      throw new Error('Debes proporcionar un correo y contraseña');
    }
    
    // Use the same approach as the working test page
    const response = await fetch('http://localhost:8001/api/auth/login', {
      method: 'POST',
      body: formData
    });
    
    console.log('Login response status:', response.status);
    
    // Handle connection errors
    if (!response) {
      console.error('No response from server');
      throw new Error('No se pudo conectar al servidor');
    }
    
    let data;
    try {
      data = await response.json();
      console.log('Login response data:', data);
    } catch (e) {
      console.error('Error parsing login response:', e);
      throw new Error('Error en la respuesta del servidor');
    }

    if (!response.ok) {
      console.error('Login failed with status:', response.status, data);
      // Pass through the specific error message from the backend
      if (response.status === 401) {
        if (data.detail && data.detail.includes('Credentials incorrect')) {
          throw new Error('Correo o contraseña incorrectos');
        } else {
          throw new Error(data.detail || 'Credenciales incorrectas');
        }
      } else if (response.status === 422) {
        throw new Error('Formato de datos inválido');
      } else {
        throw new Error(data.detail || 'Error de autenticación');
      }
    }

    // Validate response data
    if (!data.token) {
      console.error('Login response missing token');
      throw new Error('Respuesta de autenticación inválida');
    }

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      nombre: data.nombre,
      correo: data.correo
    }));
    console.log('Login successful, user data stored in localStorage');

    return data;
  } catch (error) {
    console.error('Login error details:', error);
    throw error;
  }
};

// Logout method
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login page or update application state
}; 