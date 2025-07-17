import mysql from 'mysql2/promise';

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  reconnect: true,
  charset: 'utf8mb4'
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para obtener una conexión
export const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};

// Función para ejecutar consultas
export const executeQuery = async (query: string, params?: any[]) => {
  try {
    const connection = await getConnection();
    const [results] = await connection.execute(query, params);
    connection.release();
    return results;
  } catch (error) {
    console.error('Error al ejecutar consulta:', error);
    throw error;
  }
};

// Función para cerrar todas las conexiones
export const closePool = async () => {
  try {
    await pool.end();
  } catch (error) {
    console.error('Error al cerrar el pool de conexiones:', error);
    throw error;
  }
};

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const connection = await getConnection();
    const [result] = await connection.execute('SELECT 1 as test');
    connection.release();
    console.log('Conexión a la base de datos exitosa');
    return result;
  } catch (error) {
    console.error('Error al probar la conexión:', error);
    throw error;
  }
};

export default pool; 