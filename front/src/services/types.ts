// Common interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Auth interfaces
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  id: number;
  nombre: string;
  correo: string;
}

export interface LoginResponse extends AdminUser {
  token: string;
}

export interface RegisterData {
  nombre: string;
  correo: string;
  contrasena: string;
}

// Formulario interfaces
export interface Opcion {
  id?: number;
  texto_opcion: string;
  es_correcta?: boolean;
}

export interface Pregunta {
  id?: number;
  texto: string;
  tipo: 'textual' | 'seleccion_multiple' | 'seleccion_unica';
  opciones: Opcion[];
}

export interface Formulario {
  id?: number;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: string;
  preguntas: Pregunta[];
}

// Evento interfaces
export interface Evento {
  id?: number;
  nombre: string;
  fecha_evento: string;
  lugar: string;
  descripcion: string;
  formulario_pre?: Formulario;
  formulario_post?: Formulario;
  formulario_pre_evento?: number;
  formulario_post_evento?: number;
}

export interface EventoWithStats extends Evento {
  total_voluntarios: number;
  voluntarios_aceptados: number;
}

// Voluntario interfaces
export interface Voluntario {
  id?: number;
  nombre: string;
  correo: string;
  confirmacion_correo: string;
  numero_identificacion: string;
}

export interface VoluntarioInscripcion extends Voluntario {
  evento_id: number;
  aceptacion_terminos: boolean;
}

export interface Inscripcion {
  id: number;
  voluntario_id: number;
  evento_id: number;
  fecha_inscripcion: string;
  aceptado: boolean;
  completado_pre: boolean;
  completado_post: boolean;
  aceptacion_terminos: boolean;
  voluntario?: Voluntario;
  evento?: Evento;
}

// Inscripción detallada con voluntario y respuestas
export interface InscripcionDetallada extends Inscripcion {
  voluntario: Voluntario;
  respuestas_pre?: RespuestaFormulario[];
  respuestas_post?: RespuestaFormulario[];
}

// Respuesta a formulario con detalles
export interface RespuestaFormulario {
  pregunta_id: number;
  pregunta_texto: string;
  tipo_pregunta: 'textual' | 'seleccion_unica' | 'seleccion_multiple';
  respuesta_texto?: string;
  opciones_seleccionadas?: string[];
}

// Respuestas interfaces
export interface RespuestaDetalle {
  [pregunta_id: string]: string | number | string[] | { opcion_id: number };
}

export interface RespuestaEnvio {
  inscripcion_id: number;
  tipo_formulario: 'pre' | 'post';
  respuestas: RespuestaDetalle;
} 