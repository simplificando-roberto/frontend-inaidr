'use client';

import { useState, useEffect } from 'react';
import AdvancedActivityChart from '@/components/ui/AdvancedActivityChart';
// Usar símbolos Unicode en lugar de iconos externos

interface DatoDiario {
  fecha: string;
  enviados: number;
  fallidos: number;
  respuestas: number;
  agendados: number;
  limites: number;
}

interface ActividadData {
  tipo_actividad: string;
  funnel: string;
  enviados: number;
  fallidos: number;
  respuestas: number;
  cualificados: number;
  interesados: number;
  no_interesados: number;
  agendados: number;
  no_cualifica: number;
  respuestas_automaticas: number;
  otros: number;
  limites: number;
  dias_activos: number;
  ultimo_envio: string;
  tasa_respuesta: number;
  tasa_conversion: number;
  tasa_entrega: number;
  datos_diarios: DatoDiario[];
  enviados_hoy: number;
}

interface IdentificadorData {
  identificador: string;
  tipo_via: string;
  totales: {
    enviados: number;
    fallidos: number;
    respuestas: number;
    agendados: number;
    limites: number;
  };
  tasa_respuesta: number;
  tasa_conversion: number;
  tasa_entrega: number;
  enviados_hoy: number;
  actividades: { [key: string]: ActividadData };
}

interface ClienteData {
  nombre: string;
  totales: {
    enviados: number;
    fallidos: number;
    respuestas: number;
    agendados: number;
    limites: number;
  };
  tasa_respuesta: number;
  tasa_conversion: number;
  tasa_entrega: number;
  enviados_hoy: number;
  identificadores: { [key: string]: IdentificadorData };
}

interface DashboardResponse {
  success: boolean;
  data: { [key: string]: ClienteData };
  clientes: string[];
  totales_globales: {
    enviados: number;
    fallidos: number;
    respuestas: number;
    agendados: number;
    limites: number;
    enviados_hoy: number;
  };
  filtros: {
    fechaInicio?: string;
    fechaFin?: string;
    cuenta?: string;
  };
}

