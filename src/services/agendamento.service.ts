/**
 * @fileoverview Serviço para gerenciamento de agendamentos
 * @description Funções para comunicação com a API de agendamentos
 */

import { clienteHttp } from './api';
import type {
    Agendamento,
    CriarAgendamentoDTO,
    AtualizarAgendamentoDTO,
    SalaAgendamento,
    CriarSalaAgendamentoDTO
} from '@/types';

/**
 * Serviço de Agendamentos
 * 
 * @description
 * Fornece métodos para gerenciar agendamentos no sistema:
 * - Listar agendamentos
 * - Criar novo agendamento
 * - Atualizar agendamento existente
 * - Aprovar/Rejeitar agendamentos pendentes
 * - Gerenciar salas de agendamento
 */
export const agendamentoService = {
    /**
     * Lista todos os agendamentos com filtros opcionais
     * 
     * @param filtros - Filtros de busca (data, status, cliente)
     * @returns Lista de agendamentos
     */
    listar: async (filtros?: {
        dataInicio?: string;
        dataFim?: string;
        status?: string;
        clienteId?: string;
    }) => {
        const params = new URLSearchParams();

        if (filtros?.dataInicio) {
            params.append('dataInicio', filtros.dataInicio);
        }
        if (filtros?.dataFim) {
            params.append('dataFim', filtros.dataFim);
        }
        if (filtros?.status) {
            params.append('status', filtros.status);
        }
        if (filtros?.clienteId) {
            params.append('clienteId', filtros.clienteId);
        }

        const queryString = params.toString();
        const endpoint = `/agendamentos${queryString ? `?${queryString}` : ''}`;

        return clienteHttp.get<Agendamento[]>(endpoint);
    },

    /**
     * Busca um agendamento específico por ID
     * 
     * @param id - ID do agendamento
     * @returns Dados do agendamento
     */
    buscarPorId: async (id: string) => {
        return clienteHttp.get<Agendamento>(`/agendamentos/${id}`);
    },

    /**
     * Cria um novo agendamento
     * 
     * @param dados - Dados do novo agendamento
     * @returns Agendamento criado
     */
    criar: async (dados: CriarAgendamentoDTO) => {
        return clienteHttp.post<Agendamento>('/agendamentos', dados);
    },

    /**
     * Atualiza um agendamento existente
     * 
     * @param id - ID do agendamento
     * @param dados - Dados a serem atualizados
     * @returns Agendamento atualizado
     */
    atualizar: async (id: string, dados: AtualizarAgendamentoDTO) => {
        return clienteHttp.patch<Agendamento>(`/agendamentos/${id}`, dados);
    },

    /**
     * Aprova um agendamento pendente
     * 
     * @param id - ID do agendamento
     */
    aprovar: async (id: string) => {
        return clienteHttp.patch<Agendamento>(`/agendamentos/${id}/aprovar`, {});
    },

    /**
     * Rejeita/Cancela um agendamento
     * 
     * @param id - ID do agendamento
     * @param motivo - Motivo do cancelamento (opcional)
     */
    rejeitar: async (id: string, motivo?: string) => {
        return clienteHttp.patch<Agendamento>(`/agendamentos/${id}/rejeitar`, { motivo });
    },

    /**
     * Lista todas as salas de agendamento
     */
    listarSalas: async () => {
        return clienteHttp.get<SalaAgendamento[]>('/agendamentos/salas');
    },
    listarHorariosDisponiveis: async (salaId: string, data: string) => {
        const params = new URLSearchParams({ salaId, data });
        return clienteHttp.get<string[]>(`/agendamentos/horarios?${params.toString()}`);
    },
    criarSala: async (dados: CriarSalaAgendamentoDTO) => {
        return clienteHttp.post<SalaAgendamento>('/agendamentos/salas', dados);
    },

    /**
     * Atualiza configurações de uma sala
     * 
     * @param id - ID da sala
     * @param dados - Dados a serem atualizados
     */
    atualizarSala: async (id: string, dados: Partial<SalaAgendamento>) => {
        return clienteHttp.patch<SalaAgendamento>(`/agendamentos/salas/${id}`, dados);
    },
};
