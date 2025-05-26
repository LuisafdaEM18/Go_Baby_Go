import { api, loginWithFormData } from './api';
import { AdminUser, LoginResponse, RegisterData } from './types';

// Get current user from localStorage
export const getCurrentUser = (): AdminUser | null => {
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      return JSON.parse(userString) as AdminUser;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }
  return null;
};

// Register a new admin
export const register = async (data: RegisterData): Promise<AdminUser> => {
  return api.post<AdminUser>('/auth/register', data, false);
};

// Login with username and password
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  return loginWithFormData(username, password);
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAdmin = (): boolean => {
  return !!localStorage.getItem('token');
}; 