export default function OutboundDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para filtros
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  
  // Estados para expandir/contraer
  const [clientesExpandidos, setClientesExpandidos] = useState<{ [key: string]: boolean }>({});
  const [identificadoresExpandidos, setIdentificadoresExpandidos] = useState<{ [key: string]: boolean }>({});

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.append('fechaInicio', fechaInicio);
      if (fechaFin) params.append('fechaFin', fechaFin);
      if (clienteSeleccionado) params.append('cuenta', clienteSeleccionado);
      
      const response = await fetch(`/api/dashboard/hierarchy?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result);
        
        // Expandir automáticamente si hay pocos clientes
        const clienteKeys = Object.keys(result.data);
        if (clienteKeys.length <= 3) {
          const newExpanded: { [key: string]: boolean } = {};
          clienteKeys.forEach(key => {
            newExpanded[key] = true;
          });
          setClientesExpandidos(newExpanded);
        }
      } else {
        setError(result.message || 'Error obteniendo datos');
      }
    } catch (err) {
      setError('Error de conexión: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleCliente = (clienteKey: string) => {
    setClientesExpandidos(prev => ({
      ...prev,
      [clienteKey]: !prev[clienteKey]
    }));
  };

  const toggleIdentificador = (identificadorKey: string) => {
    setIdentificadoresExpandidos(prev => ({
      ...prev,
      [identificadorKey]: !prev[identificadorKey]
    }));
  };

  const getPerformanceColor = (tasa: number, tipo: 'respuesta' | 'conversion' | 'entrega') => {
    if (tipo === 'respuesta') {
      return tasa > 15 ? 'text-green-600' : tasa > 8 ? 'text-yellow-600' : 'text-red-600';
    } else if (tipo === 'conversion') {
      return tasa > 5 ? 'text-green-600' : tasa > 2 ? 'text-yellow-600' : 'text-red-600';
    } else { // entrega
      return tasa > 90 ? 'text-green-600' : tasa > 80 ? 'text-yellow-600' : 'text-red-600';
    }
  };

  const getViaIcon = (tipoVia: string) => {
    switch (tipoVia) {
      case 'correo': return '📧';
      case 'linkedin': return '💼';
      case 'telefono': return '📞';
      case 'whatsapp': return '💬';
      case 'inmail': return '📩';
      default: return '📌';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📊 Dashboard de Outbound Marketing
          </h1>
          <p className="text-gray-600 mb-6">
            Estadísticas organizadas por Cliente → Identificador → Actividad
          </p>
          
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                value={clienteSeleccionado}
                onChange={(e) => setClienteSeleccionado(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los clientes</option>
                {data?.clientes.map(cliente => (
                  <option key={cliente} value={cliente}>{cliente}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchData}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
              >
                {loading ? 'Cargando...' : '🔄 Actualizar'}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Resumen General */}
        {data && data.success && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Resumen General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {(() => {
                const totales = data.totales_globales;
                const tasaRespuesta = totales.enviados > 0 ? (totales.respuestas / totales.enviados * 100).toFixed(2) : 0;
                const tasaConversion = totales.enviados > 0 ? (totales.agendados / totales.enviados * 100).toFixed(2) : 0;
                const tasaEntrega = totales.enviados > 0 ? ((totales.enviados - totales.fallidos) / totales.enviados * 100).toFixed(2) : 0;
                
                return (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{totales.enviados.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">📤 Total Enviados</div>
                    </div>
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-600">{totales.enviados_hoy.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">📤 Enviados Hoy</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{totales.respuestas.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">💬 Total Respuestas</div>
                      <div className={`text-sm font-medium ${getPerformanceColor(Number(tasaRespuesta), 'respuesta')}`}>
                        {tasaRespuesta}% tasa
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{totales.agendados.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">🗓️ Total Agendados</div>
                      <div className={`text-sm font-medium ${getPerformanceColor(Number(tasaConversion), 'conversion')}`}>
                        {tasaConversion}% conversión
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{totales.limites.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">⚠️ Límites Alcanzados</div>
                      <div className={`text-sm font-medium ${getPerformanceColor(Number(tasaEntrega), 'entrega')}`}>
                        {tasaEntrega}% entrega
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Datos Jerárquicos */}
        {data && data.success && (
          <div className="space-y-6">
            {Object.entries(data.data).map(([clienteKey, cliente]) => (
              <div key={clienteKey} className="bg-white rounded-lg shadow-lg">
                {/* Nivel 1: Cliente */}
                <div 
                  className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleCliente(clienteKey)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-500 text-lg">
                        {clientesExpandidos[clienteKey] ? '▼' : '▶'}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        👤 {cliente.nombre}
                      </h3>
                    </div>
                    <div className="flex space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{cliente.totales.enviados.toLocaleString()}</div>
                        <div className="text-gray-500">Enviados</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-cyan-600">{cliente.enviados_hoy.toLocaleString()}</div>
                        <div className="text-gray-500">Hoy</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{cliente.totales.respuestas.toLocaleString()}</div>
                        <div className="text-gray-500">Respuestas</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{cliente.totales.agendados.toLocaleString()}</div>
                        <div className="text-gray-500">Agendados</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${getPerformanceColor(Number(cliente.tasa_respuesta), 'respuesta')}`}>
                          {cliente.tasa_respuesta}%
                        </div>
                        <div className="text-gray-500">Respuesta</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${getPerformanceColor(Number(cliente.tasa_conversion), 'conversion')}`}>
                          {cliente.tasa_conversion}%
                        </div>
                        <div className="text-gray-500">Conversión</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-600">{Object.keys(cliente.identificadores).length}</div>
                        <div className="text-gray-500">Identificadores</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nivel 2: Identificadores */}
                {clientesExpandidos[clienteKey] && (
                  <div className="p-6 space-y-4">
                    {Object.entries(cliente.identificadores).map(([identificadorKey, identificador]) => (
                      <div key={identificadorKey} className="border border-gray-200 rounded-lg">
                        <div 
                          className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                          onClick={() => toggleIdentificador(`${clienteKey}-${identificadorKey}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-gray-500 text-sm">
                                {identificadoresExpandidos[`${clienteKey}-${identificadorKey}`] ? '▼' : '▶'}
                              </span>
                              <h4 className="text-lg font-semibold text-gray-800">
                                {getViaIcon(identificador.tipo_via)} {identificador.identificador}
                              </h4>
                              <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                {identificador.tipo_via}
                              </span>
                            </div>
                            <div className="flex space-x-4 text-sm">
                              <div className="text-center">
                                <div className="font-semibold text-gray-900">{identificador.totales.enviados.toLocaleString()}</div>
                                <div className="text-gray-500">Enviados</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-cyan-600">{identificador.enviados_hoy.toLocaleString()}</div>
                                <div className="text-gray-500">Hoy</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-gray-900">{identificador.totales.respuestas.toLocaleString()}</div>
                                <div className="text-gray-500">Respuestas</div>
                              </div>
                              <div className="text-center">
                                <div className={`font-semibold ${getPerformanceColor(Number(identificador.tasa_respuesta), 'respuesta')}`}>
                                  {identificador.tasa_respuesta}%
                                </div>
                                <div className="text-gray-500">Respuesta</div>
                              </div>
                              <div className="text-center">
                                <div className={`font-semibold ${getPerformanceColor(Number(identificador.tasa_conversion), 'conversion')}`}>
                                  {identificador.tasa_conversion}%
                                </div>
                                <div className="text-gray-500">Conversión</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-gray-600">{Object.keys(identificador.actividades).length}</div>
                                <div className="text-gray-500">Actividades</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Nivel 3: Actividades */}
                        {identificadoresExpandidos[`${clienteKey}-${identificadorKey}`] && (
                          <div className="p-4 space-y-3">
                            {Object.entries(identificador.actividades).map(([actividadKey, actividad]) => (
                              <div key={actividadKey} className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="text-lg font-semibold text-gray-800 mb-1">
                                      🎯 {actividad.tipo_actividad}
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      Funnel: {actividad.funnel} | Días activos: {actividad.dias_activos}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-500">
                                      Último envío: {new Date(actividad.ultimo_envio).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600">{actividad.enviados.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">Enviados</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-cyan-600">{actividad.enviados_hoy.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">Hoy</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-red-600">{actividad.fallidos.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">Fallidos</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">{actividad.respuestas.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">Respuestas</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-purple-600">{actividad.cualificados.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">Cualificados</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-orange-600">{actividad.agendados.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">Agendados</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-yellow-600">{actividad.limites.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">Límites</div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-200">
                                  <div className="text-center">
                                    <div className={`text-lg font-bold ${getPerformanceColor(actividad.tasa_entrega, 'entrega')}`}>
                                      {actividad.tasa_entrega}%
                                    </div>
                                    <div className="text-xs text-gray-500">Tasa Entrega</div>
                                  </div>
                                  <div className="text-center">
                                    <div className={`text-lg font-bold ${getPerformanceColor(actividad.tasa_respuesta, 'respuesta')}`}>
                                      {actividad.tasa_respuesta}%
                                    </div>
                                    <div className="text-xs text-gray-500">Tasa Respuesta</div>
                                  </div>
                                  <div className="text-center">
                                    <div className={`text-lg font-bold ${getPerformanceColor(actividad.tasa_conversion, 'conversion')}`}>
                                      {actividad.tasa_conversion}%
                                    </div>
                                    <div className="text-xs text-gray-500">Tasa Conversión</div>
                                  </div>
                                </div>
                                
                                {/* Gráfico avanzado de actividad por día */}
                                {actividad.datos_diarios && actividad.datos_diarios.length > 0 && (
                                  <div className="mt-4 pt-4 border-t border-blue-200">
                                    <AdvancedActivityChart
                                      datos={actividad.datos_diarios}
                                      height={250}
                                      title={`📊 Actividad de ${actividad.tipo_actividad}`}
                                      maxBars={14}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 