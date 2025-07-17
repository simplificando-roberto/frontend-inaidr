#!/usr/bin/env node
/**
 * Script para configurar y probar la base de datos MySQL
 * Ejecutar con: node scripts/setup-database.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true // Permitir múltiples statements
};

console.log('🔧 Configuración de base de datos:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database
});

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('SELECT 1 as test');
    await connection.end();
    console.log('✅ Conexión exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

async function runMigrations() {
  try {
    console.log('🚀 Ejecutando migraciones...');
    
    // Leer archivo de migración
    const migrationPath = path.join(__dirname, '..', 'src', 'lib', 'database-migrations.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Crear conexión
    const connection = await mysql.createConnection(dbConfig);
    
    // Ejecutar migración
    await connection.execute(migrationSQL);
    console.log('✅ Migraciones ejecutadas correctamente');
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error.message);
    return false;
  }
}

async function checkTables() {
  try {
    console.log('🔍 Verificando tablas...');
    
    const connection = await mysql.createConnection(dbConfig);
    
    const tables = ['stats_envios', 'stats_respuestas', 'vias_alias', 'users', 'cuentas_config'];
    const results = {};
    
    for (const table of tables) {
      const [rows] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
      results[table] = rows.length > 0;
      console.log(`  ${results[table] ? '✅' : '❌'} ${table}`);
    }
    
    await connection.end();
    return results;
  } catch (error) {
    console.error('❌ Error verificando tablas:', error.message);
    return {};
  }
}

async function showSampleData() {
  try {
    console.log('📊 Mostrando datos de ejemplo...');
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Mostrar stats_envios
    const [envios] = await connection.execute('SELECT * FROM stats_envios LIMIT 5');
    console.log('\n📤 Stats Envíos:');
    console.table(envios);
    
    // Mostrar stats_respuestas
    const [respuestas] = await connection.execute('SELECT * FROM stats_respuestas LIMIT 5');
    console.log('\n💬 Stats Respuestas:');
    console.table(respuestas);
    
    // Mostrar vias_alias
    const [alias] = await connection.execute('SELECT * FROM vias_alias LIMIT 5');
    console.log('\n🔗 Vías Alias:');
    console.table(alias);
    
    // Mostrar vista_resumen_diario
    const [resumen] = await connection.execute('SELECT * FROM vista_resumen_diario LIMIT 5');
    console.log('\n📈 Vista Resumen Diario:');
    console.table(resumen);
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Error mostrando datos:', error.message);
    return false;
  }
}

async function runTests() {
  try {
    console.log('🧪 Ejecutando pruebas de funcionalidad...');
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Prueba 1: Insertar datos de prueba
    const testData = {
      fecha: new Date().toISOString().split('T')[0],
      cuenta: 'test_automated',
      funnel: 'Test Funnel',
      tipo_via: 'email',
      identificador_via: 'test@automated.com',
      tipo_actividad: 'initial_outreach',
      enviados: 10,
      fallidos: 1
    };
    
    console.log('  ✅ Insertando datos de prueba...');
    await connection.execute(`
      INSERT INTO stats_envios (fecha, cuenta, funnel, tipo_via, identificador_via, tipo_actividad, enviados, fallidos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE enviados = VALUES(enviados), fallidos = VALUES(fallidos)
    `, [testData.fecha, testData.cuenta, testData.funnel, testData.tipo_via, testData.identificador_via, testData.tipo_actividad, testData.enviados, testData.fallidos]);
    
    // Prueba 2: Consultar datos insertados
    console.log('  ✅ Consultando datos insertados...');
    const [inserted] = await connection.execute('SELECT * FROM stats_envios WHERE cuenta = ? AND fecha = ?', [testData.cuenta, testData.fecha]);
    console.log(`    Encontrados ${inserted.length} registros`);
    
    // Prueba 3: Probar vista agregada
    console.log('  ✅ Probando vista agregada...');
    const [aggregated] = await connection.execute('SELECT * FROM vista_resumen_diario WHERE cuenta = ? AND fecha = ?', [testData.cuenta, testData.fecha]);
    console.log(`    Vista agregada: ${aggregated.length} registros`);
    
    // Limpiar datos de prueba
    console.log('  🧹 Limpiando datos de prueba...');
    await connection.execute('DELETE FROM stats_envios WHERE cuenta = ?', [testData.cuenta]);
    
    await connection.end();
    console.log('✅ Todas las pruebas pasaron correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    return false;
  }
}

async function main() {
  console.log('🎯 Iniciando configuración de base de datos para sistema de outbound marketing\n');
  
  // Paso 1: Probar conexión
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('❌ No se pudo conectar. Verifica la configuración en el archivo .env');
    process.exit(1);
  }
  
  console.log('');
  
  // Paso 2: Ejecutar migraciones
  const migrationsOk = await runMigrations();
  if (!migrationsOk) {
    console.error('❌ Error ejecutando migraciones');
    process.exit(1);
  }
  
  console.log('');
  
  // Paso 3: Verificar tablas
  const tablesOk = await checkTables();
  const allTablesExist = Object.values(tablesOk).every(exists => exists);
  
  if (!allTablesExist) {
    console.error('❌ No todas las tablas fueron creadas correctamente');
    process.exit(1);
  }
  
  console.log('');
  
  // Paso 4: Mostrar datos de ejemplo
  await showSampleData();
  
  console.log('');
  
  // Paso 5: Ejecutar pruebas
  const testsOk = await runTests();
  if (!testsOk) {
    console.error('❌ Las pruebas fallaron');
    process.exit(1);
  }
  
  console.log('\n🎉 ¡Configuración de base de datos completada exitosamente!');
  console.log('');
  console.log('📋 Próximos pasos:');
  console.log('  1. Ejecutar: npm run dev');
  console.log('  2. Visitar: http://localhost:3000/api/test-db');
  console.log('  3. Visitar: http://localhost:3000/api/database/setup');
  console.log('  4. Visitar: http://localhost:3000/api/stats');
  console.log('');
  console.log('🔗 Endpoints disponibles:');
  console.log('  • GET /api/test-db - Probar conexión');
  console.log('  • GET /api/database/setup - Verificar estructura');
  console.log('  • POST /api/database/setup - Ejecutar migraciones');
  console.log('  • GET /api/stats?type=dashboard - Obtener datos del dashboard');
  console.log('  • GET /api/stats?type=envios - Obtener estadísticas de envíos');
  console.log('  • GET /api/stats?type=respuestas - Obtener estadísticas de respuestas');
  console.log('  • GET /api/stats?type=resumen - Obtener resumen ejecutivo');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testConnection, runMigrations, checkTables, showSampleData, runTests }; 