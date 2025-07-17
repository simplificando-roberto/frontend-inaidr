import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/database';

export async function GET() {
  try {
    await testConnection();
    return NextResponse.json({ 
      success: true, 
      message: 'Conexión a la base de datos exitosa' 
    });
  } catch (error) {
    console.error('Error en la conexión:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al conectar con la base de datos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
} 