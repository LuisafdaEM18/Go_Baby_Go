import { api } from './api';
import { Voluntario, VoluntarioInscripcion, Inscripcion, RespuestaEnvio } from './types';

// Get all voluntarios (admin only)
export const getVoluntarios = async (): Promise<Voluntario[]> => {
  return api.get<Voluntario[]>('/voluntarios');
};

// Get voluntario by ID
export const getVoluntarioById = async (id: number): Promise<Voluntario> => {
  return api.get<Voluntario>(`/voluntarios/${id}`);
};

// Create new voluntario
export const createVoluntario = async (voluntario: Voluntario): Promise<Voluntario> => {
  return api.post<Voluntario>('/voluntarios', voluntario);
};

// Inscribir voluntario a evento
export const inscribirVoluntario = async (inscripcion: VoluntarioInscripcion): Promise<Inscripcion> => {
  return api.post<Inscripcion>('/voluntarios/inscripcion', inscripcion, false);
};

// Get inscripciones for an evento
export const getInscripcionesByEvento = async (eventoId: number): Promise<Inscripcion[]> => {
  return api.get<Inscripcion[]>(`/voluntarios/inscripciones/evento/${eventoId}`);
};

// Aceptar/rechazar inscripción
export const actualizarEstadoInscripcion = async (inscripcionId: number, aceptado: boolean): Promise<Inscripcion> => {
  return api.put<Inscripcion>(`/voluntarios/inscripciones/${inscripcionId}/aceptar`, { aceptado });
};

// Guardar respuestas de formulario pre o post
export const guardarRespuestas = async (data: RespuestaEnvio): Promise<{codigo_respuesta: string}> => {
  const { inscripcion_id, tipo_formulario, respuestas } = data;
  return api.post<{codigo_respuesta: string}>(
    `/voluntarios/inscripciones/${inscripcion_id}/respuestas/${tipo_formulario}`,
    respuestas,
    false
  );
}; 