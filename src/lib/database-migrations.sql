-- Migración de base de datos para sistema de outbound marketing
-- Basado en el análisis del archivo streamlit_dashboard.py

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS insaidr 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE insaidr;

-- Tabla para estadísticas de envíos
CREATE TABLE IF NOT EXISTS stats_envios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    cuenta VARCHAR(100) NOT NULL,
    funnel VARCHAR(100) NOT NULL,
    tipo_via VARCHAR(50) NOT NULL,
    identificador_via VARCHAR(255) NOT NULL,
    tipo_actividad VARCHAR(50) NOT NULL,
    enviados INT DEFAULT 0,
    fallidos INT DEFAULT 0,
    limite_alcanzado INT DEFAULT 0,
    ultimo_envio DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para optimizar consultas
    INDEX idx_fecha (fecha),
    INDEX idx_cuenta (cuenta),
    INDEX idx_funnel (funnel),
    INDEX idx_tipo_via (tipo_via),
    INDEX idx_fecha_cuenta (fecha, cuenta),
    
    -- Índice único para evitar duplicados
    UNIQUE KEY unique_envio (fecha, cuenta, funnel, tipo_via, identificador_via, tipo_actividad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para estadísticas de respuestas
CREATE TABLE IF NOT EXISTS stats_respuestas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    cuenta VARCHAR(100) NOT NULL,
    funnel VARCHAR(100) NOT NULL,
    tipo_via VARCHAR(50) NOT NULL,
    identificador_via VARCHAR(255) NOT NULL,
    total_respuestas INT DEFAULT 0,
    cualificados INT DEFAULT 0,
    interesados INT DEFAULT 0,
    no_interesados INT DEFAULT 0,
    agendados INT DEFAULT 0,
    no_cualifica INT DEFAULT 0,
    respuestas_automaticas INT DEFAULT 0,
    otros INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para optimizar consultas
    INDEX idx_fecha (fecha),
    INDEX idx_cuenta (cuenta),
    INDEX idx_funnel (funnel),
    INDEX idx_tipo_via (tipo_via),
    INDEX idx_fecha_cuenta (fecha, cuenta),
    
    -- Índice único para evitar duplicados
    UNIQUE KEY unique_respuesta (fecha, cuenta, funnel, tipo_via, identificador_via)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para alias de vías (para hacer más legibles los nombres)
CREATE TABLE IF NOT EXISTS vias_alias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cuenta VARCHAR(100) NOT NULL,
    tipo_via VARCHAR(50) NOT NULL,
    identificador VARCHAR(255) NOT NULL,
    alias VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_cuenta (cuenta),
    INDEX idx_tipo_via (tipo_via),
    INDEX idx_activo (activo),
    
    -- Índice único
    UNIQUE KEY unique_alias (cuenta, tipo_via, identificador)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para usuarios (opcional, para futuras funcionalidades)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    role ENUM('admin', 'user', 'viewer') DEFAULT 'user',
    cuenta VARCHAR(100) NULL, -- Asociar usuario a una cuenta específica
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_cuenta (cuenta),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para configuración de cuentas
CREATE TABLE IF NOT EXISTS cuentas_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cuenta VARCHAR(100) NOT NULL UNIQUE,
    nombre_completo VARCHAR(255) NOT NULL,
    descripcion TEXT NULL,
    limites_diarios JSON NULL, -- Configuración de límites por tipo de vía
    configuracion JSON NULL, -- Configuración adicional
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_cuenta (cuenta),
    INDEX idx_activa (activa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo para testing
INSERT INTO cuentas_config (cuenta, nombre_completo, descripcion) VALUES
('test_account', 'Cuenta de Prueba', 'Cuenta para testing del sistema'),
('cliente_demo', 'Cliente Demo', 'Cliente de demostración')
ON DUPLICATE KEY UPDATE 
    nombre_completo = VALUES(nombre_completo),
    descripcion = VALUES(descripcion);

-- Insertar datos de ejemplo para stats_envios
INSERT INTO stats_envios (fecha, cuenta, funnel, tipo_via, identificador_via, tipo_actividad, enviados, fallidos, limite_alcanzado) VALUES
('2024-01-15', 'test_account', 'Funnel Demo', 'email', 'test@example.com', 'initial_outreach', 100, 5, 0),
('2024-01-15', 'test_account', 'Funnel Demo', 'linkedin', 'linkedin_profile_1', 'connection_request', 50, 2, 0),
('2024-01-16', 'test_account', 'Funnel Demo', 'email', 'test@example.com', 'follow_up', 80, 3, 0),
('2024-01-16', 'cliente_demo', 'Campaign A', 'email', 'demo@client.com', 'initial_outreach', 200, 10, 1)
ON DUPLICATE KEY UPDATE 
    enviados = VALUES(enviados),
    fallidos = VALUES(fallidos),
    limite_alcanzado = VALUES(limite_alcanzado);

-- Insertar datos de ejemplo para stats_respuestas
INSERT INTO stats_respuestas (fecha, cuenta, funnel, tipo_via, identificador_via, total_respuestas, cualificados, interesados, agendados) VALUES
('2024-01-15', 'test_account', 'Funnel Demo', 'email', 'test@example.com', 12, 8, 6, 3),
('2024-01-15', 'test_account', 'Funnel Demo', 'linkedin', 'linkedin_profile_1', 8, 5, 4, 2),
('2024-01-16', 'test_account', 'Funnel Demo', 'email', 'test@example.com', 10, 7, 5, 2),
('2024-01-16', 'cliente_demo', 'Campaign A', 'email', 'demo@client.com', 25, 18, 15, 8)
ON DUPLICATE KEY UPDATE 
    total_respuestas = VALUES(total_respuestas),
    cualificados = VALUES(cualificados),
    interesados = VALUES(interesados),
    agendados = VALUES(agendados);

-- Insertar alias de ejemplo
INSERT INTO vias_alias (cuenta, tipo_via, identificador, alias) VALUES
('test_account', 'email', 'test@example.com', 'Email Principal - Test'),
('test_account', 'linkedin', 'linkedin_profile_1', 'LinkedIn - Perfil Principal'),
('cliente_demo', 'email', 'demo@client.com', 'Email Corporativo - Demo')
ON DUPLICATE KEY UPDATE 
    alias = VALUES(alias);

-- Crear vistas útiles para análisis
CREATE OR REPLACE VIEW vista_resumen_diario AS
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
GROUP BY e.fecha, e.cuenta, e.funnel, e.tipo_via, e.identificador_via, e.tipo_actividad, va.alias; 