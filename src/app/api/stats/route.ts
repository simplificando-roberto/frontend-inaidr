import { NextRequest, NextResponse } from 'next/server';
import { getDashboardData, getStatsEnvios, getStatsRespuestas, getMetricasResumen } from '@/lib/database-setup';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obtener parámetros de filtros
    const filters = {
      fechaInicio: searchParams.get('fechaInicio') || undefined,
      fechaFin: searchParams.get('fechaFin') || undefined,
      cuenta: searchParams.get('cuenta') || undefined,
      funnel: searchParams.get('funnel') || undefined,
      tipoVia: searchParams.get('tipoVia') || undefined,
    };
    
    // Obtener tipo de datos solicitados
    const dataType = searchParams.get('type') || 'dashboard';
    
    let data;
    
    switch (dataType) {
      case 'envios':
        data = await getStatsEnvios(filters);
        break;
      case 'respuestas':
        data = await getStatsRespuestas(filters);
        break;
      case 'resumen':
        data = await getMetricasResumen(filters);
        break;
      case 'dashboard':
      default:
        data = await getDashboardData(filters);
        break;
    }
    
    return NextResponse.json({ 
      success: true, 
      data,
      filters: filters,
      type: dataType
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error obteniendo estadísticas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    if (!type || !data) {
      return NextResponse.json({ 
        success: false, 
        message: 'Tipo y datos son requeridos' 
      }, { status: 400 });
    }
    
    // Aquí puedes agregar lógica para insertar datos
    // Por ejemplo, insertStatsEnvios o insertStatsRespuestas
    
    return NextResponse.json({ 
      success: true, 
      message: 'Funcionalidad de inserción pendiente de implementar' 
    });
  } catch (error) {
    console.error('Error procesando datos:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error procesando datos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
} 