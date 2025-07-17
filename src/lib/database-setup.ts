import { readFileSync } from 'fs';
import { join } from 'path';
import { executeQuery, getConnection, testConnection } from './database';

// Función para ejecutar el archivo de migración
export const runMigrations = async () => {
  try {
    console.log('🚀 Iniciando migración de base de datos...');
    
    // Leer el archivo de migración
    const migrationPath = join(process.cwd(), 'src', 'lib', 'database-migrations.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    // Dividir en statements individuales
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📄 Ejecutando ${statements.length} statements SQL...`);
    
    // Ejecutar cada statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await executeQuery(statement);
          console.log(`✅ Statement ${i + 1}/${statements.length} ejecutado`);
        } catch (error) {
          console.error(`❌ Error en statement ${i + 1}:`, error);
          console.error('SQL:', statement);
        }
      }
    }
    
    console.log('🎉 Migración completada exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    return false;
  }
};

// Función para verificar si las tablas existen
export const checkDatabaseStructure = async () => {
  try {
    const tables = ['stats_envios', 'stats_respuestas', 'vias_alias', 'users', 'cuentas_config'];
    const results = {};
    
    for (const table of tables) {
      const query = `SHOW TABLES LIKE '${table}'`;
      const result = await executeQuery(query);
      results[table] = Array.isArray(result) ? result.length > 0 : false;
    }
    
    return results;
  } catch (error) {
    console.error('Error verificando estructura de BD:', error);
    return {};
  }
};

// Función para obtener estadísticas de envíos
export const getStatsEnvios = async (filters: {
  fechaInicio?: string;
  fechaFin?: string;
  cuenta?: string;
  funnel?: string;
  tipoVia?: string;
} = {}) => {
  try {
    let query = `
      SELECT 
        e.*,
        COALESCE(va.alias, CONCAT(e.tipo_via, ' - ', e.identificador_via)) as origen_display
      FROM stats_envios e
      LEFT JOIN vias_alias va ON (
        e.cuenta = va.cuenta AND 
        e.tipo_via = va.tipo_via AND 
        e.identificador_via = va.identificador AND 
        va.activo = TRUE
      )
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.fechaInicio) {
      query += ` AND e.fecha >= ?`;
      params.push(filters.fechaInicio);
    }
    
    if (filters.fechaFin) {
      query += ` AND e.fecha <= ?`;
      params.push(filters.fechaFin);
    }
    
    if (filters.cuenta) {
      query += ` AND e.cuenta = ?`;
      params.push(filters.cuenta);
    }
    
    if (filters.funnel) {
      query += ` AND e.funnel = ?`;
      params.push(filters.funnel);
    }
    
    if (filters.tipoVia) {
      query += ` AND e.tipo_via = ?`;
      params.push(filters.tipoVia);
    }
    
    query += ` ORDER BY e.fecha DESC, e.cuenta, e.funnel`;
    
    return await executeQuery(query, params);
  } catch (error) {
    console.error('Error obteniendo estadísticas de envíos:', error);
    throw error;
  }
};

