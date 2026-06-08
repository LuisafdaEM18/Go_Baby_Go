import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCurrentUser, logout, isAdmin } from '../services/authService';

describe('authService', () => {
  beforeEach(() => {
    // Configurar Mock de localStorage en memoria para entorno Node
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
      };
    })();
    vi.stubGlobal('localStorage', localStorageMock);
  });

  it('getCurrentUser deberia retornar null si no hay sesion iniciada', () => {
    expect(getCurrentUser()).toBeNull();
  });

  it('getCurrentUser deberia retornar el usuario parseado de localStorage', () => {
    const mockUser = { id: 1, nombre: 'Admin Test', correo: 'admin_test@gobabygo.org' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    expect(getCurrentUser()).toEqual(mockUser);
  });

  it('isAdmin deberia retornar true si existe un token en localStorage', () => {
    expect(isAdmin()).toBe(false);
    localStorage.setItem('token', 'token-valido-ejemplo');
    expect(isAdmin()).toBe(true);
  });

  it('logout deberia remover el token y el usuario de localStorage', () => {
    localStorage.setItem('token', 'token-valido-ejemplo');
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
