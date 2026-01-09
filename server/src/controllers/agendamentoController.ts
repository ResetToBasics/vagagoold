import type { Request, Response } from 'express';
import { agendamentoService } from '../services/agendamentoService';
import { logService } from '../services/logService';
import { ApiError, asyncHandler } from '../utils/http';

export const listarAgendamentos = asyncHandler(async (req: Request, res: Response) => {
    const filtros = {
        clienteId:
            req.user?.role === 'cliente'
                ? req.user.id
                : (req.query.clienteId as string | undefined),
        status: req.query.status as string | undefined,
        dataInicio: req.query.dataInicio as string | undefined,
        dataFim: req.query.dataFim as string | undefined,
    };

    const agendamentos = await agendamentoService.listar(filtros);
    res.json(agendamentos);
});

export const buscarAgendamento = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, 'Id do agendamento nao informado');

    const agendamento = await agendamentoService.buscarPorId(id);

    if (req.user?.role === 'cliente' && agendamento.clienteId !== req.user.id) {
        throw new ApiError(403, 'Acesso negado');
    }

    res.json(agendamento);
});

export const criarAgendamento = asyncHandler(async (req: Request, res: Response) => {
    const { dataHora, salaId } = req.body;
    const clienteId = req.user?.role === 'cliente' ? req.user?.id : req.body.clienteId;

    if (!dataHora || !clienteId || !salaId) {
        throw new ApiError(400, 'Dados obrigatorios nao informados');
    }

    const agendamento = await agendamentoService.criar({ dataHora, clienteId, salaId });

    if (req.user?.role === 'cliente' && req.user?.id) {
        try {
            await logService.criar({
                clienteId: req.user.id,
                tipoAtividade: 'criacao_agendamento',
                modulo: 'agendamento',
                descricao: `Agendamento criado para ${dataHora}`,
                ipOrigem: req.ip,
                userAgent: req.headers['user-agent'] as string | undefined,
            });
        } catch (erro) {
            console.error('Erro ao registrar log de agendamento:', erro);
        }
    }

    res.status(201).json(agendamento);
});

export const atualizarAgendamento = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'Id do agendamento nao informado');
    }

    const agendamento = await agendamentoService.atualizar(id, req.body);
    res.json(agendamento);
});

export const aprovarAgendamento = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, 'Id do agendamento nao informado');

    const agendamento = await agendamentoService.atualizar(id, { status: 'agendado' });
    res.json(agendamento);
});

export const rejeitarAgendamento = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, 'Id do agendamento nao informado');

    const agendamento = await agendamentoService.atualizar(id, { status: 'cancelado' });
    res.json(agendamento);
});

export const listarSalas = asyncHandler(async (_req: Request, res: Response) => {
    const salas = await agendamentoService.listarSalas();
    res.json(salas);
});

export const criarSala = asyncHandler(async (req: Request, res: Response) => {
    const { nome, horarioInicio, horarioFim, duracaoBloco, ativa } = req.body;

    if (!nome || !horarioInicio || !horarioFim || !duracaoBloco) {
        throw new ApiError(400, 'Dados obrigatorios nao informados');
    }

    const sala = await agendamentoService.criarSala({
        nome,
        horarioInicio,
        horarioFim,
        duracaoBloco: Number(duracaoBloco),
        ativa,
    });

    res.status(201).json(sala);
});

export const atualizarSala = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, 'Id da sala nao informado');

    const sala = await agendamentoService.atualizarSala(id, req.body);
    res.json(sala);
});
