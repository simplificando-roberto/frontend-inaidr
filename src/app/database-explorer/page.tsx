'use client';

import { useState, useEffect } from 'react';

interface TableInfo {
  structure?: any[];
  count?: number;
  sampleData?: any[];
  error?: string;
}

interface DatabaseExploreResponse {
  success: boolean;
  message: string;
  tables?: { [key: string]: TableInfo };
  error?: string;
}

export default function DatabaseExplorer() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DatabaseExploreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const exploreDatabase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/database/explore');
      const result = await response.json();
      
      if (result.success) {
        setData(result);
      } else {
        setError(result.message || 'Error explorando la base de datos');
      }
    } catch (err) {
      setError('Error de conexión: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    exploreDatabase();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔍 Explorador de Base de Datos
          </h1>
          <p className="text-gray-600 mb-6">
            Explora la estructura y contenido de la base de datos MySQL existente
          </p>
          
          <button
            onClick={exploreDatabase}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Explorando...' : '🔄 Actualizar'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {data && data.success && data.tables && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📊 Resumen de Tablas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(data.tables).map(([tableName, tableInfo]) => (
                  <div key={tableName} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {tableName}
                    </h3>
                    {tableInfo.error ? (
                      <div className="text-red-600 text-sm">
                        Error: {tableInfo.error}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        <div className="mb-2">
                          📊 Registros: <span className="font-medium">{tableInfo.count || 0}</span>
                        </div>
                        <div>
                          🏗️ Columnas: <span className="font-medium">{tableInfo.structure?.length || 0}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {Object.entries(data.tables).map(([tableName, tableInfo]) => (
              <div key={tableName} className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  📋 {tableName}
                </h2>
                
                {tableInfo.error ? (
                  <div className="text-red-600">
                    Error: {tableInfo.error}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Estructura de la tabla */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        🏗️ Estructura ({tableInfo.structure?.length || 0} columnas)
                      </h3>
                      {tableInfo.structure && (
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-gray-50 border border-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Campo</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tipo</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nulo</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Clave</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Default</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tableInfo.structure.map((column: any, index: number) => (
                                <tr key={index} className="border-t">
                                  <td className="px-4 py-2 text-sm text-gray-900">{column.Field}</td>
                                  <td className="px-4 py-2 text-sm text-gray-600">{column.Type}</td>
                                  <td className="px-4 py-2 text-sm text-gray-600">{column.Null}</td>
                                  <td className="px-4 py-2 text-sm text-gray-600">{column.Key}</td>
                                  <td className="px-4 py-2 text-sm text-gray-600">{column.Default || 'NULL'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Datos de muestra */}
                    {tableInfo.sampleData && tableInfo.sampleData.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          📊 Datos de Muestra ({tableInfo.count} registros total)
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-gray-50 border border-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                {Object.keys(tableInfo.sampleData[0]).map((key) => (
                                  <th key={key} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {tableInfo.sampleData.map((row: any, index: number) => (
                                <tr key={index} className="border-t">
                                  {Object.values(row).map((value: any, colIndex: number) => (
                                    <td key={colIndex} className="px-4 py-2 text-sm text-gray-900 max-w-xs truncate">
                                      {value === null ? 'NULL' : String(value)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
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