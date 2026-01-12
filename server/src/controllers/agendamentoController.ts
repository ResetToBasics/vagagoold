import type { Request, Response } from 'express';
import { z } from 'zod';
import { agendamentoService } from '../services/agendamentoService';
import { logService } from '../services/logService';
import { ApiError, asyncHandler } from '../utils/http';
import { validarSchema } from '../utils/validation';

const horarioSchema = z.string().regex(/^\d{2}:\d{2}$/, 'Horario invalido');

const criarAgendamentoSchema = z.object({
    dataHora: z.string().refine((valor) => !Number.isNaN(Date.parse(valor)), {
        message: 'Data e horario invalidos',
    }),
    salaId: z.string().uuid('Sala invalida'),
    clienteId: z.string().uuid().optional(),
});

const atualizarAgendamentoSchema = z.object({
    status: z.enum(['pendente', 'agendado', 'cancelado', 'concluido']),
});

const criarSalaSchema = z.object({
    nome: z.string().min(2, 'Nome da sala obrigatorio'),
    horarioInicio: horarioSchema,
    horarioFim: horarioSchema,
    duracaoBloco: z.number().int().positive('Duracao do bloco invalida'),
    ativa: z.boolean().optional(),
});

const horariosQuerySchema = z.object({
    salaId: z.string().uuid('Sala invalida'),
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data invalida'),
});

const atualizarSalaSchema = z.object({
    nome: z.string().min(2).optional(),
    horarioInicio: horarioSchema.optional(),
    horarioFim: horarioSchema.optional(),
    duracaoBloco: z.number().int().positive().optional(),
    ativa: z.boolean().optional(),
});

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
    const { dataHora, salaId, clienteId: clienteIdBody } = validarSchema(criarAgendamentoSchema, req.body);
    const clienteId = req.user?.role === 'cliente' ? req.user?.id : clienteIdBody;

    if (!clienteId) {
        throw new ApiError(400, 'Cliente nao informado');
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

    const dados = validarSchema(atualizarAgendamentoSchema, req.body);
    const agendamento = await agendamentoService.atualizar(id, dados);
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

    if (req.user?.role === 'cliente') {
        const agendamentoAtual = await agendamentoService.buscarPorId(id);
        if (agendamentoAtual.clienteId !== req.user.id) {
            throw new ApiError(403, 'Acesso negado');
        }
    }

    const agendamento = await agendamentoService.atualizar(id, { status: 'cancelado' });

    if (req.user?.role === 'cliente' && req.user?.id) {
        try {
            await logService.criar({
                clienteId: req.user.id,
                tipoAtividade: 'cancelamento_agendamento',
                modulo: 'agendamento',
                descricao: `Agendamento cancelado ${id}`,
                ipOrigem: req.ip,
                userAgent: req.headers['user-agent'] as string | undefined,
            });
        } catch (erro) {
            console.error('Erro ao registrar log de cancelamento:', erro);
        }
    }

    res.json(agendamento);
});

export const listarSalas = asyncHandler(async (req: Request, res: Response) => {
    const filtros = req.user?.role === 'cliente' ? { ativa: true } : {};
    const salas = await agendamentoService.listarSalas(filtros);
    res.json(salas);
});

export const listarHorariosDisponiveis = asyncHandler(async (req: Request, res: Response) => {
    const { salaId, data } = validarSchema(horariosQuerySchema, {
        salaId: req.query.salaId,
        data: req.query.data,
    });

    const horarios = await agendamentoService.listarHorariosDisponiveis({ salaId, data });
    res.json(horarios);
});

export const criarSala = asyncHandler(async (req: Request, res: Response) => {
    const { nome, horarioInicio, horarioFim, duracaoBloco, ativa } = validarSchema(criarSalaSchema, req.body);

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

    const dados = validarSchema(atualizarSalaSchema, req.body);
    const sala = await agendamentoService.atualizarSala(id, dados);
    res.json(sala);
});
