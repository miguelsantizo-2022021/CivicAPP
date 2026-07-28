import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin', //?donmoA5m@
  database: process.env.DB_NAME || 'civicapp_in5cm',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function probarConexion(): Promise<boolean> {
  try {
    const conexion = await db.getConnection();
    console.log('✅ ¡Conexión exitosa a la base de datos MySQL (civicapp_in5cm)!');
    conexion.release();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos MySQL:', error);
    return false;
  }
}