import { Router } from 'express';
import { DenunciaController } from '../controllers/denunciaController';

const router = Router();

router.get('/', DenunciaController.listarTodas);
router.get('/estado/:idEstado', DenunciaController.obtenerPorEstado);
router.get('/:id', DenunciaController.obtenerPorId);
router.post('/', DenunciaController.crear);
router.put('/:id', DenunciaController.actualizar);
router.patch('/:id/estado', DenunciaController.actualizarEstadoProcess);
router.delete('/:id', DenunciaController.eliminar);

export default router;