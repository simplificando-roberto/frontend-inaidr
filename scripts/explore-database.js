const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

async function exploreDatabase() {
  try {
    console.log('🔍 Explorando base de datos existente...');
    console.log('📝 Configuración:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Mostrar todas las tablas
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📊 Tablas encontradas:');
    tables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${Object.values(table)[0]}`);
    });
    
    // Explorar stats_envios si existe
    try {
      console.log('\n📤 Explorando stats_envios...');
      const [enviosCount] = await connection.execute('SELECT COUNT(*) as total FROM stats_envios');
      console.log(`   Total registros: ${enviosCount[0].total}`);
      
      if (enviosCount[0].total > 0) {
        const [enviosSample] = await connection.execute('SELECT * FROM stats_envios LIMIT 2');
        console.log('\n   Muestra de datos:');
        console.table(enviosSample);
      }
      
    } catch (e) {
      console.log('\n❌ stats_envios no encontrada o error:', e.message);
    }
    
    // Explorar stats_respuestas si existe
    try {
      console.log('\n💬 Explorando stats_respuestas...');
      const [respuestasCount] = await connection.execute('SELECT COUNT(*) as total FROM stats_respuestas');
      console.log(`   Total registros: ${respuestasCount[0].total}`);
      
      if (respuestasCount[0].total > 0) {
        const [respuestasSample] = await connection.execute('SELECT * FROM stats_respuestas LIMIT 2');
        console.log('\n   Muestra de datos:');
        console.table(respuestasSample);
      }
      
    } catch (e) {
      console.log('\n❌ stats_respuestas no encontrada o error:', e.message);
    }
    
    await connection.end();
    console.log('\n✅ Exploración completada');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

exploreDatabase(); 