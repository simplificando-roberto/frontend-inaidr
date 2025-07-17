import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DatoDiario {
  fecha: string;
  enviados: number;
  fallidos: number;
  respuestas: number;
  agendados: number;
  limites: number;
}

interface ActivityChartProps {
  datos: DatoDiario[];
  height?: number;
  maxBars?: number;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ 
  datos, 
  height = 120, 
  maxBars = 14 
}) => {
  // Procesar datos para el gráfico
  const chartData = datos
    .slice(0, maxBars)
    .reverse()
    .map((dato) => ({
      fecha: new Date(dato.fecha).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit' 
      }),
      enviados: dato.enviados,
      respuestas: dato.respuestas,
      agendados: dato.agendados,
      fallidos: dato.fallidos,
      limites: dato.limites
    }));

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-800">{`Fecha: ${label}`}</p>
          <p className="text-blue-600">{`Enviados: ${payload[0].value}`}</p>
          <p className="text-green-600">{`Respuestas: ${payload[0].payload.respuestas}`}</p>
          <p className="text-orange-600">{`Agendados: ${payload[0].payload.agendados}`}</p>
          {payload[0].payload.fallidos > 0 && (
            <p className="text-red-600">{`Fallidos: ${payload[0].payload.fallidos}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (!datos || datos.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-gray-500">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="fecha" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="enviados" 
            fill="#3B82F6" 
            radius={[2, 2, 0, 0]}
            stroke="#2563EB"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart; 