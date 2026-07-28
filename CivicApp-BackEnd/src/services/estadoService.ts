import { db } from '../config/database';
import { Estado } from '../models/estado';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class EstadoService {
  async obtenerTodos(): Promise<Estado[]> {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM estado');
    return rows as Estado[];
  }
  async obtenerPorId(id: number): Promise<Estado | null> {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM estado WHERE id_estado = ?', [id]);
    return rows.length ? (rows[0] as Estado) : null;
  }
  async crearEstado(nombre: string): Promise<number> {
    const [result] = await db.query<ResultSetHeader>('INSERT INTO estado (nombre_estado) VALUES (?)', [nombre.trim()]);
    return result.insertId;
  }
  async actualizarEstado(id: number, nombre: string): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>('UPDATE estado SET nombre_estado = ? WHERE id_estado = ?', [nombre.trim(), id]);
    return result.affectedRows > 0;
  }
  async eliminarEstado(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>('DELETE FROM estado WHERE id_estado = ?', [id]);
    return result.affectedRows > 0;
  }
}