// Tipos para las tablas principales de la base de datos

export interface StatsEnvios {
  id: number;
  fecha: string;
  cuenta: string;
  funnel: string;
  tipo_via: string;
  identificador_via: string;
  tipo_actividad: string;
  enviados: number;
  fallidos: number;
  limite_alcanzado: number;
  ultimo_envio?: string;
  created_at: string;
  updated_at: string;
}

export interface StatsRespuestas {
  id: number;
  fecha: string;
  cuenta: string;
  funnel: string;
  tipo_via: string;
  identificador_via: string;
  total_respuestas: number;
  cualificados: number;
  interesados: number;
  no_interesados: number;
  agendados: number;
  no_cualifica: number;
  respuestas_automaticas: number;
  otros: number;
  created_at: string;
  updated_at: string;
}

export interface ViasAlias {
  id: number;
  cuenta: string;
  tipo_via: string;
  identificador: string;
  alias: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CuentasConfig {
  id: number;
  cuenta: string;
  nombre_completo: string;
  descripcion?: string;
  limites_diarios?: any; // JSON
  configuracion?: any; // JSON
  activa: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash?: string;
  role: 'admin' | 'user' | 'viewer';
  cuenta?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos para datos procesados/calculados
export interface DashboardData {
  fecha: string;
  cuenta: string;
  funnel: string;
  origen: string;
  tipo_via: string;
  tipo_actividad: string;
  total_enviados: number;
  total_fallidos: number;
  limites_alcanzados: number;
  total_respuestas: number;
  total_cualificados: number;
  total_interesados: number;
  total_agendados: number;
  tasa_respuesta: number;
  tasa_conversion: number;
  tasa_entrega: number;
}

export interface MetricasResumen {
  total_cuentas: number;
  total_funnels: number;
  total_origenes: number;
  total_enviados: number;
  total_fallidos: number;
  total_limites: number;
  total_respuestas: number;
  total_cualificados: number;
  total_agendados: number;
  tasa_respuesta_global: number;
  tasa_conversion_global: number;
  tasa_entrega_global: number;
}

// Tipos para filtros
export interface DatabaseFilters {
  fechaInicio?: string;
  fechaFin?: string;
  cuenta?: string;
  funnel?: string;
  tipoVia?: string;
}

// Tipos para inserción de datos
export interface InsertStatsEnvios {
  fecha: string;
  cuenta: string;
  funnel: string;
  tipoVia: string;
  identificadorVia: string;
  tipoActividad: string;
  enviados: number;
  fallidos?: number;
  limiteAlcanzado?: number;
  ultimoEnvio?: string;
}

export interface InsertStatsRespuestas {
  fecha: string;
  cuenta: string;
  funnel: string;
  tipoVia: string;
  identificadorVia: string;
  totalRespuestas: number;
  cualificados?: number;
  interesados?: number;
  noInteresados?: number;
  agendados?: number;
  noCualifica?: number;
  respuestasAutomaticas?: number;
  otros?: number;
}

export interface InsertViaAlias {
  cuenta: string;
  tipoVia: string;
  identificador: string;
  alias: string;
  activo?: boolean;
}

// Tipos para respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DatabaseStructure {
  stats_envios: boolean;
  stats_respuestas: boolean;
  vias_alias: boolean;
  users: boolean;
  cuentas_config: boolean;
}

// Tipos para el dashboard (compatibles con Streamlit)
export interface OutboundMetrics {
  contactos_alcanzados: number;
  tasa_entrega: number;
  respuestas_obtenidas: number;
  tasa_respuesta: number;
  leads_cualificados: number;
  tasa_cualificacion: number;
  meetings_agendados: number;
  tasa_conversion: number;
  limites_alcanzados: number;
}

export interface ClientePerformance {
  cliente: string;
  total_enviados: number;
  total_fallidos: number;
  total_respuestas: number;
  total_cualificados: number;
  total_agendados: number;
  limites_alcanzados: number;
  tasa_entrega: number;
  tasa_respuesta: number;
  tasa_conversion: number;
}

export interface OrigenPerformance {
  origen: string;
  tipo_via: string;
  total_enviados: number;
  total_fallidos: number;
  total_respuestas: number;
  total_cualificados: number;
  total_agendados: number;
  limites_alcanzados: number;
  tasa_entrega: number;
  tasa_respuesta: number;
  tasa_conversion: number;
}

export interface TimeSeriesData {
  fecha: string;
  enviados: number;
  fallidos: number;
  respuestas: number;
  cualificados: number;
  agendados: number;
}

export interface FunnelData {
  step: string;
  value: number;
  percentage: number;
  percentage_previous: number;
}

// Enums para valores constantes
export enum TipoVia {
  EMAIL = 'email',
  LINKEDIN = 'linkedin',
  PHONE = 'phone',
  WHATSAPP = 'whatsapp',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  OTHER = 'other'
}

export enum TipoActividad {
  INITIAL_OUTREACH = 'initial_outreach',
  FOLLOW_UP = 'follow_up',
  CONNECTION_REQUEST = 'connection_request',
  DIRECT_MESSAGE = 'direct_message',
  EMAIL_SEQUENCE = 'email_sequence',
  COLD_CALL = 'cold_call',
  WARM_CALL = 'warm_call',
  OTHER = 'other'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer'
}

export enum EstadoRespuesta {
  CUALIFICADO = 'cualificado',
  INTERESADO = 'interesado',
  NO_INTERESADO = 'no_interesado',
  AGENDADO = 'agendado',
  NO_CUALIFICA = 'no_cualifica',
  RESPUESTA_AUTOMATICA = 'respuesta_automatica',
  OTRO = 'otro'
}

// Tipos para configuraciones
export interface LimitesDiarios {
  [key: string]: {
    limite_diario: number;
    limite_semanal: number;
    limite_mensual: number;
    activo: boolean;
  };
}

export interface ConfiguracionCuenta {
  zona_horaria: string;
  idioma: string;
  moneda: string;
  notificaciones: {
    email: boolean;
    limites_alcanzados: boolean;
    resumen_diario: boolean;
  };
  integraciones: {
    [key: string]: {
      activo: boolean;
      configuracion: any;
    };
  };
} 