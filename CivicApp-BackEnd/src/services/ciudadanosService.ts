import { db } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Ciudadano {
  id_ciudadano?: number;
  id_usuario: number;
  nombre: string;
  telefono?: string;
}

export class CiudadanoService {
  // 1. Método para registrar ciudadano desde AuthController
  async registrarCiudadano(ciudadano: Omit<Ciudadano, 'id_ciudadano'>): Promise<number> {
    if (!ciudadano.nombre || ciudadano.nombre.trim().length === 0) {
      throw new Error('El nombre del ciudadano es obligatorio.');
    }

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO ciudadano (id_usuario, nombre, telefono) VALUES (?, ?, ?)',
      [ciudadano.id_usuario, ciudadano.nombre.trim(), ciudadano.telefono ? ciudadano.telefono.trim() : null]
    );
    return result.insertId;
  }

  // 2. Método para buscar ciudadano por ID de usuario desde AuthController
  async obtenerCiudadanoPorUsuario(idUsuario: number): Promise<Ciudadano | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM ciudadano WHERE id_usuario = ?',
      [idUsuario]
    );
    if (rows.length === 0) return null;
    return rows[0] as Ciudadano;
  }

  async obtenerTodos(): Promise<any[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT c.id_ciudadano, c.id_usuario, c.nombre, c.telefono, u.correo 
       FROM ciudadano c
       JOIN usuario u ON c.id_usuario = u.id_usuario`
    );
    return rows;
  }

  async obtenerPorId(idCiudadano: number): Promise<any | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT c.id_ciudadano, c.id_usuario, c.nombre, c.telefono, u.correo 
       FROM ciudadano c
       JOIN usuario u ON c.id_usuario = u.id_usuario
       WHERE c.id_ciudadano = ?`,
      [idCiudadano]
    );
    if (rows.length === 0) return null;
    return rows[0];
  }

  async actualizarCiudadano(idCiudadano: number, datos: Partial<Ciudadano>): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE ciudadano SET nombre = COALESCE(?, nombre), telefono = COALESCE(?, telefono) WHERE id_ciudadano = ?',
      [datos.nombre ? datos.nombre.trim() : null, datos.telefono ? datos.telefono.trim() : null, idCiudadano]
    );
    return result.affectedRows > 0;
  }

  async eliminarCiudadano(idCiudadano: number): Promise<boolean> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id_usuario FROM ciudadano WHERE id_ciudadano = ?',
      [idCiudadano]
    );
    if (rows.length === 0) return false;

    const idUsuario = rows[0].id_usuario;
    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM usuario WHERE id_usuario = ?',
      [idUsuario]
    );
    return result.affectedRows > 0;
  }
}