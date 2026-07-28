import { Request, Response } from 'express';
import { SeguimientoService } from '../services/seguimientoService';

const seguimientoService = new SeguimientoService();

export class SeguimientoController {
  static async obtenerPorDenuncia(req: Request, res: Response) {
    try { res.status(200).json(await seguimientoService.obtenerPorDenuncia(Number(req.params.idDenuncia))); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  }
  static async crear(req: Request, res: Response) {
    try { res.status(201).json({ id_seguimiento: await seguimientoService.crearSeguimiento(req.body) }); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  }
}