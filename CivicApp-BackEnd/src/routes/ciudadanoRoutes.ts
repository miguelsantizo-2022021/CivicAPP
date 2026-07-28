import { Router } from 'express';
import { CiudadanoController } from '../controllers/ciudadanoController';

const router = Router();

router.get('/', CiudadanoController.obtenerTodos);
router.get('/:id', CiudadanoController.obtenerPorId);
router.put('/:id', CiudadanoController.actualizar);
router.delete('/:id', CiudadanoController.eliminar);

export default router;