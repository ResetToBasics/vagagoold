import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { mockUsuarios } from '../mocks/data';
import { User } from '../models';
import { ApiError } from '../utils/http';

type EnderecoCliente = {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
};

const mapCliente = (usuario: User | (typeof mockUsuarios)[number]) => ({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    endereco: usuario.endereco ?? null,
    permissoes: usuario.permissoes ?? [],
    ativo: usuario.ativo,
    dataCadastro: (usuario as User).criadoEm
        ? (usuario as User).criadoEm.toISOString()
        : new Date().toISOString(),
    atualizadoEm: (usuario as User).atualizadoEm
        ? (usuario as User).atualizadoEm.toISOString()
        : new Date().toISOString(),
});

export const clienteService = {
    listar: async () => {
        if (env.useMocks) {
            return mockUsuarios.filter((usuario) => usuario.role === 'cliente').map(mapCliente);
        }

        const usuarios = await User.findAll({ where: { role: 'cliente' } });
        return usuarios.map(mapCliente);
    },
    buscarPorId: async (id: string) => {
        if (env.useMocks) {
            const usuario = mockUsuarios.find((item) => item.id === id && item.role === 'cliente');
            if (!usuario) throw new ApiError(404, 'Cliente nao encontrado');
            return mapCliente(usuario);
        }

        const usuario = await User.findByPk(id);
        if (!usuario || usuario.role !== 'cliente') throw new ApiError(404, 'Cliente nao encontrado');

        return mapCliente(usuario);
    },
    atualizar: async (id: string, dados: Partial<User>) => {
        if (env.useMocks) {
            const index = mockUsuarios.findIndex((usuario) => usuario.id === id);
            if (index < 0) throw new ApiError(404, 'Cliente nao encontrado');

            mockUsuarios[index] = { ...mockUsuarios[index], ...dados } as (typeof mockUsuarios)[number];
            return mapCliente(mockUsuarios[index]);
        }

        const usuario = await User.findByPk(id);
        if (!usuario) throw new ApiError(404, 'Cliente nao encontrado');

        await usuario.update(dados);
        return mapCliente(usuario);
    },
    criar: async (dados: { nome: string; email: string; senha: string; endereco: EnderecoCliente }) => {
        if (env.useMocks) {
            const existe = mockUsuarios.find((usuario) => usuario.email === dados.email);
            if (existe) throw new ApiError(409, 'Email ja cadastrado');

            const enderecoCompleto = {
                ...dados.endereco,
                complemento: dados.endereco.complemento ?? '',
            };

            const novo = {
                id: `cli-${Date.now()}`,
                nome: dados.nome,
                email: dados.email,
                senhaHash: bcrypt.hashSync(dados.senha, 10),
                role: 'cliente' as const,
                ativo: true,
                endereco: enderecoCompleto,
                permissoes: ['agendamentos', 'logs'],
            };
            mockUsuarios.push(novo);
            return mapCliente(novo);
        }

        const existe = await User.findOne({ where: { email: dados.email } });
        if (existe) throw new ApiError(409, 'Email ja cadastrado');

        const senhaHash = await bcrypt.hash(dados.senha, 10);
        const usuario = await User.create({
            nome: dados.nome,
            email: dados.email,
            senhaHash,
            role: 'cliente',
            ativo: true,
            endereco: dados.endereco,
            permissoes: ['agendamentos', 'logs'],
        });

        return mapCliente(usuario);
    },
};
