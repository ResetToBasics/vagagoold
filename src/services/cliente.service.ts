/**
 * @fileoverview Servico de clientes
 * @description Funcoes de integracao com a API de clientes
 */

import { clienteHttp } from './api';
import type { AtualizarClienteDTO, Cliente, CriarClienteDTO } from '@/types';

export const clienteService = {
    listar: async () => {
        return clienteHttp.get<Cliente[]>('/clientes');
    },
    buscarPorId: async (id: string) => {
        return clienteHttp.get<Cliente>(`/clientes/${id}`);
    },
    criar: async (dados: CriarClienteDTO) => {
        return clienteHttp.post<Cliente>('/clientes', dados);
    },
    atualizar: async (id: string, dados: AtualizarClienteDTO) => {
        return clienteHttp.patch<Cliente>(`/clientes/${id}`, dados);
    },
    buscarMe: async () => {
        return clienteHttp.get<Cliente>('/clientes/me');
    },
    atualizarMe: async (dados: AtualizarClienteDTO) => {
        return clienteHttp.patch<Cliente>('/clientes/me', dados);
    },
};
