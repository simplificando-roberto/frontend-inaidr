import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface DatoDiario {
  fecha: string;
  enviados: number;
  fallidos: number;
  respuestas: number;
  agendados: number;
  limites: number;
}

interface AdvancedActivityChartProps {
  datos: DatoDiario[];
  height?: number;
  maxBars?: number;
  title?: string;
}

type ChartType = 'bar' | 'line' | 'area' | 'pie';

const AdvancedActivityChart: React.FC<AdvancedActivityChartProps> = ({ 
  datos, 
  height = 200, 
  maxBars = 14,
  title = "Actividad por Día" 
}) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [selectedMetric, setSelectedMetric] = useState<string>('enviados');

  // Procesar datos para el gráfico
  const chartData = datos
    .slice(0, maxBars)
    .reverse()
    .map((dato) => ({
      fecha: new Date(dato.fecha).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit' 
      }),
      fechaCompleta: new Date(dato.fecha).toLocaleDateString('es-ES'),
      enviados: dato.enviados,
      respuestas: dato.respuestas,
      agendados: dato.agendados,
      fallidos: dato.fallidos,
      limites: dato.limites,
      exitosos: dato.enviados - dato.fallidos,
      tasa_respuesta: dato.enviados > 0 ? ((dato.respuestas / dato.enviados) * 100).toFixed(1) : 0
    }));

  // Datos para gráfico de pie (totales)
  const pieData = [
    { name: 'Enviados', value: chartData.reduce((sum, d) => sum + d.enviados, 0), color: '#3B82F6' },
    { name: 'Respuestas', value: chartData.reduce((sum, d) => sum + d.respuestas, 0), color: '#10B981' },
    { name: 'Agendados', value: chartData.reduce((sum, d) => sum + d.agendados, 0), color: '#F59E0B' },
    { name: 'Fallidos', value: chartData.reduce((sum, d) => sum + d.fallidos, 0), color: '#EF4444' }
  ].filter(item => item.value > 0);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{`${label} (${data.fechaCompleta})`}</p>
          <div className="space-y-1">
            <p className="text-blue-600 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              {`Enviados: ${data.enviados}`}
            </p>
            <p className="text-green-600 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              {`Respuestas: ${data.respuestas}`}
            </p>
            <p className="text-orange-600 flex items-center">
              <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
              {`Agendados: ${data.agendados}`}
            </p>
            {data.fallidos > 0 && (
              <p className="text-red-600 flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                {`Fallidos: ${data.fallidos}`}
              </p>
            )}
            <p className="text-gray-600 text-sm border-t pt-1">
              {`Tasa respuesta: ${data.tasa_respuesta}%`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Renderizar gráfico según tipo
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="fecha" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={selectedMetric} fill="#3B82F6" radius={[2, 2, 0, 0]} />
          </BarChart>
        );
      
      case 'line':
        return (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="fecha" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey={selectedMetric} stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="fecha" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={selectedMetric} stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
          </AreaChart>
        );
      
      case 'pie':
        return (
          <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      
      default:
        return (
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="fecha" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={selectedMetric} fill="#3B82F6" radius={[2, 2, 0, 0]} />
          </BarChart>
        );
    }
  };

  if (!datos || datos.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <div>No hay datos disponibles</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">{title}</h3>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Selector de métrica */}
          {chartType !== 'pie' && (
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="enviados">Enviados</option>
              <option value="respuestas">Respuestas</option>
              <option value="agendados">Agendados</option>
              <option value="fallidos">Fallidos</option>
            </select>
          )}
          
          {/* Selector de tipo de gráfico */}
          <div className="flex gap-1 border border-gray-300 rounded-md">
            {([
              { type: 'bar', label: '📊', title: 'Barras' },
              { type: 'line', label: '📈', title: 'Línea' },
              { type: 'area', label: '📉', title: 'Área' },
              { type: 'pie', label: '🥧', title: 'Pie' }
            ] as const).map(({ type, label, title }) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-2 py-1 text-sm rounded ${
                  chartType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title={title}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Total Enviados</div>
          <div className="text-lg font-bold text-blue-600">
            {chartData.reduce((sum, d) => sum + d.enviados, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Total Respuestas</div>
          <div className="text-lg font-bold text-green-600">
            {chartData.reduce((sum, d) => sum + d.respuestas, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Total Agendados</div>
          <div className="text-lg font-bold text-orange-600">
            {chartData.reduce((sum, d) => sum + d.agendados, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Tasa Promedio</div>
          <div className="text-lg font-bold text-gray-600">
            {chartData.length > 0 ? (
              (chartData.reduce((sum, d) => sum + parseFloat(d.tasa_respuesta.toString()), 0) / chartData.length).toFixed(1)
            ) : 0}%
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdvancedActivityChart; 