import { api } from './api';
import { Formulario } from './types';

// Get all formularios
export const getFormularios = async (): Promise<Formulario[]> => {
  return api.get<Formulario[]>('/formularios');
};

// Get formulario by ID
export const getFormularioById = async (id: number): Promise<Formulario> => {
  return api.get<Formulario>(`/formularios/${id}`);
};

// Create new formulario
export const createFormulario = async (formulario: Formulario): Promise<Formulario> => {
  return api.post<Formulario>('/formularios', formulario);
};

// Update formulario
export const updateFormulario = async (id: number, formulario: Formulario): Promise<Formulario> => {
  return api.put<Formulario>(`/formularios/${id}`, formulario);
};

// Delete formulario
export const deleteFormulario = async (id: number): Promise<void> => {
  return api.delete<void>(`/formularios/${id}`);
}; 