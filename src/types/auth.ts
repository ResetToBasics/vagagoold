/**
 * @fileoverview Tipos relacionados a autenticacao
 * @description Define estruturas usadas nos fluxos de login e sessao
 */

export type TipoUsuario = 'admin' | 'cliente';

export interface UsuarioAutenticado {
    id: string;
    nome: string;
    email: string;
    tipo: TipoUsuario;
}

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
    usuario: UsuarioAutenticado;
}
