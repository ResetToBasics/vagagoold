import type { Request, Response } from 'express';
import { authService } from '../services/authService';
import { ApiError, asyncHandler } from '../utils/http';

export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        throw new ApiError(400, 'Email e senha sao obrigatorios');
    }

    const resultado = await authService.login('admin', email, senha);
    res.json(resultado);
});

export const loginCliente = asyncHandler(async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        throw new ApiError(400, 'Email e senha sao obrigatorios');
    }

    const resultado = await authService.login('cliente', email, senha);
    res.json(resultado);
});
