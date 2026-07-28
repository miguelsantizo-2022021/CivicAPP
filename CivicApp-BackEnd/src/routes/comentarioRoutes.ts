import { Router } from 'express';
import { ComentarioController } from '../controllers/comentarioController';

const router = Router();

// Obtener todos los comentarios pertenecientes a una denuncia específica
router.get('/denuncia/:idDenuncia', ComentarioController.obtenerPorDenuncia);

// CRUD directo de comentarios
router.get('/:id', ComentarioController.obtenerPorId);
router.post('/', ComentarioController.crear);
router.put('/:id', ComentarioController.actualizar);
router.delete('/:id', ComentarioController.eliminar);

export default router;