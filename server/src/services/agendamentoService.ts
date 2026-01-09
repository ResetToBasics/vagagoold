import { Op } from 'sequelize';
import { Agendamento, Sala, User } from '../models';
import { ApiError } from '../utils/http';

interface FiltroAgendamento {
    clienteId?: string;
    status?: string;
    dataInicio?: string;
    dataFim?: string;
}

const mapAgendamento = (
    agendamento: Agendamento,
    cliente: User | undefined,
    sala: Sala | undefined
) => ({
    id: agendamento.id,
    dataHora: new Date(agendamento.dataHora).toISOString(),
    clienteId: agendamento.clienteId,
    clienteNome: cliente?.nome ?? 'Cliente',
    salaId: agendamento.salaId,
    salaNome: sala?.nome ?? 'Sala',
    status: agendamento.status,
    criadoEm: agendamento.criadoEm ? agendamento.criadoEm.toISOString() : new Date().toISOString(),
    atualizadoEm: agendamento.atualizadoEm
        ? agendamento.atualizadoEm.toISOString()
        : new Date().toISOString(),
});

const mapSala = (sala: Sala) => ({
    id: sala.id,
    nome: sala.nome,
    horarioInicio: sala.horarioInicio,
    horarioFim: sala.horarioFim,
    duracaoBloco: sala.duracaoBloco,
    ativa: sala.ativa,
});

export const agendamentoService = {
    listar: async (filtros: FiltroAgendamento = {}) => {
        const where: Record<string, unknown> = {};
        if (filtros.clienteId) where.clienteId = filtros.clienteId;
        if (filtros.status) where.status = filtros.status;
        if (filtros.dataInicio || filtros.dataFim) {
            where.dataHora = {
                [Op.between]: [
                    filtros.dataInicio ? new Date(filtros.dataInicio) : new Date('1970-01-01'),
                    filtros.dataFim ? new Date(filtros.dataFim) : new Date(),
                ],
            };
        }

        const agendamentos = await Agendamento.findAll({
            where,
            include: [
                { model: User, as: 'cliente' },
                { model: Sala, as: 'sala' },
            ],
            order: [['dataHora', 'DESC']],
        });

        return agendamentos.map((agendamento) =>
            mapAgendamento(
                agendamento,
                agendamento.get('cliente') as User,
                agendamento.get('sala') as Sala
            )
        );
    },
    buscarPorId: async (id: string) => {
        const agendamento = await Agendamento.findByPk(id, {
            include: [
                { model: User, as: 'cliente' },
                { model: Sala, as: 'sala' },
            ],
        });

        if (!agendamento) throw new ApiError(404, 'Agendamento nao encontrado');

        return mapAgendamento(
            agendamento,
            agendamento.get('cliente') as User,
            agendamento.get('sala') as Sala
        );
    },
    criar: async (dados: { dataHora: string; clienteId: string; salaId: string }) => {
        const agendamento = await Agendamento.create({
            dataHora: dados.dataHora,
            clienteId: dados.clienteId,
            salaId: dados.salaId,
            status: 'pendente',
        });

        const cliente = await User.findByPk(dados.clienteId);
        const sala = await Sala.findByPk(dados.salaId);

        return mapAgendamento(agendamento, cliente ?? undefined, sala ?? undefined);
    },
    atualizar: async (id: string, dados: Partial<Agendamento>) => {
        const agendamento = await Agendamento.findByPk(id);
        if (!agendamento) throw new ApiError(404, 'Agendamento nao encontrado');

        await agendamento.update(dados);

        const cliente = await User.findByPk(agendamento.clienteId);
        const sala = await Sala.findByPk(agendamento.salaId);

        return mapAgendamento(agendamento, cliente ?? undefined, sala ?? undefined);
    },
    listarSalas: async () => {
        const salas = await Sala.findAll();
        return salas.map((sala) => mapSala(sala));
    },
    criarSala: async (dados: {
        nome: string;
        horarioInicio: string;
        horarioFim: string;
        duracaoBloco: number;
        ativa?: boolean;
    }) => {
        const sala = await Sala.create({
            nome: dados.nome,
            horarioInicio: dados.horarioInicio,
            horarioFim: dados.horarioFim,
            duracaoBloco: dados.duracaoBloco,
            ativa: dados.ativa ?? true,
        });

        return mapSala(sala);
    },
    atualizarSala: async (id: string, dados: Partial<Sala>) => {
        const sala = await Sala.findByPk(id);
        if (!sala) throw new ApiError(404, 'Sala nao encontrada');

        await sala.update(dados);
        return mapSala(sala);
    },
};
