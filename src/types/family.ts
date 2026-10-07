/**
 * Tipos e interfaces de datos para Familia Hub
 * Modelado estricto sin "any" para garantizar robustez y tipado completo.
 */

export type UserRole =
  | 'padre'
  | 'madre'
  | 'hijo'
  | 'hija'
  | 'abuelo'
  | 'abuela'
  | 'tio'
  | 'tia'
  | 'pareja'
  | 'hermano'
  | 'otro';

export type ColorTheme = 'terracotta' | 'salvia' | 'indigo' | 'ciruela' | 'ambar';

export interface FamilyUser {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
  apodo_IA: string;
  comida_fav: string;
  cumpleanos: string; // YYYY-MM-DD
  avatar_url: string;
  bio_ia?: string;
  fecha_ingreso?: string;
  color_acento?: string;
}

export type PostType = 'foto' | 'texto';
export type PostCategory = 'receta' | 'recuerdo' | 'logro' | 'viaje';

export interface PostReaction {
  id: string;
  user_id: string;
  emoji: '❤️' | '😂' | '👏' | '🥺' | '🥘';
  label: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  autor_id: string;
  contenido: string;
  fecha: string;
}

export interface PostMetadata {
  resumen_ia?: string;
  sentimiento?: string;
  etiquetas?: string[];
}

export interface FamilyPost {
  id: string;
  autor_id: string;
  tipo: PostType;
  categoria: PostCategory;
  contenido: string;
  imagen_url?: string;
  fecha: string; // ISO string
  ia_metadata?: PostMetadata;
  editado?: boolean;
  reacciones: PostReaction[];
  comentarios: PostComment[];
  es_recuerdo_especial?: boolean; // Para "En este día"
}

export interface EventChecklistItem {
  id: string;
  titulo: string;
  asignado_a?: string; // User ID
  completado: boolean;
}

export type AttendanceStatus = 'voy' | 'no_voy' | 'tal_vez';

export interface FamilyEvent {
  id: string;
  creador_id: string;
  titulo: string;
  descripcion?: string;
  fecha: string; // YYYY-MM-DD
  hora?: string; // HH:mm
  ubicacion: string;
  tipo: 'asado' | 'cumpleanos' | 'reunion' | 'viaje' | 'cena';
  asistencias: Record<string, AttendanceStatus>; // userId -> status
  items_necesarios: EventChecklistItem[];
  creado_en: string;
}

export interface Recipe {
  id: string;
  creador_id: string;
  titulo: string;
  descripcion: string;
  tiempo_minutos: number;
  porciones: number;
  categoria: 'plato_fuerte' | 'postre' | 'asado' | 'desayuno';
  ingredientes: string[];
  pasos: string[];
  imagen_url: string;
  secreto_familiar?: string;
  creada_en: string;
}

export interface TimeCapsule {
  id: string;
  creador_id: string;
  titulo: string;
  contenido_encriptado: string;
  fecha_apertura: string; // ISO date
  creada_en: string;
  esta_abierta: boolean;
}

export interface DailyStatus {
  id: string;
  user_id: string;
  emoji_status: string;
  texto_status: string;
  timestamp: string;
}

export interface HallOfFameQuote {
  id: string;
  frase: string;
  autor_frase_id: string;
  publicador_id: string;
  anio: number;
  contexto: string;
  fecha: string;
}

export interface DailyChallenge {
  id: string;
  pregunta: string;
  categoria: string;
  fecha: string;
  respuestas: Array<{
    id: string;
    user_id: string;
    respuesta: string;
    timestamp: string;
  }>;
}

export interface AudioStory {
  id: string;
  titulo: string;
  narrador_id: string;
  duracion_segundos: number;
  transcripcion_ia: string;
  fecha_grabacion: string;
  audio_url?: string;
}

export interface FamilyNotification {
  id: string;
  user_id: string; // recipient
  actor_id: string; // who performed action
  tipo: 'reaccion' | 'comentario' | 'post' | 'evento' | 'recuerdo' | 'estado';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  target_id?: string;
}

export type NavigationTab = 'muro' | 'calendario' | 'tesoro' | 'perfil';
