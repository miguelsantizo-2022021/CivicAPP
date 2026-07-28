import { Request, Response } from 'express';
import { ComentarioService } from '../services/comentarioService';

const comentarioService = new ComentarioService();

export class ComentarioController {
  static async crear(req: Request, res: Response): Promise<void> {
    try {
      const { id_denuncia, id_usuario, texto_comentario } = req.body;

      if (!id_denuncia || !id_usuario || !texto_comentario) {
        res.status(400).json({ 
          error: 'Faltan campos obligatorios: id_denuncia, id_usuario y texto_comentario' 
        });
        return;
      }

      const idComentario = await comentarioService.crearComentario({
        id_denuncia: Number(id_denuncia),
        id_usuario: Number(id_usuario),
        texto_comentario
      });

      res.status(201).json({
        mensaje: 'Comentario agregado correctamente',
        id_comentario: idComentario
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerPorDenuncia(req: Request, res: Response): Promise<void> {
    try {
      const idDenuncia = Number(req.params.idDenuncia);
      if (isNaN(idDenuncia)) {
        res.status(400).json({ error: 'El ID de la denuncia no es válido' });
        return;
      }

      const comentarios = await comentarioService.obtenerPorDenuncia(idDenuncia);
      res.status(200).json(comentarios);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener comentarios', detalle: error.message });
    }
  }

  static async obtenerPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const comentario = await comentarioService.obtenerPorId(id);
      if (!comentario) {
        res.status(404).json({ mensaje: 'Comentario no encontrado' });
        return;
      }

      res.status(200).json(comentario);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener el comentario', detalle: error.message });
    }
  }

  static async actualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { texto_comentario } = req.body;

      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const actualizado = await comentarioService.actualizarComentario(id, texto_comentario);
      if (!actualizado) {
        res.status(404).json({ error: 'Comentario no encontrado para actualizar' });
        return;
      }

      res.status(200).json({ mensaje: 'Comentario actualizado correctamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async eliminar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const eliminado = await comentarioService.eliminarComentario(id);
      if (!eliminado) {
        res.status(404).json({ error: 'Comentario no encontrado para eliminar' });
        return;
      }

      res.status(200).json({ mensaje: 'Comentario eliminado exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar el comentario', detalle: error.message });
    }
  }
}