import { Request, Response } from 'express';
import { db } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class UsuarioController {
  static async obtenerTodos(req: Request, res: Response): Promise<void> {
    try {
      const [rows] = await db.query<RowDataPacket[]>('SELECT id_usuario, correo, rol FROM usuario');
      res.status(200).json(rows);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener usuarios', detalle: error.message });
    }
  }

  static async obtenerPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID no válido' });
        return;
      }
      const [rows] = await db.query<RowDataPacket[]>('SELECT id_usuario, correo, rol FROM usuario WHERE id_usuario = ?', [id]);
      if (rows.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.status(200).json(rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener el usuario', detalle: error.message });
    }
  }

  static async crear(req: Request, res: Response): Promise<void> {
    try {
      const { correo, contrasenia, rol } = req.body;
      if (!correo || !contrasenia || !rol) {
        res.status(400).json({ error: 'Correo, contraseña y rol son obligatorios' });
        return;
      }

      const [result] = await db.query<ResultSetHeader>(
        'INSERT INTO usuario (correo, contrasenia, rol) VALUES (?, ?, ?)',
        [correo.trim(), contrasenia, rol.trim()]
      );

      res.status(201).json({ mensaje: 'Usuario creado exitosamente', id_usuario: result.insertId });
    } catch (error: any) {
      res.status(500).json({ error: 'Error al crear usuario', detalle: error.message });
    }
  }

  static async actualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { correo, contrasenia, rol } = req.body;
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID no válido' });
        return;
      }

      const [result] = await db.query<ResultSetHeader>(
        'UPDATE usuario SET correo = COALESCE(?, correo), contrasenia = COALESCE(?, contrasenia), rol = COALESCE(?, rol) WHERE id_usuario = ?',
        [correo ? correo.trim() : null, contrasenia, rol ? rol.trim() : null, id]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (error: any) {
      res.status(500).json({ error: 'Error al actualizar usuario', detalle: error.message });
    }
  }

  static async eliminar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID no válido' });
        return;
      }

      const [result] = await db.query<ResultSetHeader>('DELETE FROM usuario WHERE id_usuario = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar usuario', detalle: error.message });
    }
  }
}