import { db } from '../config/database';
import { Evidencia } from '../models/evidencia';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class EvidenciaService {
  async obtenerPorDenuncia(idDenuncia: number): Promise<Evidencia[]> {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM evidencia WHERE id_denuncia = ?', [idDenuncia]);
    return rows as Evidencia[];
  }
  async crearEvidencia(evidencia: Evidencia): Promise<number> {
    const [result] = await db.query<ResultSetHeader>('INSERT INTO evidencia (id_denuncia, ruta_archivo) VALUES (?, ?)', [evidencia.id_denuncia, evidencia.ruta_archivo]);
    return result.insertId;
  }
  async eliminarEvidencia(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>('DELETE FROM evidencia WHERE id_evidencia = ?', [id]);
    return result.affectedRows > 0;
  }
}