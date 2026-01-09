import { Router } from 'express';
import { listarLogs } from '../controllers/logController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth(['admin', 'cliente']), listarLogs);

export default router;
