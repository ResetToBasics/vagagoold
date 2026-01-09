import { Router } from 'express';
import {
    atualizarCliente,
    atualizarClienteLogado,
    buscarCliente,
    buscarClienteLogado,
    criarCliente,
    listarClientes,
} from '../controllers/clienteController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/', criarCliente);
router.get('/me', requireAuth(['cliente']), buscarClienteLogado);
router.patch('/me', requireAuth(['cliente']), atualizarClienteLogado);
router.get('/', requireAuth(['admin']), listarClientes);
router.get('/:id', requireAuth(['admin']), buscarCliente);
router.patch('/:id', requireAuth(['admin']), atualizarCliente);

export default router;
