import { Op } from 'sequelize';
import { env } from '../config/env';
import { mockAgendamentos, mockSalas, mockUsuarios } from '../mocks/data';
import { Agendamento, Sala, User } from '../models';
import { ApiError } from '../utils/http';

interface FiltroAgendamento {
    clienteId?: string;
    status?: string;
    dataInicio?: string;
    dataFim?: string;
}

const mapAgendamento = (
    agendamento: Agendamento | (typeof mockAgendamentos)[number],
    cliente: User | (typeof mockUsuarios)[number] | undefined,
    sala: Sala | (typeof mockSalas)[number] | undefined
) => ({
    id: agendamento.id,
    dataHora: new Date(agendamento.dataHora).toISOString(),
    clienteId: agendamento.clienteId,
    clienteNome: cliente?.nome ?? 'Cliente',
    salaId: agendamento.salaId,
    salaNome: sala?.nome ?? 'Sala',
    status: agendamento.status,
    criadoEm: (agendamento as Agendamento).criadoEm
        ? (agendamento as Agendamento).criadoEm.toISOString()
        : new Date().toISOString(),
    atualizadoEm: (agendamento as Agendamento).atualizadoEm
        ? (agendamento as Agendamento).atualizadoEm.toISOString()
        : new Date().toISOString(),
});

const mapSala = (sala: Sala | (typeof mockSalas)[number]) => ({
    id: sala.id,
    nome: sala.nome,
    horarioInicio: sala.horarioInicio,
    horarioFim: sala.horarioFim,
    duracaoBloco: sala.duracaoBloco,
    ativa: sala.ativa,
});

export const agendamentoService = {
    listar: async (filtros: FiltroAgendamento = {}) => {
        if (env.useMocks) {
            const temFiltroData = Boolean(filtros.dataInicio || filtros.dataFim);
            const inicio = filtros.dataInicio ? new Date(filtros.dataInicio) : new Date('1970-01-01');
            const fim = filtros.dataFim ? new Date(filtros.dataFim) : new Date();

            return mockAgendamentos
                .filter((agendamento) =>
                    filtros.clienteId ? agendamento.clienteId === filtros.clienteId : true
                )
                .filter((agendamento) => (filtros.status ? agendamento.status === filtros.status : true))
                .filter((agendamento) => {
                    if (!temFiltroData) return true;
                    const data = new Date(agendamento.dataHora);
                    return data >= inicio && data <= fim;
                })
                .map((agendamento) => {
                    const cliente = mockUsuarios.find((usuario) => usuario.id === agendamento.clienteId);
                    const sala = mockSalas.find((item) => item.id === agendamento.salaId);
                    return mapAgendamento(agendamento, cliente, sala);
                });
        }

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
        if (env.useMocks) {
            const agendamento = mockAgendamentos.find((item) => item.id === id);
            if (!agendamento) throw new ApiError(404, 'Agendamento nao encontrado');

            const cliente = mockUsuarios.find((usuario) => usuario.id === agendamento.clienteId);
            const sala = mockSalas.find((item) => item.id === agendamento.salaId);
            return mapAgendamento(agendamento, cliente, sala);
        }

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
        if (env.useMocks) {
            const novo = {
                id: `ag-${Date.now()}`,
                dataHora: dados.dataHora,
                clienteId: dados.clienteId,
                salaId: dados.salaId,
                status: 'pendente',
            };
            mockAgendamentos.unshift(novo);

            const cliente = mockUsuarios.find((usuario) => usuario.id === dados.clienteId);
            const sala = mockSalas.find((item) => item.id === dados.salaId);
            return mapAgendamento(novo, cliente, sala);
        }

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
        if (env.useMocks) {
            const index = mockAgendamentos.findIndex((item) => item.id === id);
            if (index < 0) throw new ApiError(404, 'Agendamento nao encontrado');

            const dadosNormalizados = {
                ...dados,
                dataHora: dados.dataHora ? new Date(dados.dataHora).toISOString() : undefined,
            };

            mockAgendamentos[index] = {
                ...mockAgendamentos[index],
                ...(dadosNormalizados as Partial<(typeof mockAgendamentos)[number]>),
            };

            const cliente = mockUsuarios.find((usuario) => usuario.id === mockAgendamentos[index].clienteId);
            const sala = mockSalas.find((item) => item.id === mockAgendamentos[index].salaId);
            return mapAgendamento(mockAgendamentos[index], cliente, sala);
        }

        const agendamento = await Agendamento.findByPk(id);
        if (!agendamento) throw new ApiError(404, 'Agendamento nao encontrado');

        await agendamento.update(dados);

        const cliente = await User.findByPk(agendamento.clienteId);
        const sala = await Sala.findByPk(agendamento.salaId);

        return mapAgendamento(agendamento, cliente ?? undefined, sala ?? undefined);
    },
    listarSalas: async () => {
        if (env.useMocks) return mockSalas.map((sala) => mapSala(sala));

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
        if (env.useMocks) {
            const novaSala = {
                id: `sala-${Date.now()}`,
                nome: dados.nome,
                horarioInicio: dados.horarioInicio,
                horarioFim: dados.horarioFim,
                duracaoBloco: dados.duracaoBloco,
                ativa: dados.ativa ?? true,
            };
            mockSalas.unshift(novaSala);
            return mapSala(novaSala);
        }

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
        if (env.useMocks) {
            const index = mockSalas.findIndex((item) => item.id === id);
            if (index < 0) throw new ApiError(404, 'Sala nao encontrada');

            mockSalas[index] = { ...mockSalas[index], ...dados };
            return mapSala(mockSalas[index]);
        }

        const sala = await Sala.findByPk(id);
        if (!sala) throw new ApiError(404, 'Sala nao encontrada');

        await sala.update(dados);
        return mapSala(sala);
    },
};
