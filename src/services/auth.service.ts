/**
 * @fileoverview Servico de autenticacao
 * @description Funcoes para login e logout
 */

import { clienteHttp } from './api';
import type { LoginRequest, LoginResponse } from '@/types';

export const authService = {
    loginAdmin: async (credenciais: LoginRequest) => {
        return clienteHttp.post<LoginResponse>('/auth/admin/login', credenciais);
    },
    loginCliente: async (credenciais: LoginRequest) => {
        return clienteHttp.post<LoginResponse>('/auth/cliente/login', credenciais);
    },
};
