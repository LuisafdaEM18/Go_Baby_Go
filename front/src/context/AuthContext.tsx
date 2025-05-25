import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../services/types';
import { login as apiLogin, logout as apiLogout, getCurrentUser, isAdmin } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that wraps the app
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuth = () => {
      if (isAdmin()) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiLogin(username, password);
      setUser({
        id: response.id,
        nombre: response.nombre,
        correo: response.correo
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 