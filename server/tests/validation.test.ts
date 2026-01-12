import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { validarSchema } from '../src/utils/validation';

const schema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

describe('validarSchema', () => {
  it('aceita dados validos', () => {
    const resultado = validarSchema(schema, { email: 'admin@vagagoold.com.br', senha: 'admin123' });
    expect(resultado.email).toBe('admin@vagagoold.com.br');
  });

  it('rejeita dados invalidos', () => {
    expect(() => validarSchema(schema, { email: 'invalido', senha: '123' })).toThrow();
  });
});
