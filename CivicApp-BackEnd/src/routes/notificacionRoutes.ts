import { Router } from 'express';
import { NotificacionController } from '../controllers/notificacionController';

const router = Router();

router.get('/usuario/:idUsuario', NotificacionController.obtenerPorUsuario);
router.post('/', NotificacionController.crear);
router.patch('/:id/leida', NotificacionController.marcarLeida);
router.delete('/:id', NotificacionController.eliminar);

export default router;