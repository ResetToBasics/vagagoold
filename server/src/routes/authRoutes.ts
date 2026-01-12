import { Router } from 'express';
import { loginAdmin, loginCliente, logout } from '../controllers/authController';

const router = Router();

router.post('/admin/login', loginAdmin);
router.post('/cliente/login', loginCliente);
router.post('/logout', logout);

export default router;
