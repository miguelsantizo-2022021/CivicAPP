import { Request, Response } from 'express';
import { CiudadanoService } from '../services/ciudadanosService';

const ciudadanoService = new CiudadanoService();

export class CiudadanoController {
  static async obtenerTodos(req: Request, res: Response): Promise<void> {
    try {
      const ciudadanos = await ciudadanoService.obtenerTodos();
      res.status(200).json(ciudadanos);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener ciudadanos', detalle: error.message });
    }
  }

  static async obtenerPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'El ID no es un número válido' });
        return;
      }

      const ciudadano = await ciudadanoService.obtenerPorId(id);
      if (!ciudadano) {
        res.status(404).json({ mensaje: 'Ciudadano no encontrado' });
        return;
      }

      res.status(200).json(ciudadano);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener el ciudadano', detalle: error.message });
    }
  }

  static async actualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { nombre, telefono } = req.body;

      if (isNaN(id)) {
        res.status(400).json({ error: 'El ID no es válido' });
        return;
      }

      const actualizado = await ciudadanoService.actualizarCiudadano(id, { nombre, telefono });
      if (!actualizado) {
        res.status(404).json({ error: 'Ciudadano no encontrado para actualizar' });
        return;
      }

      res.status(200).json({ mensaje: 'Perfil de ciudadano actualizado correctamente' });
    } catch (error: any) {
      res.status(500).json({ error: 'Error al actualizar ciudadano', detalle: error.message });
    }
  }

  static async eliminar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'El ID no es válido' });
        return;
      }

      const eliminado = await ciudadanoService.eliminarCiudadano(id);
      if (!eliminado) {
        res.status(404).json({ error: 'Ciudadano no encontrado para eliminar' });
        return;
      }

      res.status(200).json({ mensaje: 'Ciudadano eliminado exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar ciudadano', detalle: error.message });
    }
  }
}