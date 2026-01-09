import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { mockUsuarios } from '../mocks/data';
import { User } from '../models';
import { ApiError } from '../utils/http';

const criarPayload = (usuario: User | (typeof mockUsuarios)[number]) => ({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.role,
});

const buscarUsuario = async (email: string) => {
    if (env.useMocks) {
        return mockUsuarios.find((usuario) => usuario.email === email) || null;
    }

    return User.findOne({ where: { email } });
};

export const authService = {
    login: async (role: 'admin' | 'cliente', email: string, senha: string) => {
        const usuario = await buscarUsuario(email);

        if (!usuario || usuario.role !== role) {
            throw new ApiError(401, 'Credenciais invalidas');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
        if (!senhaValida) {
            throw new ApiError(401, 'Credenciais invalidas');
        }

        const token = jwt.sign({ sub: usuario.id, role: usuario.role }, env.jwtSecret, {
            expiresIn: '1d',
        });

        return { token, usuario: criarPayload(usuario) };
    },
};