// Función para obtener estadísticas de respuestas
export const getStatsRespuestas = async (filters: {
  fechaInicio?: string;
  fechaFin?: string;
  cuenta?: string;
  funnel?: string;
  tipoVia?: string;
} = {}) => {
  try {
    let query = `
      SELECT 
        r.*,
        COALESCE(va.alias, CONCAT(r.tipo_via, ' - ', r.identificador_via)) as origen_display
      FROM stats_respuestas r
      LEFT JOIN vias_alias va ON (
        r.cuenta = va.cuenta AND 
        r.tipo_via = va.tipo_via AND 
        r.identificador_via = va.identificador AND 
        va.activo = TRUE
      )
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.fechaInicio) {
      query += ` AND r.fecha >= ?`;
      params.push(filters.fechaInicio);
    }
    
    if (filters.fechaFin) {
      query += ` AND r.fecha <= ?`;
      params.push(filters.fechaFin);
    }
    
    if (filters.cuenta) {
      query += ` AND r.cuenta = ?`;
      params.push(filters.cuenta);
    }
    
    if (filters.funnel) {
      query += ` AND r.funnel = ?`;
      params.push(filters.funnel);
    }
    
    if (filters.tipoVia) {
      query += ` AND r.tipo_via = ?`;
      params.push(filters.tipoVia);
    }
    
    query += ` ORDER BY r.fecha DESC, r.cuenta, r.funnel`;
    
    return await executeQuery(query, params);
  } catch (error) {
    console.error('Error obteniendo estadísticas de respuestas:', error);
    throw error;
  }
};

// Función para obtener resumen combinado (similar al dashboard de Streamlit)
export const getDashboardData = async (filters: {
  fechaInicio?: string;
  fechaFin?: string;
  cuenta?: string;
  funnel?: string;
  tipoVia?: string;
} = {}) => {
  try {
    let query = `
      SELECT 
        e.fecha,
        e.cuenta,
        e.funnel,
        COALESCE(va.alias, CONCAT(e.tipo_via, ' - ', e.identificador_via)) as origen,
        e.tipo_via,
        e.tipo_actividad,
        SUM(e.enviados) as total_enviados,
        SUM(e.fallidos) as total_fallidos,
        SUM(e.limite_alcanzado) as limites_alcanzados,
        COALESCE(SUM(r.total_respuestas), 0) as total_respuestas,
        COALESCE(SUM(r.cualificados), 0) as total_cualificados,
        COALESCE(SUM(r.interesados), 0) as total_interesados,
        COALESCE(SUM(r.agendados), 0) as total_agendados,
        CASE 
          WHEN SUM(e.enviados) > 0 THEN 
            ROUND((COALESCE(SUM(r.total_respuestas), 0) / SUM(e.enviados)) * 100, 2)
          ELSE 0 
        END as tasa_respuesta,
        CASE 
          WHEN SUM(e.enviados) > 0 THEN 
            ROUND((COALESCE(SUM(r.agendados), 0) / SUM(e.enviados)) * 100, 2)
          ELSE 0 
        END as tasa_conversion,
        CASE 
          WHEN SUM(e.enviados) > 0 THEN 
            ROUND(((SUM(e.enviados) - SUM(e.fallidos)) / SUM(e.enviados)) * 100, 2)
          ELSE 0 
        END as tasa_entrega
      FROM stats_envios e
      LEFT JOIN vias_alias va ON (
        e.cuenta = va.cuenta AND 
        e.tipo_via = va.tipo_via AND 
        e.identificador_via = va.identificador AND 
        va.activo = TRUE
      )
      LEFT JOIN stats_respuestas r ON (
        e.fecha = r.fecha AND 
        e.cuenta = r.cuenta AND 
        e.funnel = r.funnel AND 
        e.tipo_via = r.tipo_via AND 
        e.identificador_via = r.identificador_via
      )
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.fechaInicio) {
      query += ` AND e.fecha >= ?`;
      params.push(filters.fechaInicio);
    }
    
    if (filters.fechaFin) {
      query += ` AND e.fecha <= ?`;
      params.push(filters.fechaFin);
    }
    
    if (filters.cuenta) {
      query += ` AND e.cuenta = ?`;
      params.push(filters.cuenta);
    }
    
    if (filters.funnel) {
      query += ` AND e.funnel = ?`;
      params.push(filters.funnel);
    }
    
    if (filters.tipoVia) {
      query += ` AND e.tipo_via = ?`;
      params.push(filters.tipoVia);
    }
    
    query += ` 
      GROUP BY e.fecha, e.cuenta, e.funnel, e.tipo_via, e.identificador_via, e.tipo_actividad, va.alias
      ORDER BY e.fecha DESC, e.cuenta, e.funnel
    `;
    
    return await executeQuery(query, params);
  } catch (error) {
    console.error('Error obteniendo datos del dashboard:', error);
    throw error;
  }
};

// Función para insertar estadísticas de envíos
export const insertStatsEnvios = async (data: {
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
}) => {
  try {
    const query = `
      INSERT INTO stats_envios (
        fecha, cuenta, funnel, tipo_via, identificador_via, tipo_actividad, 
        enviados, fallidos, limite_alcanzado, ultimo_envio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        enviados = VALUES(enviados),
        fallidos = VALUES(fallidos),
        limite_alcanzado = VALUES(limite_alcanzado),
        ultimo_envio = VALUES(ultimo_envio),
        updated_at = CURRENT_TIMESTAMP
    `;
    
    const params = [
      data.fecha,
      data.cuenta,
      data.funnel,
      data.tipoVia,
      data.identificadorVia,
      data.tipoActividad,
      data.enviados,
      data.fallidos || 0,
      data.limiteAlcanzado || 0,
      data.ultimoEnvio || null
    ];
    
    return await executeQuery(query, params);
  } catch (error) {
    console.error('Error insertando estadísticas de envíos:', error);
    throw error;
  }
};

