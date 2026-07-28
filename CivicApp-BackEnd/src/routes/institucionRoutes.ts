import { Router } from 'express';
import { InstitucionController } from '../controllers/institucionController';

const router = Router();

router.get('/', InstitucionController.obtenerTodas);
router.get('/:id', InstitucionController.obtenerPorId);
router.put('/:id', InstitucionController.actualizar);
router.delete('/:id', InstitucionController.eliminar);

export default router;