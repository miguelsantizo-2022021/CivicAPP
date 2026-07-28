import { db } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Institucion {
  id_institucion?: number;
  id_usuario: number;
  nombre_institucion: string;
}

export class InstitucionService {
  async obtenerTodas(): Promise<any[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT i.id_institucion, i.id_usuario, i.nombre_institucion, u.correo 
       FROM institucion i
       JOIN usuario u ON i.id_usuario = u.id_usuario`
    );
    return rows;
  }

  async obtenerPorId(idInstitucion: number): Promise<any | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT i.id_institucion, i.id_usuario, i.nombre_institucion, u.correo 
       FROM institucion i
       JOIN usuario u ON i.id_usuario = u.id_usuario
       WHERE i.id_institucion = ?`,
      [idInstitucion]
    );
    if (rows.length === 0) return null;
    return rows[0];
  }

  async actualizarInstitucion(idInstitucion: number, nombreInstitucion: string): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE institucion SET nombre_institucion = ? WHERE id_institucion = ?',
      [nombreInstitucion.trim(), idInstitucion]
    );
    return result.affectedRows > 0;
  }

  async eliminarInstitucion(idInstitucion: number): Promise<boolean> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id_usuario FROM institucion WHERE id_institucion = ?',
      [idInstitucion]
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