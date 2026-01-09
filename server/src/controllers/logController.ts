import type { Request, Response } from 'express';
import { logService } from '../services/logService';
import { asyncHandler } from '../utils/http';

export const listarLogs = asyncHandler(async (req: Request, res: Response) => {
    const clienteId =
        req.user?.role === 'cliente'
            ? req.user.id
            : (req.query.clienteId as string | undefined);
    const filtros = {
        clienteId,
        tipoAtividade: req.query.tipoAtividade as string | undefined,
        modulo: req.query.modulo as string | undefined,
        dataInicio: req.query.dataInicio as string | undefined,
        dataFim: req.query.dataFim as string | undefined,
    };

    const logs = await logService.listar(filtros);
    res.json(logs);
});
