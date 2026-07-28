import { db } from '../config/database';
import { Comentario } from '../models/comentario';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class ComentarioService {
  // Crear un comentario con la fecha actual (NOW())
  async crearComentario(comentario: Omit<Comentario, 'id_comentario' | 'fecha_comentario'>): Promise<number> {
    if (!comentario.texto_comentario || comentario.texto_comentario.trim().length === 0) {
      throw new Error('El texto del comentario no puede estar vacío.');
    }

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO comentario (id_denuncia, id_usuario, texto_comentario, fecha_comentario) 
       VALUES (?, ?, ?, NOW())`,
      [comentario.id_denuncia, comentario.id_usuario, comentario.texto_comentario.trim()]
    );

    return result.insertId;
  }

  // Obtener todos los comentarios de una denuncia en específico
  async obtenerPorDenuncia(idDenuncia: number): Promise<Comentario[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM comentario WHERE id_denuncia = ? ORDER BY fecha_comentario DESC',
      [idDenuncia]
    );
    return rows as Comentario[];
  }

  // Obtener un comentario por su ID
  async obtenerPorId(idComentario: number): Promise<Comentario | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM comentario WHERE id_comentario = ?',
      [idComentario]
    );
    if (rows.length === 0) return null;
    return rows[0] as Comentario;
  }

  // Actualizar el texto de un comentario
  async actualizarComentario(idComentario: number, texto: string): Promise<boolean> {
    if (!texto || texto.trim().length === 0) {
      throw new Error('El texto del comentario no puede estar vacío.');
    }

    const [result] = await db.query<ResultSetHeader>(
      'UPDATE comentario SET texto_comentario = ? WHERE id_comentario = ?',
      [texto.trim(), idComentario]
    );
    return result.affectedRows > 0;
  }

  // Eliminar un comentario
  async eliminarComentario(idComentario: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM comentario WHERE id_comentario = ?',
      [idComentario]
    );
    return result.affectedRows > 0;
  }
}