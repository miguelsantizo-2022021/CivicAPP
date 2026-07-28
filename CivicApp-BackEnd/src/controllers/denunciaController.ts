import { Request, Response } from 'express';
import { DenunciaService } from '../services/denunciaService';

const denunciaService = new DenunciaService();

export class DenunciaController {
  static async crear(req: Request, res: Response): Promise<void> {
    try {
      const idDenuncia = await denunciaService.crearDenuncia(req.body);
      res.status(201).json({ mensaje: 'Denuncia creada exitosamente', id_denuncia: idDenuncia });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async listarTodas(req: Request, res: Response): Promise<void> {
    try {
      const denuncias = await denunciaService.listarTodas();
      res.status(200).json(denuncias);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al listar las denuncias', detalle: error.message });
    }
  }

  static async obtenerPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID no válido' });
        return;
      }
      const denuncia = await denunciaService.obtenerPorId(id);
      if (!denuncia) {
        res.status(404).json({ mensaje: 'Denuncia no encontrada' });
        return;
      }
      res.status(200).json(denuncia);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener la denuncia', detalle: error.message });
    }
  }

  static async obtenerPorEstado(req: Request, res: Response): Promise<void> {
    try {
      const idEstado = Number(req.params.idEstado);
      if (isNaN(idEstado)) {
        res.status(400).json({ error: 'ID de estado no válido' });
        return;
      }
      const denuncias = await denunciaService.obtenerPorEstado(idEstado);
      res.status(200).json(denuncias);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener denuncias por estado', detalle: error.message });
    }
  }

  static async actualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID no válido' });
        return;
      }
      const actualizado = await denunciaService.actualizarDenuncia(id, req.body);
      if (!actualizado) {
        res.status(404).json({ error: 'Denuncia no encontrada' });
        return;
      }
      res.status(200).json({ mensaje: 'Denuncia actualizada correctamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async actualizarEstadoProcess(req: Request, res: Response): Promise<void> {
    try {
      const idDenuncia = Number(req.params.id);
      const { id_estado_anterior, id_estado_nuevo, id_usuario, comentario } = req.body;

      if (isNaN(idDenuncia) || !id_estado_nuevo || !id_usuario) {
        res.status(400).json({ error: 'Faltan datos obligatorios: id_estado_nuevo y id_usuario.' });
        return;
      }

      const exito = await denunciaService.actualizarEstado(
        idDenuncia,
        id_estado_anterior ? Number(id_estado_anterior) : null,
        Number(id_estado_nuevo),
        Number(id_usuario),
        comentario || ''
      );

      if (!exito) {
        res.status(404).json({ error: 'No se pudo actualizar el estado de la denuncia' });
        return;
      }

      res.status(200).json({ mensaje: 'Estado de denuncia actualizado y notificado con éxito' });
    } catch (error: any) {
      res.status(500).json({ error: 'Error al cambiar estado', detalle: error.message });
    }
  }

  static async eliminar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID no válido' });
        return;
      }
      const eliminado = await denunciaService.eliminarDenuncia(id);
      if (!eliminado) {
        res.status(404).json({ error: 'Denuncia no encontrada' });
        return;
      }
      res.status(200).json({ mensaje: 'Denuncia eliminada exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar la denuncia', detalle: error.message });
    }
  }
}