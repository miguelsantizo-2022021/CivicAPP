import { Request, Response } from 'express';
import { EstadoService } from '../services/estadoService';

const estadoService = new EstadoService();

export class EstadoController {
  static async obtenerTodos(req: Request, res: Response) {
    try { res.status(200).json(await estadoService.obtenerTodos()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  }
  static async obtenerPorId(req: Request, res: Response) {
    try {
      const estado = await estadoService.obtenerPorId(Number(req.params.id));
      estado ? res.status(200).json(estado) : res.status(404).json({ error: 'Estado no encontrado' });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  }
  static async crear(req: Request, res: Response) {
    try { res.status(201).json({ id_estado: await estadoService.crearEstado(req.body.nombre_estado) }); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  }
  static async actualizar(req: Request, res: Response) {
    try {
      const actualizado = await estadoService.actualizarEstado(Number(req.params.id), req.body.nombre_estado);
      actualizado ? res.status(200).json({ msj: 'Actualizado' }) : res.status(404).json({ error: 'No encontrado' });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  }
  static async eliminar(req: Request, res: Response) {
    try {
      const eliminado = await estadoService.eliminarEstado(Number(req.params.id));
      eliminado ? res.status(200).json({ msj: 'Eliminado' }) : res.status(404).json({ error: 'No encontrado' });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  }
}