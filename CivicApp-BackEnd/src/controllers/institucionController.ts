import { Request, Response } from 'express';
import { InstitucionService } from '../services/institucionService';

const institucionService = new InstitucionService();

export class InstitucionController {
  static async obtenerTodas(req: Request, res: Response): Promise<void> {
    try {
      const instituciones = await institucionService.obtenerTodas();
      res.status(200).json(instituciones);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener instituciones', detalle: error.message });
    }
  }

  static async obtenerPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'El ID no es válido' });
        return;
      }

      const institucion = await institucionService.obtenerPorId(id);
      if (!institucion) {
        res.status(404).json({ mensaje: 'Institución no encontrada' });
        return;
      }

      res.status(200).json(institucion);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener institución', detalle: error.message });
    }
  }

  static async actualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { nombre_institucion } = req.body;

      if (isNaN(id)) {
        res.status(400).json({ error: 'El ID no es válido' });
        return;
      }

      if (!nombre_institucion || nombre_institucion.trim().length === 0) {
        res.status(400).json({ error: 'El campo nombre_institucion es requerido' });
        return;
      }

      // CORRECCIÓN AQUÍ: Pasar nombre_institucion directamente como string
      const actualizado = await institucionService.actualizarInstitucion(id, nombre_institucion);
      if (!actualizado) {
        res.status(404).json({ error: 'Institución no encontrada para actualizar' });
        return;
      }

      res.status(200).json({ mensaje: 'Institución actualizada correctamente' });
    } catch (error: any) {
      res.status(500).json({ error: 'Error al actualizar institución', detalle: error.message });
    }
  }

  static async eliminar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'El ID no es válido' });
        return;
      }

      const eliminado = await institucionService.eliminarInstitucion(id);
      if (!eliminado) {
        res.status(404).json({ error: 'Institución no encontrada para eliminar' });
        return;
      }

      res.status(200).json({ mensaje: 'Institución eliminada exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar institución', detalle: error.message });
    }
  }
}