import { Request, Response } from 'express';
import { EvidenciaService } from '../services/evidenciaService';

const evidenciaService = new EvidenciaService();

export class EvidenciaController {
  static async obtenerPorDenuncia(req: Request, res: Response) {
    try { res.status(200).json(await evidenciaService.obtenerPorDenuncia(Number(req.params.idDenuncia))); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  }
  static async crear(req: Request, res: Response) {
    try { res.status(201).json({ id_evidencia: await evidenciaService.crearEvidencia(req.body) }); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  }
  static async eliminar(req: Request, res: Response) {
    try {
      const eliminado = await evidenciaService.eliminarEvidencia(Number(req.params.id));
      eliminado ? res.status(200).json({ msj: 'Eliminada' }) : res.status(404).json({ error: 'No encontrada' });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  }
}