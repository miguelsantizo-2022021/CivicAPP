import { db } from '../config/database';
import { Categoria } from '../models/categoria';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class CategoriaService {
  async obtenerTodas(): Promise<Categoria[]> {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM categoria');
    return rows as Categoria[];
  }
  async obtenerPorId(id: number): Promise<Categoria | null> {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM categoria WHERE id_categoria = ?', [id]);
    return rows.length ? (rows[0] as Categoria) : null;
  }
  async crearCategoria(nombre: string): Promise<number> {
    const [result] = await db.query<ResultSetHeader>('INSERT INTO categoria (nombre_categoria) VALUES (?)', [nombre.trim()]);
    return result.insertId;
  }
  async actualizarCategoria(id: number, nombre: string): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>('UPDATE categoria SET nombre_categoria = ? WHERE id_categoria = ?', [nombre.trim(), id]);
    return result.affectedRows > 0;
  }
  async eliminarCategoria(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>('DELETE FROM categoria WHERE id_categoria = ?', [id]);
    return result.affectedRows > 0;
  }
}