import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obtener parámetros de filtros
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');
    const cuenta = searchParams.get('cuenta');
    
    // Query para obtener datos combinados de envíos y respuestas (datos agregados)
    let query = `
      SELECT 
        e.cuenta,
        e.identificador_via,
        e.tipo_via,
        e.tipo_actividad,
        e.funnel,
        SUM(e.enviados) as total_enviados,
        SUM(e.fallidos) as total_fallidos,
        SUM(e.limite_alcanzado) as total_limites,
        COUNT(DISTINCT e.fecha) as dias_activos,
        MAX(e.ultimo_envio) as ultimo_envio,
        COALESCE(SUM(r.total_respuestas), 0) as total_respuestas,
        COALESCE(SUM(r.cualificados), 0) as total_cualificados,
        COALESCE(SUM(r.interesados), 0) as total_interesados,
        COALESCE(SUM(r.no_interesados), 0) as total_no_interesados,
        COALESCE(SUM(r.agendados), 0) as total_agendados,
        COALESCE(SUM(r.no_cualifica), 0) as total_no_cualifica,
        COALESCE(SUM(r.respuestas_automaticas), 0) as total_respuestas_automaticas,
        COALESCE(SUM(r.otros), 0) as total_otros,
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
    
    if (fechaInicio) {
      query += ` AND e.fecha >= ?`;
      params.push(fechaInicio);
    }
    
    if (fechaFin) {
      query += ` AND e.fecha <= ?`;
      params.push(fechaFin);
    }
    
    if (cuenta) {
      query += ` AND e.cuenta = ?`;
      params.push(cuenta);
    }
    
    query += ` 
      GROUP BY e.cuenta, e.identificador_via, e.tipo_via, e.tipo_actividad, e.funnel
      ORDER BY e.cuenta, e.identificador_via, e.tipo_actividad, SUM(e.enviados) DESC
    `;
    
    const rawData = await executeQuery(query, params);
    
    // Query para obtener datos por día (para gráficos y "enviados hoy")
    let queryDiario = `
      SELECT 
        e.cuenta,
        e.identificador_via,
        e.tipo_via,
        e.tipo_actividad,
        e.funnel,
        e.fecha,
        SUM(e.enviados) as enviados_dia,
        SUM(e.fallidos) as fallidos_dia,
        SUM(e.limite_alcanzado) as limites_dia,
        COALESCE(SUM(r.total_respuestas), 0) as respuestas_dia,
        COALESCE(SUM(r.agendados), 0) as agendados_dia
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
    
    // Aplicar los mismos filtros al query diario
    const paramsDiario = [];
    if (fechaInicio) {
      queryDiario += ` AND e.fecha >= ?`;
      paramsDiario.push(fechaInicio);
    }
    if (fechaFin) {
      queryDiario += ` AND e.fecha <= ?`;
      paramsDiario.push(fechaFin);
    }
    if (cuenta) {
      queryDiario += ` AND e.cuenta = ?`;
      paramsDiario.push(cuenta);
    }
    
    queryDiario += ` 
      GROUP BY e.cuenta, e.identificador_via, e.tipo_via, e.tipo_actividad, e.funnel, e.fecha
      ORDER BY e.fecha DESC
    `;
    
    const dataDiaria = await executeQuery(queryDiario, paramsDiario);
    
    // Organizar datos jerárquicamente
    const hierarchicalData: { [key: string]: any } = {};
    
    if (Array.isArray(rawData)) {
      for (const row of rawData) {
        const rowData = row as any;
        const clienteKey = rowData.cuenta;
        const identificadorKey = rowData.identificador_via;
        const actividadKey = rowData.tipo_actividad;
        
        // Inicializar estructura jerárquica
        if (!hierarchicalData[clienteKey]) {
          hierarchicalData[clienteKey] = {
            nombre: clienteKey,
            totales: {
              enviados: 0,
              fallidos: 0,
              respuestas: 0,
              agendados: 0,
              limites: 0
            },
            identificadores: {}
          };
        }
        
        if (!hierarchicalData[clienteKey].identificadores[identificadorKey]) {
          hierarchicalData[clienteKey].identificadores[identificadorKey] = {
            identificador: identificadorKey,
            tipo_via: rowData.tipo_via,
            totales: {
              enviados: 0,
              fallidos: 0,
              respuestas: 0,
              agendados: 0,
              limites: 0
            },
            actividades: {}
          };
        }
        
        // Convertir valores a números para evitar concatenación
        const enviados = Number(rowData.total_enviados) || 0;
        const fallidos = Number(rowData.total_fallidos) || 0;
        const respuestas = Number(rowData.total_respuestas) || 0;
        const cualificados = Number(rowData.total_cualificados) || 0;
        const interesados = Number(rowData.total_interesados) || 0;
        const no_interesados = Number(rowData.total_no_interesados) || 0;
        const agendados = Number(rowData.total_agendados) || 0;
        const no_cualifica = Number(rowData.total_no_cualifica) || 0;
        const respuestas_automaticas = Number(rowData.total_respuestas_automaticas) || 0;
        const otros = Number(rowData.total_otros) || 0;
        const limites = Number(rowData.total_limites) || 0;
        const dias_activos = Number(rowData.dias_activos) || 0;
        const tasa_respuesta = Number(rowData.tasa_respuesta) || 0;
        const tasa_conversion = Number(rowData.tasa_conversion) || 0;
        const tasa_entrega = Number(rowData.tasa_entrega) || 0;

        // Agregar actividad
        hierarchicalData[clienteKey].identificadores[identificadorKey].actividades[actividadKey] = {
          tipo_actividad: actividadKey,
          funnel: rowData.funnel,
          enviados: enviados,
          fallidos: fallidos,
          respuestas: respuestas,
          cualificados: cualificados,
          interesados: interesados,
          no_interesados: no_interesados,
          agendados: agendados,
          no_cualifica: no_cualifica,
          respuestas_automaticas: respuestas_automaticas,
          otros: otros,
          limites: limites,
          dias_activos: dias_activos,
          ultimo_envio: rowData.ultimo_envio,
          tasa_respuesta: tasa_respuesta,
          tasa_conversion: tasa_conversion,
          tasa_entrega: tasa_entrega,
          datos_diarios: [],
          enviados_hoy: 0
        };
        
        // Actualizar totales del identificador
        const identificador = hierarchicalData[clienteKey].identificadores[identificadorKey];
        identificador.totales.enviados += enviados;
        identificador.totales.fallidos += fallidos;
        identificador.totales.respuestas += respuestas;
        identificador.totales.agendados += agendados;
        identificador.totales.limites += limites;
        
        // Actualizar totales del cliente
        const cliente = hierarchicalData[clienteKey];
        cliente.totales.enviados += enviados;
        cliente.totales.fallidos += fallidos;
        cliente.totales.respuestas += respuestas;
        cliente.totales.agendados += agendados;
        cliente.totales.limites += limites;
      }
    }
    
    // Procesar datos diarios
    const hoy = new Date().toISOString().split('T')[0];
    
    // DEBUG: Información básica (puede removerse en producción)
    // console.log('🔍 DEBUG - Fecha de hoy calculada:', hoy);
    // console.log('🔍 DEBUG - Datos diarios encontrados:', Array.isArray(dataDiaria) ? dataDiaria.length : 'No es array');
    
    if (Array.isArray(dataDiaria)) {
      // DEBUG: Mostrar algunas fechas de muestra (comentado para producción)
      // if (dataDiaria.length > 0) {
      //   console.log('🔍 DEBUG - Primeras 3 fechas de datos diarios:');
      //   dataDiaria.slice(0, 3).forEach((row: any, index) => {
      //     console.log(`  ${index + 1}. Fecha: "${row.fecha}", Tipo: ${typeof row.fecha}, Enviados: ${row.enviados_dia}`);
      //   });
      // }
      
      for (const row of dataDiaria) {
        const rowData = row as any;
        const clienteKey = rowData.cuenta;
        const identificadorKey = rowData.identificador_via;
        const actividadKey = rowData.tipo_actividad;
        
        // Convertir fecha de objeto Date a string en formato YYYY-MM-DD (mantener fecha local)
        const fechaOriginal = rowData.fecha;
        const fecha = fechaOriginal instanceof Date 
          ? fechaOriginal.getFullYear() + '-' + 
            String(fechaOriginal.getMonth() + 1).padStart(2, '0') + '-' + 
            String(fechaOriginal.getDate()).padStart(2, '0')
          : fechaOriginal;
        
                 // DEBUG: Mostrar comparación de fechas para casos específicos (comentado para producción)
         // if (identificadorKey === 'ACoAADptZ3QB1v6dqne7t90Ns_1nWvgg7d8n1_k') {
         //   console.log(`🔍 DEBUG - Comparando fechas para ${identificadorKey}:`);
         //   console.log(`  Fecha DB original: "${fechaOriginal}" (tipo: ${typeof fechaOriginal})`);
         //   console.log(`  Fecha DB convertida: "${fecha}" (tipo: ${typeof fecha})`);
         //   console.log(`  Fecha hoy: "${hoy}" (tipo: ${typeof hoy})`);
         //   console.log(`  Son iguales: ${fecha === hoy}`);
         //   console.log(`  Enviados día: ${rowData.enviados_dia}`);
         // }
        
        // Verificar si existe la estructura
        if (hierarchicalData[clienteKey] && 
            hierarchicalData[clienteKey].identificadores[identificadorKey] &&
            hierarchicalData[clienteKey].identificadores[identificadorKey].actividades[actividadKey]) {
          
          const actividad = hierarchicalData[clienteKey].identificadores[identificadorKey].actividades[actividadKey];
          
          // Agregar datos del día
          actividad.datos_diarios.push({
            fecha: fecha,
            enviados: Number(rowData.enviados_dia) || 0,
            fallidos: Number(rowData.fallidos_dia) || 0,
            respuestas: Number(rowData.respuestas_dia) || 0,
            agendados: Number(rowData.agendados_dia) || 0,
            limites: Number(rowData.limites_dia) || 0
          });
          
          // Si es hoy (fecha más reciente), agregar a enviados_hoy
          if (fecha === hoy) {
            // console.log(`✅ DEBUG - MATCH! Agregando ${rowData.enviados_dia} enviados hoy para ${identificadorKey}`);
            actividad.enviados_hoy += Number(rowData.enviados_dia) || 0;
          }
        } else {
          // console.log(`❌ DEBUG - Estructura no encontrada para: ${clienteKey}/${identificadorKey}/${actividadKey}`);
        }
      }
    }
    
    // Calcular tasas para totales y enviados hoy
    Object.keys(hierarchicalData).forEach(clienteKey => {
      const cliente = hierarchicalData[clienteKey];
      
      // Inicializar enviados hoy del cliente
      cliente.enviados_hoy = 0;
      
      // Tasas del cliente
      cliente.tasa_respuesta = cliente.totales.enviados > 0 ? 
        ((cliente.totales.respuestas / cliente.totales.enviados) * 100).toFixed(2) : 0;
      cliente.tasa_conversion = cliente.totales.enviados > 0 ? 
        ((cliente.totales.agendados / cliente.totales.enviados) * 100).toFixed(2) : 0;
      cliente.tasa_entrega = cliente.totales.enviados > 0 ? 
        (((cliente.totales.enviados - cliente.totales.fallidos) / cliente.totales.enviados) * 100).toFixed(2) : 0;
      
      // Tasas de cada identificador
      Object.keys(cliente.identificadores).forEach(identificadorKey => {
        const identificador = cliente.identificadores[identificadorKey];
        
        // Inicializar enviados hoy del identificador
        identificador.enviados_hoy = 0;
        
        // Calcular enviados hoy del identificador sumando todas sus actividades
        Object.keys(identificador.actividades).forEach(actividadKey => {
          const actividad = identificador.actividades[actividadKey];
          identificador.enviados_hoy += actividad.enviados_hoy || 0;
          
          // DEBUG: Mostrar enviados hoy por actividad (comentado para producción)
          // if (actividad.enviados_hoy > 0) {
          //   console.log(`📊 DEBUG - Actividad ${actividadKey} tiene ${actividad.enviados_hoy} enviados hoy`);
          // }
        });
        
        // DEBUG: Mostrar enviados hoy del identificador (comentado para producción)
        // if (identificador.enviados_hoy > 0) {
        //   console.log(`📊 DEBUG - Identificador ${identificadorKey} tiene ${identificador.enviados_hoy} enviados hoy`);
        // }
        
        // Sumar al total del cliente
        cliente.enviados_hoy += identificador.enviados_hoy;
        
        identificador.tasa_respuesta = identificador.totales.enviados > 0 ? 
          ((identificador.totales.respuestas / identificador.totales.enviados) * 100).toFixed(2) : 0;
        identificador.tasa_conversion = identificador.totales.enviados > 0 ? 
          ((identificador.totales.agendados / identificador.totales.enviados) * 100).toFixed(2) : 0;
        identificador.tasa_entrega = identificador.totales.enviados > 0 ? 
          (((identificador.totales.enviados - identificador.totales.fallidos) / identificador.totales.enviados) * 100).toFixed(2) : 0;
      });
      
      // DEBUG: Mostrar enviados hoy del cliente (comentado para producción)
      // if (cliente.enviados_hoy > 0) {
      //   console.log(`🏢 DEBUG - Cliente ${clienteKey} tiene ${cliente.enviados_hoy} enviados hoy`);
      // }
    });
    
    // Obtener también lista de clientes únicos para el filtro
    const clientesQuery = 'SELECT DISTINCT cuenta FROM stats_envios ORDER BY cuenta';
    const clientesResult = await executeQuery(clientesQuery);
    const clientes = Array.isArray(clientesResult) ? clientesResult.map((row: any) => row.cuenta) : [];
    
    // Calcular totales globales incluyendo enviados hoy
    const totalesGlobales = Object.values(hierarchicalData).reduce((acc, cliente) => ({
      enviados: acc.enviados + cliente.totales.enviados,
      fallidos: acc.fallidos + cliente.totales.fallidos,
      respuestas: acc.respuestas + cliente.totales.respuestas,
      agendados: acc.agendados + cliente.totales.agendados,
      limites: acc.limites + cliente.totales.limites,
      enviados_hoy: acc.enviados_hoy + (cliente.enviados_hoy || 0)
    }), { enviados: 0, fallidos: 0, respuestas: 0, agendados: 0, limites: 0, enviados_hoy: 0 });

    // DEBUG: Mostrar totales globales (comentado para producción)
    // console.log('🌍 DEBUG - Totales globales:');
    // console.log(`  Total enviados: ${totalesGlobales.enviados}`);
    // console.log(`  Total enviados hoy: ${totalesGlobales.enviados_hoy}`);
    // console.log(`  Fecha usada como 'hoy': ${hoy}`);

    return NextResponse.json({ 
      success: true, 
      data: hierarchicalData,
      clientes: clientes,
      totales_globales: totalesGlobales,
      filtros: {
        fechaInicio,
        fechaFin,
        cuenta
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo datos jerárquicos:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error obteniendo datos jerárquicos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
} 