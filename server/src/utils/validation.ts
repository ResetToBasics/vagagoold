import { ZodError, ZodSchema } from 'zod';
import { ApiError } from './http';

export const validarSchema = <T>(schema: ZodSchema<T>, dados: unknown): T => {
    try {
        return schema.parse(dados);
    } catch (erro) {
        if (erro instanceof ZodError) {
            const primeira = erro.issues[0];
            throw new ApiError(400, primeira?.message || 'Dados invalidos');
        }
        throw erro;
    }
};
