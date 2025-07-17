# Configuración de Base de Datos MySQL para Sistema de Outbound Marketing

Este documento describe cómo configurar y usar la base de datos MySQL para el sistema de outbound marketing compatible con el dashboard de Streamlit.

## 📋 Requisitos Previos

- Node.js 18+
- MySQL 8.0+
- Acceso a servidor MySQL remoto (configurado en `.env`)

## 🔧 Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install mysql2
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
DB_HOST="108.181.197.152"
DB_PORT="15780"
DB_USER="admin"
DB_PASSWORD="JYoKn2e1"
MYSQL_DATABASE="insaidr"
```

### 3. Ejecutar Script de Configuración

```bash
node scripts/setup-database.js
```

Este script:
- ✅ Prueba la conexión a la base de datos
- 🚀 Ejecuta las migraciones SQL
- 🔍 Verifica que todas las tablas fueron creadas
- 📊 Muestra datos de ejemplo
- 🧪 Ejecuta pruebas de funcionalidad

## 📊 Estructura de la Base de Datos

### Tablas Principales

#### `stats_envios`
Almacena estadísticas de envíos de outbound marketing:
- `fecha`: Fecha del envío
- `cuenta`: Cliente/cuenta
- `funnel`: Nombre del funnel/campaña
- `tipo_via`: Tipo de canal (email, linkedin, etc.)
- `identificador_via`: Identificador único del canal
- `tipo_actividad`: Tipo de actividad (initial_outreach, follow_up, etc.)
- `enviados`: Número de contactos enviados
- `fallidos`: Número de envíos fallidos
- `limite_alcanzado`: Número de límites alcanzados

#### `stats_respuestas`
Almacena estadísticas de respuestas:
- `fecha`: Fecha de la respuesta
- `cuenta`: Cliente/cuenta
- `funnel`: Nombre del funnel/campaña
- `tipo_via`: Tipo de canal
- `identificador_via`: Identificador único del canal
- `total_respuestas`: Número total de respuestas
- `cualificados`: Leads cualificados
- `interesados`: Leads interesados
- `agendados`: Meetings agendados
- `no_interesados`: Leads no interesados
- `otros`: Otras categorías

#### `vias_alias`
Almacena alias legibles para los canales:
- `cuenta`: Cliente/cuenta
- `tipo_via`: Tipo de canal
- `identificador`: Identificador original
- `alias`: Nombre legible para mostrar

#### `users`
Usuarios del sistema:
- `name`: Nombre del usuario
- `email`: Email del usuario
- `role`: Rol (admin, user, viewer)
- `cuenta`: Cuenta asociada

#### `cuentas_config`
Configuración de cuentas:
- `cuenta`: Identificador de la cuenta
- `nombre_completo`: Nombre completo de la cuenta
- `limites_diarios`: Configuración de límites (JSON)
- `configuracion`: Configuración adicional (JSON)

### Vista Agregada

#### `vista_resumen_diario`
Vista que combina datos de envíos y respuestas con métricas calculadas:
- Todos los campos de las tablas principales
- `tasa_respuesta`: Porcentaje de respuestas
- `tasa_conversion`: Porcentaje de conversión
- `tasa_entrega`: Porcentaje de entrega

## 🚀 Uso de la API

### Endpoints Disponibles

#### 1. Probar Conexión
```bash
GET /api/test-db
```

#### 2. Configurar Base de Datos
```bash
# Verificar estructura
GET /api/database/setup

# Ejecutar migraciones
POST /api/database/setup
```

#### 3. Obtener Estadísticas
```bash
# Dashboard completo
GET /api/stats?type=dashboard

# Solo envíos
GET /api/stats?type=envios

# Solo respuestas
GET /api/stats?type=respuestas

