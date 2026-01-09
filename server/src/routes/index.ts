import { Router } from 'express';
import agendamentosRoutes from './agendamentosRoutes';
import authRoutes from './authRoutes';
import clientesRoutes from './clientesRoutes';
import logsRoutes from './logsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/clientes', clientesRoutes);
router.use('/agendamentos', agendamentosRoutes);
router.use('/logs', logsRoutes);

export default router;
