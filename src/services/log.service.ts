/**
 * @fileoverview Servico de logs
 * @description Funcoes de integracao com a API de logs
 */

import { clienteHttp } from './api';
import type { FiltroLog, LogSistema } from '@/types';

export const logService = {
    listar: async (filtros?: FiltroLog) => {
        const params = new URLSearchParams();

        if (filtros?.clienteId) params.append('clienteId', filtros.clienteId);
        if (filtros?.tipoAtividade) params.append('tipoAtividade', filtros.tipoAtividade);
        if (filtros?.modulo) params.append('modulo', filtros.modulo);
        if (filtros?.dataInicio) params.append('dataInicio', filtros.dataInicio);
        if (filtros?.dataFim) params.append('dataFim', filtros.dataFim);
        if (filtros?.pagina) params.append('pagina', String(filtros.pagina));
        if (filtros?.itensPorPagina) params.append('itensPorPagina', String(filtros.itensPorPagina));

        const queryString = params.toString();
        const endpoint = `/logs${queryString ? `?${queryString}` : ''}`;

        return clienteHttp.get<LogSistema[]>(endpoint);
    },
};
