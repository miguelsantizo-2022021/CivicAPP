import { db } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Seguimiento } from '../models/seguimiento';

export class SeguimientoService {
  async obtenerPorDenuncia(idDenuncia: number): Promise<RowDataPacket[]> {
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT s.*, e1.nombre_estado AS estado_anterior, e2.nombre_estado AS estado_nuevo
      FROM seguimiento s
      LEFT JOIN estado e1 ON s.id_estado_anterior = e1.id_estado
      JOIN estado e2 ON s.id_estado_nuevo = e2.id_estado
      WHERE s.id_denuncia = ?
      ORDER BY s.fecha_cambio ASC`, [idDenuncia]);
    return rows;
  }
  // La creación se suele hacer desde DenunciaService al actualizar estado, pero la dejamos por completitud
  async crearSeguimiento(seguimiento: Seguimiento): Promise<number> {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO seguimiento (id_denuncia, id_estado_anterior, id_estado_nuevo) VALUES (?, ?, ?)',
      [seguimiento.id_denuncia, seguimiento.id_estado_anterior || null, seguimiento.id_estado_nuevo]
    );
    return result.insertId;
  }
}