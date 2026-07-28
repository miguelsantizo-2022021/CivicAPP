import { db } from '../config/database';
import { Notificacion } from '../models/notificacion';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class NotificacionService {
  async obtenerPorUsuario(idUsuario: number): Promise<Notificacion[]> {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM notificacion WHERE id_usuario = ? ORDER BY fecha_envio DESC', [idUsuario]);
    return rows as Notificacion[];
  }
  async crearNotificacion(notificacion: Notificacion): Promise<number> {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO notificacion (id_usuario, mensaje_notificacion) VALUES (?, ?)',
      [notificacion.id_usuario, notificacion.mensaje_notificacion.trim()]
    );
    return result.insertId;
  }
  async marcarComoLeida(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>('UPDATE notificacion SET leido = 1 WHERE id_notificacion = ?', [id]);
    return result.affectedRows > 0;
  }
  async eliminarNotificacion(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>('DELETE FROM notificacion WHERE id_notificacion = ?', [id]);
    return result.affectedRows > 0;
  }
}