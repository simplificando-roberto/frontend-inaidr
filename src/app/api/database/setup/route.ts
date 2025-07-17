import { NextResponse } from 'next/server';
import { runMigrations, checkDatabaseStructure } from '@/lib/database-setup';
import { testConnection } from '@/lib/database';

export async function GET() {
  try {
    // Verificar conexión
    const connectionTest = await testConnection();
    if (!connectionTest) {
      return NextResponse.json({ 
        success: false, 
        message: 'Error de conexión a la base de datos' 
      }, { status: 500 });
    }

    // Verificar estructura actual
    const currentStructure = await checkDatabaseStructure();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos conectada correctamente',
      structure: currentStructure
    });
  } catch (error) {
    console.error('Error en setup:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error verificando la base de datos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Ejecutar migraciones
    const migrationResult = await runMigrations();
    
    if (!migrationResult) {
      return NextResponse.json({ 
        success: false, 
        message: 'Error ejecutando migraciones' 
      }, { status: 500 });
    }

    // Verificar estructura después de migraciones
    const finalStructure = await checkDatabaseStructure();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Migraciones ejecutadas correctamente',
      structure: finalStructure
    });
  } catch (error) {
    console.error('Error ejecutando migraciones:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error ejecutando migraciones',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
} 