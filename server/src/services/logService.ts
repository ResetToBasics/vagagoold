import { Op } from 'sequelize';
import { env } from '../config/env';
import { mockLogs, mockUsuarios } from '../mocks/data';
import { Log, User } from '../models';

interface FiltroLog {
    clienteId?: string;
    tipoAtividade?: string;
    modulo?: string;
    dataInicio?: string;
    dataFim?: string;
}

interface NovoLog {
    clienteId: string;
    tipoAtividade: string;
    modulo: string;
    descricao?: string;
    ipOrigem?: string;
    userAgent?: string;
    dataHora?: Date;
}

const mapLog = (log: Log | (typeof mockLogs)[number], cliente?: User | (typeof mockUsuarios)[number]) => ({
    id: log.id,
    clienteId: log.clienteId,
    clienteNome: cliente?.nome ?? 'Cliente',
    tipoAtividade: log.tipoAtividade,
    modulo: log.modulo,
    dataHora: new Date(log.dataHora).toISOString(),
});

export const logService = {
    listar: async (filtros: FiltroLog = {}) => {
        if (env.useMocks) {
            return mockLogs
                .filter((log) => (filtros.clienteId ? log.clienteId === filtros.clienteId : true))
                .filter((log) =>
                    filtros.tipoAtividade ? log.tipoAtividade === filtros.tipoAtividade : true
                )
                .filter((log) => (filtros.modulo ? log.modulo === filtros.modulo : true))
                .map((log) => {
                    const cliente = mockUsuarios.find((usuario) => usuario.id === log.clienteId);
                    return mapLog(log, cliente);
                });
        }

        const where: Record<string, unknown> = {};

        if (filtros.clienteId) where.clienteId = filtros.clienteId;
        if (filtros.tipoAtividade) where.tipoAtividade = filtros.tipoAtividade;
        if (filtros.modulo) where.modulo = filtros.modulo;
        if (filtros.dataInicio || filtros.dataFim) {
            where.dataHora = {
                [Op.between]: [
                    filtros.dataInicio ? new Date(filtros.dataInicio) : new Date('1970-01-01'),
                    filtros.dataFim ? new Date(filtros.dataFim) : new Date(),
                ],
            };
        }

        const logs = await Log.findAll({
            where,
            include: [{ model: User, as: 'cliente' }],
            order: [['dataHora', 'DESC']],
        });

        return logs.map((log) => mapLog(log, log.get('cliente') as User));
    },
    criar: async (dados: NovoLog) => {
        const dataHora = dados.dataHora ?? new Date();

        if (env.useMocks) {
            const novo = {
                id: `log-${Date.now()}`,
                clienteId: dados.clienteId,
                tipoAtividade: dados.tipoAtividade,
                modulo: dados.modulo,
                descricao: dados.descricao ?? null,
                ipOrigem: dados.ipOrigem ?? null,
                userAgent: dados.userAgent ?? null,
                dataHora: dataHora.toISOString(),
            };
            mockLogs.unshift(novo);
            return;
        }

        await Log.create({
            clienteId: dados.clienteId,
            tipoAtividade: dados.tipoAtividade,
            modulo: dados.modulo,
            descricao: dados.descricao ?? null,
            ipOrigem: dados.ipOrigem ?? null,
            userAgent: dados.userAgent ?? null,
            dataHora,
        });
    },
};
