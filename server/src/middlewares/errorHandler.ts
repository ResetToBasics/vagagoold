import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/http';

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ mensagem: err.message });
    }

    console.error('Erro nao tratado:', err);
    return res.status(500).json({ mensagem: 'Erro inesperado' });
};
