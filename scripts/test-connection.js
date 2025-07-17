const mysql = require('mysql2/promise');

async function testConnection() {
  const dbConfig = {
    host: "108.181.197.152",
    port: 15780,
    user: "admin",
    password: "JYoKn2e1",
    database: "insaidr"
  };

  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Probar conexión básica
    const [result] = await connection.execute('SELECT 1 as test');
    console.log('✅ Conexión exitosa');
    
    // Mostrar tablas
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📊 Tablas disponibles:');
    tables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${Object.values(table)[0]}`);
    });
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

testConnection(); 