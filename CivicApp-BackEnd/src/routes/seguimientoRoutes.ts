import { Router } from 'express';
import {SeguimientoController} from '../controllers/seguimientoController';

const router = Router();

router.get('/denuncia/:idDenuncia', SeguimientoController.obtenerPorDenuncia);
router.post('/', SeguimientoController.crear);

export default router;