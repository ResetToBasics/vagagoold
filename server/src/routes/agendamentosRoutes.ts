import { Router } from 'express';
import {
    atualizarAgendamento,
    atualizarSala,
    aprovarAgendamento,
    buscarAgendamento,
    criarSala,
    criarAgendamento,
    listarAgendamentos,
    listarSalas,
    rejeitarAgendamento,
} from '../controllers/agendamentoController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/salas', requireAuth(['admin', 'cliente']), listarSalas);
router.post('/salas', requireAuth(['admin']), criarSala);
router.patch('/salas/:id', requireAuth(['admin']), atualizarSala);

router.get('/', requireAuth(['admin', 'cliente']), listarAgendamentos);
router.get('/:id', requireAuth(['admin', 'cliente']), buscarAgendamento);
router.post('/', requireAuth(['admin', 'cliente']), criarAgendamento);
router.patch('/:id', requireAuth(['admin']), atualizarAgendamento);
router.patch('/:id/aprovar', requireAuth(['admin']), aprovarAgendamento);
router.patch('/:id/rejeitar', requireAuth(['admin']), rejeitarAgendamento);

export default router;
