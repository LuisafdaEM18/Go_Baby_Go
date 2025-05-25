import { api } from './api';
import { Evento, EventoWithStats } from './types';

// Get all eventos
export const getEventos = async (): Promise<Evento[]> => {
  return api.get<Evento[]>('/eventos');
};

// Get all eventos with statistics
export const getEventosWithStats = async (): Promise<EventoWithStats[]> => {
  return api.get<EventoWithStats[]>('/eventos/stats');
};

// Get evento by ID
export const getEventoById = async (id: number): Promise<Evento> => {
  return api.get<Evento>(`/eventos/${id}`);
};

// Create new evento
export const createEvento = async (evento: Evento): Promise<Evento> => {
  return api.post<Evento>('/eventos', evento);
};

// Update evento
export const updateEvento = async (id: number, evento: Evento): Promise<Evento> => {
  return api.put<Evento>(`/eventos/${id}`, evento);
};

// Delete evento
export const deleteEvento = async (id: number): Promise<void> => {
  return api.delete<void>(`/eventos/${id}`);
}; 