import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

router.post('/login', AuthController.login);
router.post('/registro/ciudadano', AuthController.registrarCiudadano);
router.post('/registro/institucion', AuthController.registrarInstitucion);
router.post('/login-admin', AuthController.loginAdmin);

export default router;