# Resumen ejecutivo
GET /api/stats?type=resumen
```

#### 4. Filtros Disponibles
```bash
GET /api/stats?type=dashboard&fechaInicio=2024-01-01&fechaFin=2024-01-31&cuenta=cliente_demo
```

Parámetros de filtro:
- `fechaInicio`: Fecha de inicio (YYYY-MM-DD)
- `fechaFin`: Fecha de fin (YYYY-MM-DD)
- `cuenta`: Cliente específico
- `funnel`: Funnel específico
- `tipoVia`: Tipo de canal específico

## 🔨 Funciones TypeScript

### Importar Funciones

```typescript
import { 
  getDashboardData, 
  getStatsEnvios, 
  getStatsRespuestas,
  insertStatsEnvios,
  insertStatsRespuestas,
  createOrUpdateViaAlias
} from '@/lib/database-setup';
```

### Ejemplos de Uso

#### Obtener Datos del Dashboard
```typescript
const data = await getDashboardData({
  fechaInicio: '2024-01-01',
  fechaFin: '2024-01-31',
  cuenta: 'cliente_demo'
});
```

#### Insertar Estadísticas de Envíos
```typescript
await insertStatsEnvios({
  fecha: '2024-01-15',
  cuenta: 'cliente_demo',
  funnel: 'Campaign A',
  tipoVia: 'email',
  identificadorVia: 'demo@client.com',
  tipoActividad: 'initial_outreach',
  enviados: 100,
  fallidos: 5
});
```

#### Crear Alias para Canal
```typescript
await createOrUpdateViaAlias({
  cuenta: 'cliente_demo',
  tipoVia: 'email',
  identificador: 'demo@client.com',
  alias: 'Email Principal - Cliente Demo'
});
```

## 🧪 Datos de Ejemplo

Al ejecutar las migraciones, se insertan datos de ejemplo:

### Cuentas de Ejemplo
- `test_account`: Cuenta de prueba
- `cliente_demo`: Cliente de demostración

### Estadísticas de Ejemplo
- Envíos por email y LinkedIn
- Respuestas con diferentes estados
- Alias para canales

## 📱 Compatibilidad con Streamlit

La estructura de la base de datos está diseñada para ser compatible con el dashboard de Streamlit existente. Las queries utilizadas en el dashboard funcionan directamente con esta estructura.

### Funciones Principales del Dashboard

El dashboard de Streamlit incluye:
- 📈 Resumen ejecutivo con KPIs
- 👥 Rendimiento por cliente
- 📍 Análisis por origen/canal
- 🎯 Embudo de conversión
- 📅 Análisis temporal
- 🚨 Alertas automáticas

## 🔧 Mantenimiento

### Backup de Datos
```bash
mysqldump -h 108.181.197.152 -P 15780 -u admin -p insaidr > backup_$(date +%Y%m%d).sql
```

### Limpiar Datos de Prueba
```sql
DELETE FROM stats_envios WHERE cuenta LIKE 'test%';
DELETE FROM stats_respuestas WHERE cuenta LIKE 'test%';
```

### Optimizar Tablas
```sql
OPTIMIZE TABLE stats_envios, stats_respuestas, vias_alias;
```

## 🐛 Troubleshooting

### Error de Conexión
1. Verificar variables de entorno en `.env`
2. Comprobar conectividad de red
3. Verificar credenciales de MySQL

### Error en Migraciones
1. Verificar permisos de usuario MySQL
2. Comprobar sintaxis SQL
3. Revisar logs de MySQL

### Performance Issues
1. Verificar índices en tablas
2. Optimizar queries con EXPLAIN
3. Considerar particionamiento por fecha

## 📚 Recursos Adicionales

- [Documentación de MySQL](https://dev.mysql.com/doc/)
- [mysql2 Node.js Driver](https://github.com/sidorares/node-mysql2)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver archivo LICENSE para más detalles.

---

¿Necesitas ayuda? Contacta al equipo de desarrollo o revisa los logs de la aplicación para más información sobre errores específicos. 