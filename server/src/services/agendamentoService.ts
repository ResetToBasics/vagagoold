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

const parseHorarioParaMinutos = (horario: string) => {
    const [horaStr, minutoStr] = horario.split(':');
    const hora = Number(horaStr);
    const minuto = Number(minutoStr);

    if (Number.isNaN(hora) || Number.isNaN(minuto)) return null;
    if (hora < 0 || hora > 23 || minuto < 0 || minuto > 59) return null;

    return hora * 60 + minuto;
};

const formatarHorario = (data: Date) => {
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
};

const validarConfiguracaoSala = (horarioInicio: string, horarioFim: string, duracaoBloco: number) => {
    const inicioMin = parseHorarioParaMinutos(horarioInicio);
    const fimMin = parseHorarioParaMinutos(horarioFim);

    if (inicioMin === null || fimMin === null) {
        throw new ApiError(400, 'Horario da sala invalido');
    }

    if (!duracaoBloco || duracaoBloco <= 0) {
        throw new ApiError(400, 'Duracao do bloco invalida');
    }

    if (inicioMin >= fimMin) {
        throw new ApiError(400, 'Horario inicial deve ser menor que o final');
    }

    return { inicioMin, fimMin };
};

const gerarHorariosDisponiveis = (inicioMin: number, fimMin: number, duracaoBloco: number) => {
    const horarios: string[] = [];
    let atual = inicioMin;

    while (atual + duracaoBloco <= fimMin) {
        const horas = String(Math.floor(atual / 60)).padStart(2, '0');
        const minutos = String(atual % 60).padStart(2, '0');
        horarios.push(`${horas}:${minutos}`);
        atual += duracaoBloco;
    }

    return horarios;
};

const validarDataHora = (dataHora: string) => {
    const data = new Date(dataHora);
    if (Number.isNaN(data.getTime())) {
        throw new ApiError(400, 'Data e horario invalidos');
    }
    return data;
};

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
        const cliente = await User.findByPk(dados.clienteId);
        if (!cliente || cliente.role !== 'cliente') {
            throw new ApiError(404, 'Cliente nao encontrado');
        }
        if (!cliente.ativo) {
            throw new ApiError(403, 'Cliente inativo');
        }

        const sala = await Sala.findByPk(dados.salaId);
        if (!sala) throw new ApiError(404, 'Sala nao encontrada');
        if (!sala.ativa) throw new ApiError(400, 'Sala inativa');

        const dataHora = validarDataHora(dados.dataHora);
        const { inicioMin, fimMin } = validarConfiguracaoSala(
            sala.horarioInicio,
            sala.horarioFim,
            sala.duracaoBloco
        );

        const minutos = dataHora.getHours() * 60 + dataHora.getMinutes();
        const dentroDoHorario =
            minutos >= inicioMin && minutos + sala.duracaoBloco <= fimMin;
        const alinhadoNoBloco = (minutos - inicioMin) % sala.duracaoBloco === 0;

        if (!dentroDoHorario || !alinhadoNoBloco) {
            throw new ApiError(400, 'Horario indisponivel para a sala');
        }

        const inicioSlot = new Date(dataHora);
        inicioSlot.setSeconds(0, 0);
        const fimSlot = new Date(dataHora);
        fimSlot.setSeconds(59, 999);

        const conflito = await Agendamento.findOne({
            where: {
                salaId: dados.salaId,
                status: { [Op.ne]: 'cancelado' },
                dataHora: { [Op.between]: [inicioSlot, fimSlot] },
            },
        });

        if (conflito) {
            throw new ApiError(409, 'Horario ja reservado');
        }

        const agendamento = await Agendamento.create({
            dataHora: dados.dataHora,
            clienteId: dados.clienteId,
            salaId: dados.salaId,
            status: 'pendente',
        });

        return mapAgendamento(agendamento, cliente, sala);
    },
    atualizar: async (id: string, dados: Partial<Agendamento>) => {
        const agendamento = await Agendamento.findByPk(id);
        if (!agendamento) throw new ApiError(404, 'Agendamento nao encontrado');

        await agendamento.update(dados);

        const cliente = await User.findByPk(agendamento.clienteId);
        const sala = await Sala.findByPk(agendamento.salaId);

        return mapAgendamento(agendamento, cliente ?? undefined, sala ?? undefined);
    },
    listarSalas: async (filtros: { ativa?: boolean } = {}) => {
        const where = filtros.ativa === undefined ? undefined : { ativa: filtros.ativa };
        const salas = await Sala.findAll({ where });
        return salas.map((sala) => mapSala(sala));
    },
    listarHorariosDisponiveis: async (dados: { salaId: string; data: string }) => {
        const sala = await Sala.findByPk(dados.salaId);
        if (!sala) throw new ApiError(404, 'Sala nao encontrada');
        if (!sala.ativa) throw new ApiError(400, 'Sala inativa');

        const dataBase = new Date(`${dados.data}T00:00:00`);
        if (Number.isNaN(dataBase.getTime())) {
            throw new ApiError(400, 'Data invalida');
        }

        const { inicioMin, fimMin } = validarConfiguracaoSala(
            sala.horarioInicio,
            sala.horarioFim,
            sala.duracaoBloco
        );

        const inicioDia = new Date(dataBase);
        inicioDia.setHours(0, 0, 0, 0);
        const fimDia = new Date(dataBase);
        fimDia.setHours(23, 59, 59, 999);

        const agendamentos = await Agendamento.findAll({
            where: {
                salaId: dados.salaId,
                status: { [Op.ne]: 'cancelado' },
                dataHora: { [Op.between]: [inicioDia, fimDia] },
            },
        });

        const horariosOcupados = new Set(
            agendamentos.map((agendamento) => formatarHorario(agendamento.dataHora))
        );

        return gerarHorariosDisponiveis(inicioMin, fimMin, sala.duracaoBloco).filter(
            (horario) => !horariosOcupados.has(horario)
        );
    },
    criarSala: async (dados: {
        nome: string;
        horarioInicio: string;
        horarioFim: string;
        duracaoBloco: number;
        ativa?: boolean;
    }) => {
        validarConfiguracaoSala(dados.horarioInicio, dados.horarioFim, dados.duracaoBloco);

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

        if (
            (dados.horarioInicio && dados.horarioFim) ||
            (dados.horarioInicio && dados.duracaoBloco) ||
            (dados.horarioFim && dados.duracaoBloco) ||
            dados.duracaoBloco
        ) {
            validarConfiguracaoSala(
                dados.horarioInicio ?? sala.horarioInicio,
                dados.horarioFim ?? sala.horarioFim,
                dados.duracaoBloco ?? sala.duracaoBloco
            );
        }

        await sala.update(dados);
        return mapSala(sala);
    },
};
