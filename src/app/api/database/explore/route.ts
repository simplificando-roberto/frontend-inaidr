import { NextResponse } from 'next/server';
import { executeQuery, testConnection } from '@/lib/database';

export async function GET() {
  try {
    console.log('🔍 Explorando base de datos existente...');
    
    // Probar conexión primero
    const connectionTest = await testConnection();
    if (!connectionTest) {
      return NextResponse.json({ 
        success: false, 
        message: 'No se pudo conectar a la base de datos' 
      }, { status: 500 });
    }

    // Obtener todas las tablas
    const tables = await executeQuery('SHOW TABLES');
    
    console.log('📊 Tablas encontradas:', tables);
    
    let tableInfo: { [key: string]: any } = {};
    
    if (Array.isArray(tables)) {
      // Explorar cada tabla
      for (const table of tables) {
        const tableName = Object.values(table)[0] as string;
        
        try {
          // Obtener estructura de la tabla
          const structure = await executeQuery(`DESCRIBE ${tableName}`);
          
          // Contar registros
          const countResult = await executeQuery(`SELECT COUNT(*) as total FROM ${tableName}`);
          const count = Array.isArray(countResult) && countResult.length > 0 ? (countResult[0] as any).total : 0;
          
          // Obtener muestra de datos si hay registros
          let sampleData = null;
          if (count > 0) {
            sampleData = await executeQuery(`SELECT * FROM ${tableName} LIMIT 3`);
          }
          
          tableInfo[tableName] = {
            structure,
            count,
            sampleData
          };
          
        } catch (error) {
          console.error(`Error explorando tabla ${tableName}:`, error);
          tableInfo[tableName] = {
            error: error instanceof Error ? error.message : 'Error desconocido'
          };
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos explorada exitosamente',
      tables: tableInfo
    });
    
  } catch (error) {
    console.error('Error explorando base de datos:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error explorando base de datos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
} 