/**
 * @fileoverview Helpers para persistencia de sessao no navegador
 */

import type { UsuarioAutenticado } from '@/types';

const CHAVE_TOKEN = 'auth_token';
const CHAVE_USUARIO = 'auth_user';

const podeUsarStorage = typeof window !== 'undefined';

export const authStorage = {
    salvarSessao: (token: string, usuario: UsuarioAutenticado) => {
        if (!podeUsarStorage) return;
        localStorage.setItem(CHAVE_TOKEN, token);
        localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
    },
    atualizarUsuario: (dados: Partial<UsuarioAutenticado>) => {
        if (!podeUsarStorage) return;
        const usuarioAtual = authStorage.obterUsuario();
        if (!usuarioAtual) return;
        localStorage.setItem(CHAVE_USUARIO, JSON.stringify({ ...usuarioAtual, ...dados }));
    },
    obterUsuario: (): UsuarioAutenticado | null => {
        if (!podeUsarStorage) return null;
        const raw = localStorage.getItem(CHAVE_USUARIO);
        if (!raw) return null;

        try {
            return JSON.parse(raw) as UsuarioAutenticado;
        } catch {
            return null;
        }
    },
    limparSessao: () => {
        if (!podeUsarStorage) return;
        localStorage.removeItem(CHAVE_TOKEN);
        localStorage.removeItem(CHAVE_USUARIO);
    },
};
