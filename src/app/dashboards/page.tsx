'use client';

import Link from 'next/link';

export default function DashboardsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📊 Dashboards Disponibles
          </h1>
          <p className="text-gray-600 mb-8">
            Accede a los diferentes dashboards y herramientas de análisis
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dashboard de Outbound Marketing */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Dashboard de Outbound Marketing
                  </h3>
                  <p className="text-sm text-gray-500">
                    Estadísticas jerárquicas
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Visualiza estadísticas organizadas por Cliente → Identificador → Actividad. 
                Incluye métricas de envíos, respuestas, tasas de conversión y más.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  ✅ Filtros por fecha y cliente<br/>
                  ✅ Vista jerárquica expandible<br/>
                  ✅ Métricas en tiempo real
                </div>
                <Link
                  href="/dashboard/outbound"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Abrir Dashboard
                </Link>
              </div>
            </div>

            {/* Explorador de Base de Datos */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Explorador de Base de Datos
                  </h3>
                  <p className="text-sm text-gray-500">
                    Herramienta de exploración
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Explora la estructura y contenido de las tablas de la base de datos. 
                Útil para desarrolladores y análisis técnico.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  ✅ Estructura de tablas<br/>
                  ✅ Datos de muestra<br/>
                  ✅ Contadores de registros
                </div>
                <Link
                  href="/database-explorer"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Explorar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            💡 Información Adicional
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Tablas Principales</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• stats_envios</li>
                <li>• stats_respuestas</li>
                <li>• vias_alias</li>
                <li>• clientes</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">🔗 APIs Disponibles</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• /api/dashboard/hierarchy</li>
                <li>• /api/database/explore</li>
                <li>• /api/test-db</li>
                <li>• /api/stats</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">📊 Métricas Clave</h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Tasa de respuesta</li>
                <li>• Tasa de conversión</li>
                <li>• Tasa de entrega</li>
                <li>• Límites alcanzados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 