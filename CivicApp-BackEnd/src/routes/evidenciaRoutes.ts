import { Router } from 'express';
import { EvidenciaController } from '../controllers/evidenciaController';
const router = Router();
router.get('/denuncia/:idDenuncia', EvidenciaController.obtenerPorDenuncia);
router.post('/', EvidenciaController.crear);
router.delete('/:id', EvidenciaController.eliminar);
export default router;