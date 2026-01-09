import { Router } from 'express';
import { loginAdmin, loginCliente } from '../controllers/authController';

const router = Router();

router.post('/admin/login', loginAdmin);
router.post('/cliente/login', loginCliente);

export default router;
