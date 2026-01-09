import { Op } from 'sequelize';
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

const mapLog = (log: Log, cliente?: User) => ({
    id: log.id,
    clienteId: log.clienteId,
    clienteNome: cliente?.nome ?? 'Cliente',
    tipoAtividade: log.tipoAtividade,
    modulo: log.modulo,
    dataHora: new Date(log.dataHora).toISOString(),
});

export const logService = {
    listar: async (filtros: FiltroLog = {}) => {
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
