import { Router } from 'express';
import { ComentarioController } from '../controllers/comentarioController';

const router = Router();

router.get('/denuncia/:idDenuncia', ComentarioController.obtenerPorDenuncia);

router.get('/:id', ComentarioController.obtenerPorId);
router.post('/', ComentarioController.crear);
router.put('/:id', ComentarioController.actualizar);
router.delete('/:id', ComentarioController.eliminar);

export default router;