import bcrypt from 'bcryptjs';
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

const mapCliente = (usuario: User) => ({
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
        const usuarios = await User.findAll({ where: { role: 'cliente' } });
        return usuarios.map(mapCliente);
    },
    buscarPorId: async (id: string) => {
        const usuario = await User.findByPk(id);
        if (!usuario || usuario.role !== 'cliente') throw new ApiError(404, 'Cliente nao encontrado');

        return mapCliente(usuario);
    },
    atualizar: async (id: string, dados: Partial<User>) => {
        const usuario = await User.findByPk(id);
        if (!usuario) throw new ApiError(404, 'Cliente nao encontrado');

        if (dados.email && dados.email !== usuario.email) {
            const existente = await User.findOne({ where: { email: dados.email } });
            if (existente) {
                throw new ApiError(409, 'Email ja cadastrado');
            }
        }

        await usuario.update(dados);
        return mapCliente(usuario);
    },
    criar: async (dados: { nome: string; email: string; senha: string; endereco: EnderecoCliente }) => {
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
