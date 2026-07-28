import { db } from '../config/database';
import { Denuncia } from '../models/denuncia';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class DenunciaService {
  async crearDenuncia(denuncia: Omit<Denuncia, 'id_denuncia' | 'fecha_creacion'>): Promise<number> {
    if (!denuncia.descripcion || denuncia.descripcion.trim().length < 10) {
      throw new Error('La descripción debe contener al menos 10 caracteres.');
    }
    if (denuncia.zona <= 0 || denuncia.zona > 25) {
      throw new Error('La zona debe ser un número válido entre 1 y 25.');
    }
    if (!denuncia.calle || denuncia.calle.trim().length === 0) {
      throw new Error('La calle es requerida.');
    }

    const conexion = await db.getConnection();
    try {
      await conexion.beginTransaction();

      const [result] = await conexion.query<ResultSetHeader>(
        `INSERT INTO denuncia (id_ciudadano, id_categoria, id_estado, descripcion, zona, calle) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          denuncia.id_ciudadano,
          denuncia.id_categoria,
          denuncia.id_estado || 1,
          denuncia.descripcion.trim(),
          denuncia.zona,
          denuncia.calle.trim()
        ]
      );

      const idDenuncia = result.insertId;

      await conexion.query(
        'INSERT INTO seguimiento (id_denuncia, id_estado_anterior, id_estado_nuevo) VALUES (?, NULL, ?)',
        [idDenuncia, denuncia.id_estado || 1]
      );

      const mensaje = `Su denuncia #${idDenuncia} registrada en zona ${denuncia.zona} ha sido recibida.`;
      await conexion.query(
        `INSERT INTO notificacion (id_usuario, mensaje_notificacion) 
         SELECT id_usuario, ? FROM ciudadano WHERE id_ciudadano = ?`,
        [mensaje, denuncia.id_ciudadano]
      );

      await conexion.commit();
      return idDenuncia;
    } catch (error) {
      await conexion.rollback();
      throw error;
    } finally {
      conexion.release();
    }
  }

  async listarTodas(): Promise<Denuncia[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM denuncia ORDER BY fecha_creacion DESC'
    );
    return rows as Denuncia[];
  }

  async obtenerPorId(idDenuncia: number): Promise<Denuncia | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM denuncia WHERE id_denuncia = ?',
      [idDenuncia]
    );
    if (rows.length === 0) return null;
    return rows[0] as Denuncia;
  }

  async obtenerPorEstado(idEstado: number): Promise<any[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT d.*, c.nombre_categoria, e.nombre_estado, ciu.nombre AS ciudadano_nombre
       FROM denuncia d
       JOIN categoria c ON d.id_categoria = c.id_categoria
       JOIN estado e ON d.id_estado = e.id_estado
       JOIN ciudadano ciu ON d.id_ciudadano = ciu.id_ciudadano
       WHERE d.id_estado = ?
       ORDER BY d.fecha_creacion DESC`,
      [idEstado]
    );
    return rows;
  }

  async actualizarDenuncia(idDenuncia: number, denuncia: Partial<Denuncia>): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE denuncia 
       SET id_categoria = ?, id_estado = ?, descripcion = ?, zona = ?, calle = ? 
       WHERE id_denuncia = ?`,
      [
        denuncia.id_categoria,
        denuncia.id_estado,
        denuncia.descripcion,
        denuncia.zona,
        denuncia.calle,
        idDenuncia
      ]
    );
    return result.affectedRows > 0;
  }

  async eliminarDenuncia(idDenuncia: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM denuncia WHERE id_denuncia = ?',
      [idDenuncia]
    );
    return result.affectedRows > 0;
  }

  async actualizarEstado(
    idDenuncia: number,
    idEstadoAnterior: number | null,
    idEstadoNuevo: number,
    idUsuario: number,
    comentarioTexto: string
  ): Promise<boolean> {
    const conexion = await db.getConnection();
    try {
      await conexion.beginTransaction();

      const [updateResult] = await conexion.query<ResultSetHeader>(
        'UPDATE denuncia SET id_estado = ? WHERE id_denuncia = ?',
        [idEstadoNuevo, idDenuncia]
      );

      if (updateResult.affectedRows === 0) {
        await conexion.rollback();
        return false;
      }

      await conexion.query(
        'INSERT INTO seguimiento (id_denuncia, id_estado_anterior, id_estado_nuevo) VALUES (?, ?, ?)',
        [idDenuncia, idEstadoAnterior, idEstadoNuevo]
      );

      if (comentarioTexto && comentarioTexto.trim().length > 0) {
        await conexion.query(
          'INSERT INTO comentario (id_denuncia, id_usuario, texto_comentario) VALUES (?, ?, ?)',
          [idDenuncia, idUsuario, comentarioTexto.trim()]
        );
      }

      const mensaje = `El estado de su denuncia #${idDenuncia} ha cambiado al estado ID: ${idEstadoNuevo}.`;
      await conexion.query(
        `INSERT INTO notificacion (id_usuario, mensaje_notificacion) 
         SELECT c.id_usuario, ? 
         FROM ciudadano c 
         JOIN denuncia d ON c.id_ciudadano = d.id_ciudadano 
         WHERE d.id_denuncia = ?`,
        [mensaje, idDenuncia]
      );

      await conexion.commit();
      return true;
    } catch (error) {
      await conexion.rollback();
      throw error;
    } finally {
      conexion.release();
    }
  }
}