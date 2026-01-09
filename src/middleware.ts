/**
 * @fileoverview Middleware de proteção de rotas
 * @description Protege rotas administrativas, exigindo autenticação
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware para controle de acesso às rotas
 * 
 * @description
 * - Rotas /admin/* são protegidas e requerem autenticação
 * - Verifica se existe cookie de sessão 'admin_session'
 * - Se não autenticado, redireciona para /admin/login
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rotas administrativas protegidas (exceto login do admin)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        // Verifica se há cookie de sessão do admin
        const adminSession = request.cookies.get('admin_session');

        if (!adminSession) {
            // Redireciona para login do admin se não autenticado
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

/**
 * Configuração das rotas que o middleware deve interceptar
 */
export const config = {
    matcher: ['/admin/:path*'],
};
