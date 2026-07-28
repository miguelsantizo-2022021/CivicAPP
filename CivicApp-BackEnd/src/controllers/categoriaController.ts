import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoriaService';

const categoriaService = new CategoriaService();

export class CategoriaController {
  static async obtenerTodas(req: Request, res: Response) {
    try { res.status(200).json(await categoriaService.obtenerTodas()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  }
  static async obtenerPorId(req: Request, res: Response) {
    try {
      const categoria = await categoriaService.obtenerPorId(Number(req.params.id));
      categoria ? res.status(200).json(categoria) : res.status(404).json({ error: 'Categoría no encontrada' });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  }
  static async crear(req: Request, res: Response) {
    try { res.status(201).json({ id_categoria: await categoriaService.crearCategoria(req.body.nombre_categoria) }); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  }
  static async actualizar(req: Request, res: Response) {
    try {
      const actualizado = await categoriaService.actualizarCategoria(Number(req.params.id), req.body.nombre_categoria);
      actualizado ? res.status(200).json({ msj: 'Actualizado' }) : res.status(404).json({ error: 'No encontrado' });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  }
  static async eliminar(req: Request, res: Response) {
    try {
      const eliminado = await categoriaService.eliminarCategoria(Number(req.params.id));
      eliminado ? res.status(200).json({ msj: 'Eliminado' }) : res.status(404).json({ error: 'No encontrado' });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  }
}