// Función para insertar estadísticas de respuestas
export const insertStatsRespuestas = async (data: {
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
}) => {
  try {
    const query = `
      INSERT INTO stats_respuestas (
        fecha, cuenta, funnel, tipo_via, identificador_via, 
        total_respuestas, cualificados, interesados, no_interesados, 
        agendados, no_cualifica, respuestas_automaticas, otros
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        total_respuestas = VALUES(total_respuestas),
        cualificados = VALUES(cualificados),
        interesados = VALUES(interesados),
        no_interesados = VALUES(no_interesados),
        agendados = VALUES(agendados),
        no_cualifica = VALUES(no_cualifica),
        respuestas_automaticas = VALUES(respuestas_automaticas),
        otros = VALUES(otros),
        updated_at = CURRENT_TIMESTAMP
    `;
    
    const params = [
      data.fecha,
      data.cuenta,
      data.funnel,
      data.tipoVia,
      data.identificadorVia,
      data.totalRespuestas,
      data.cualificados || 0,
      data.interesados || 0,
      data.noInteresados || 0,
      data.agendados || 0,
      data.noCualifica || 0,
      data.respuestasAutomaticas || 0,
      data.otros || 0
    ];
    
    return await executeQuery(query, params);
  } catch (error) {
    console.error('Error insertando estadísticas de respuestas:', error);
    throw error;
  }
};

// Función para crear o actualizar alias de vías
export const createOrUpdateViaAlias = async (data: {
  cuenta: string;
  tipoVia: string;
  identificador: string;
  alias: string;
  activo?: boolean;
}) => {
  try {
    const query = `
      INSERT INTO vias_alias (cuenta, tipo_via, identificador, alias, activo)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        alias = VALUES(alias),
        activo = VALUES(activo),
        updated_at = CURRENT_TIMESTAMP
    `;
    
    const params = [
      data.cuenta,
      data.tipoVia,
      data.identificador,
      data.alias,
      data.activo ?? true
    ];
    
    return await executeQuery(query, params);
  } catch (error) {
    console.error('Error creando/actualizando alias:', error);
    throw error;
  }
};

// Función para obtener métricas resumidas
export const getMetricasResumen = async (filters: {
  fechaInicio?: string;
  fechaFin?: string;
  cuenta?: string;
} = {}) => {
  try {
    let query = `
      SELECT 
        COUNT(DISTINCT e.cuenta) as total_cuentas,
        COUNT(DISTINCT e.funnel) as total_funnels,
        COUNT(DISTINCT CONCAT(e.tipo_via, ':', e.identificador_via)) as total_origenes,
        SUM(e.enviados) as total_enviados,
        SUM(e.fallidos) as total_fallidos,
        SUM(e.limite_alcanzado) as total_limites,
        COALESCE(SUM(r.total_respuestas), 0) as total_respuestas,
        COALESCE(SUM(r.cualificados), 0) as total_cualificados,
        COALESCE(SUM(r.agendados), 0) as total_agendados,
        CASE 
          WHEN SUM(e.enviados) > 0 THEN 
            ROUND((COALESCE(SUM(r.total_respuestas), 0) / SUM(e.enviados)) * 100, 2)
          ELSE 0 
        END as tasa_respuesta_global,
        CASE 
          WHEN SUM(e.enviados) > 0 THEN 
            ROUND((COALESCE(SUM(r.agendados), 0) / SUM(e.enviados)) * 100, 2)
          ELSE 0 
        END as tasa_conversion_global,
        CASE 
          WHEN SUM(e.enviados) > 0 THEN 
            ROUND(((SUM(e.enviados) - SUM(e.fallidos)) / SUM(e.enviados)) * 100, 2)
          ELSE 0 
        END as tasa_entrega_global
      FROM stats_envios e
      LEFT JOIN stats_respuestas r ON (
        e.fecha = r.fecha AND 
        e.cuenta = r.cuenta AND 
        e.funnel = r.funnel AND 
        e.tipo_via = r.tipo_via AND 
        e.identificador_via = r.identificador_via
      )
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.fechaInicio) {
      query += ` AND e.fecha >= ?`;
      params.push(filters.fechaInicio);
    }
    
    if (filters.fechaFin) {
      query += ` AND e.fecha <= ?`;
      params.push(filters.fechaFin);
    }
    
    if (filters.cuenta) {
      query += ` AND e.cuenta = ?`;
      params.push(filters.cuenta);
    }
    
    const result = await executeQuery(query, params);
    return Array.isArray(result) ? result[0] : result;
  } catch (error) {
    console.error('Error obteniendo métricas de resumen:', error);
    throw error;
  }
}; 