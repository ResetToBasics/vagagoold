import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/http';

interface TokenPayload {
    sub: string;
    role: string;
}

export const requireAuth = (roles?: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const header = req.headers.authorization;
        if (!header) {
            return next(new ApiError(401, 'Token nao informado'));
        }

        const [, token] = header.split(' ');
        if (!token) {
            return next(new ApiError(401, 'Token invalido'));
        }

        try {
            const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
            req.user = { id: payload.sub, role: payload.role };

            if (roles && !roles.includes(payload.role)) {
                return next(new ApiError(403, 'Acesso negado'));
            }

            return next();
        } catch (erro) {
            return next(new ApiError(401, 'Token expirado ou invalido'));
        }
    };
};
