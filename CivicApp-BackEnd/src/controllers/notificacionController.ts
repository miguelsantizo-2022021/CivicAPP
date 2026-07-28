import { Request, Response } from 'express';
import { NotificacionService } from '../services/notificacionService';

const notificacionService = new NotificacionService();

export class NotificacionController {
  static async obtenerPorUsuario(req: Request, res: Response) {
    try { res.status(200).json(await notificacionService.obtenerPorUsuario(Number(req.params.idUsuario))); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  }
  static async crear(req: Request, res: Response) {
    try { res.status(201).json({ id_notificacion: await notificacionService.crearNotificacion(req.body) }); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  }
  static async marcarLeida(req: Request, res: Response) {
    try {
      const actualizado = await notificacionService.marcarComoLeida(Number(req.params.id));
      actualizado ? res.status(200).json({ msj: 'Leída' }) : res.status(404).json({ error: 'No encontrada' });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  }
  static async eliminar(req: Request, res: Response) {
    try {
      const eliminado = await notificacionService.eliminarNotificacion(Number(req.params.id));
      eliminado ? res.status(200).json({ msj: 'Eliminada' }) : res.status(404).json({ error: 'No encontrada' });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  }
}