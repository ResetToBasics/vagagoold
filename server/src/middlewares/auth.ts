import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models';
import { ApiError } from '../utils/http';

interface TokenPayload {
    sub: string;
    role: string;
}

export const requireAuth = (roles?: string[]) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const header = req.headers.authorization;
        const tokenHeader = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
        const tokenCookie = extrairTokenCookie(req.headers.cookie);
        const token = tokenHeader || tokenCookie;

        if (!token) {
            return next(new ApiError(401, 'Token nao informado'));
        }

        try {
            const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
            req.user = { id: payload.sub, role: payload.role };

            if (payload.role === 'cliente') {
                const usuario = await User.findByPk(payload.sub);
                if (!usuario) {
                    return next(new ApiError(401, 'Usuario nao encontrado'));
                }
                if (!usuario.ativo) {
                    return next(new ApiError(403, 'Cliente inativo'));
                }
            }

            if (roles && !roles.includes(payload.role)) {
                return next(new ApiError(403, 'Acesso negado'));
            }

            return next();
        } catch (erro) {
            return next(new ApiError(401, 'Token expirado ou invalido'));
        }
    };
};

const extrairTokenCookie = (cookieHeader?: string) => {
    if (!cookieHeader) return undefined;
    const partes = cookieHeader.split(';').map((parte) => parte.trim());
    const alvo = partes.find((parte) => parte.startsWith('auth_token='));
    if (!alvo) return undefined;
    return decodeURIComponent(alvo.replace('auth_token=', ''));
};
