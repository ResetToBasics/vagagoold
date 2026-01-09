import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { clienteService } from '../services/clienteService';
import { logService } from '../services/logService';
import { ApiError, asyncHandler } from '../utils/http';

export const listarClientes = asyncHandler(async (_req: Request, res: Response) => {
    const clientes = await clienteService.listar();
    res.json(clientes);
});

export const buscarCliente = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'Id do cliente nao informado');
    }

    const cliente = await clienteService.buscarPorId(id);
    res.json(cliente);
});

export const atualizarCliente = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'Id do cliente nao informado');
    }

    const { nome, email, endereco, permissoes, ativo } = req.body;
    const dadosAtualizacao: Record<string, unknown> = {};

    if (nome !== undefined) dadosAtualizacao.nome = nome;
    if (email !== undefined) dadosAtualizacao.email = email;
    if (endereco !== undefined) dadosAtualizacao.endereco = endereco;
    if (permissoes !== undefined) dadosAtualizacao.permissoes = permissoes;
    if (ativo !== undefined) dadosAtualizacao.ativo = ativo;

    const clienteAtualizado = await clienteService.atualizar(id, dadosAtualizacao);
    res.json(clienteAtualizado);
});

export const buscarClienteLogado = asyncHandler(async (req: Request, res: Response) => {
    const usuarioId = req.user?.id;
    if (!usuarioId) throw new ApiError(401, 'Usuario nao autenticado');

    const cliente = await clienteService.buscarPorId(usuarioId);
    res.json(cliente);
});

export const atualizarClienteLogado = asyncHandler(async (req: Request, res: Response) => {
    const usuarioId = req.user?.id;
    if (!usuarioId) throw new ApiError(401, 'Usuario nao autenticado');

    const { nome, email, endereco, senha } = req.body;
    const dadosAtualizacao: Record<string, unknown> = {};

    if (nome !== undefined) dadosAtualizacao.nome = nome;
    if (email !== undefined) dadosAtualizacao.email = email;
    if (endereco !== undefined) dadosAtualizacao.endereco = endereco;
    if (senha && typeof senha === 'string' && senha.trim().length > 0) {
        dadosAtualizacao.senhaHash = await bcrypt.hash(senha, 10);
    }

    const clienteAtual = await clienteService.buscarPorId(usuarioId);
    const cliente = await clienteService.atualizar(usuarioId, dadosAtualizacao);

    try {
        const logs: Array<'atualizacao_email' | 'atualizacao_perfil' | 'alteracao_senha'> = [];

        if (email !== undefined && email !== clienteAtual.email) {
            logs.push('atualizacao_email');
        }

        if (nome !== undefined || endereco !== undefined) {
            logs.push('atualizacao_perfil');
        }

        if (senha && typeof senha === 'string' && senha.trim().length > 0) {
            logs.push('alteracao_senha');
        }

        await Promise.all(
            logs.map((tipoAtividade) =>
                logService.criar({
                    clienteId: usuarioId,
                    tipoAtividade,
                    modulo: 'minha_conta',
                    descricao: 'Atualizacao de dados da conta',
                    ipOrigem: req.ip,
                    userAgent: req.headers['user-agent'] as string | undefined,
                })
            )
        );
    } catch (erro) {
        console.error('Erro ao registrar log de perfil:', erro);
    }

    res.json(cliente);
});

export const criarCliente = asyncHandler(async (req: Request, res: Response) => {
    const { nome, email, senha, endereco } = req.body;

    if (!nome || !email || !senha || !endereco) {
        throw new ApiError(400, 'Dados obrigatorios nao informados');
    }

    const cliente = await clienteService.criar({ nome, email, senha, endereco });
    res.status(201).json(cliente);
});
