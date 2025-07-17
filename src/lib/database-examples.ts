import { executeQuery, getConnection } from './database';

// Ejemplo 1: Consulta simple
export const getUsers = async () => {
  try {
    const query = 'SELECT * FROM users LIMIT 10';
    const results = await executeQuery(query);
    return results;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// Ejemplo 2: Consulta con parámetros
export const getUserById = async (id: number) => {
  try {
    const query = 'SELECT * FROM users WHERE id = ?';
    const results = await executeQuery(query, [id]);
    return results;
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    throw error;
  }
};

// Ejemplo 3: Insertar datos
export const createUser = async (userData: { name: string; email: string }) => {
  try {
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    const results = await executeQuery(query, [userData.name, userData.email]);
    return results;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

// Ejemplo 4: Actualizar datos
export const updateUser = async (id: number, userData: { name?: string; email?: string }) => {
  try {
    const fields = [];
    const values = [];
    
    if (userData.name) {
      fields.push('name = ?');
      values.push(userData.name);
    }
    
    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    
    values.push(id);
    
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    const results = await executeQuery(query, values);
    return results;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

// Ejemplo 5: Eliminar datos
export const deleteUser = async (id: number) => {
  try {
    const query = 'DELETE FROM users WHERE id = ?';
    const results = await executeQuery(query, [id]);
    return results;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};

// Ejemplo 6: Transacciones manuales
export const createUserWithProfile = async (userData: { name: string; email: string; profile: string }) => {
  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Insertar usuario
    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [userData.name, userData.email]
    );
    
    // Obtener el ID del usuario insertado
    const userId = (userResult as any).insertId;
    
    // Insertar perfil
    await connection.execute(
      'INSERT INTO profiles (user_id, profile_data) VALUES (?, ?)',
      [userId, userData.profile]
    );
    
    await connection.commit();
    connection.release();
    
    return { success: true, userId };
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Error en la transacción:', error);
    throw error;
  }
};

// Ejemplo 7: Consulta con JOIN
export const getUsersWithProfiles = async () => {
  try {
    const query = `
      SELECT u.id, u.name, u.email, p.profile_data
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      ORDER BY u.name
    `;
    const results = await executeQuery(query);
    return results;
  } catch (error) {
    console.error('Error al obtener usuarios con perfiles:', error);
    throw error;
  }
}; 