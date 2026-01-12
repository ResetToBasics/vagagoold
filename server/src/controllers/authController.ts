import type { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService';
import { logService } from '../services/logService';
import { asyncHandler } from '../utils/http';
import { validarSchema } from '../utils/validation';
import { env } from '../config/env';

const loginSchema = z.object({
    email: z.string().email('Email invalido'),
    senha: z.string().min(6, 'Senha precisa ter pelo menos 6 caracteres'),
});

const obterCookieOptions = () => ({
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: env.nodeEnv === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
});

const definirCookiesAutenticacao = (res: Response, token: string, role: string) => {
    const options = obterCookieOptions();
    res.cookie('auth_token', token, options);

    if (role === 'admin') {
        res.cookie('admin_session', 'true', options);
    }
};

const limparCookiesAutenticacao = (res: Response) => {
    const options = obterCookieOptions();
    res.clearCookie('auth_token', options);
    res.clearCookie('admin_session', options);
};

export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { email, senha } = validarSchema(loginSchema, req.body);
    const resultado = await authService.login('admin', email, senha);
    definirCookiesAutenticacao(res, resultado.token, 'admin');
    res.json(resultado);
});

export const loginCliente = asyncHandler(async (req: Request, res: Response) => {
    const { email, senha } = validarSchema(loginSchema, req.body);
    const resultado = await authService.login('cliente', email, senha);
    definirCookiesAutenticacao(res, resultado.token, 'cliente');

    try {
        await logService.criar({
            clienteId: resultado.usuario.id,
            tipoAtividade: 'login',
            modulo: 'autenticacao',
            ipOrigem: req.ip,
            userAgent: req.headers['user-agent'] as string | undefined,
        });
    } catch (erro) {
        console.error('Erro ao registrar log de login:', erro);
    }

    res.json(resultado);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
    limparCookiesAutenticacao(res);
    res.json({ sucesso: true });
});
