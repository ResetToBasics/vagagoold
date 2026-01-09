import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models';
import { ApiError } from '../utils/http';

const criarPayload = (usuario: User) => ({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.role,
});

const buscarUsuario = async (email: string) => User.findOne({ where: { email } });

export const authService = {
    login: async (role: 'admin' | 'cliente', email: string, senha: string) => {
        const usuario = await buscarUsuario(email);

        if (!usuario || usuario.role !== role) {
            throw new ApiError(401, 'Credenciais invalidas');
        }

        if (!usuario.ativo) {
            throw new ApiError(403, 'Usuario inativo');
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
