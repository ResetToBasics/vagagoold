import { describe, expect, it } from 'vitest';
import { capitalizarPalavras, formatarData, formatarDataHora, formatarEndereco } from '../src/utils/formatacao';

describe('formatacao', () => {
  it('formata data e hora no padrao brasileiro', () => {
    const resultado = formatarDataHora('2025-01-22T16:05:00');
    expect(resultado).toBe('22/01/2025 às 16:05');
  });

  it('formata apenas data', () => {
    const resultado = formatarData('2025-01-22T00:00:00');
    expect(resultado).toBe('22/01/2025');
  });

  it('formata endereco em duas linhas', () => {
    const resultado = formatarEndereco({
      logradouro: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'Sao Paulo',
      estado: 'SP',
    });
    expect(resultado.linha1).toBe('Rua das Flores n°123, Centro');
    expect(resultado.linha2).toBe('Sao Paulo - SP');
  });

  it('capitaliza palavras', () => {
    const resultado = capitalizarPalavras('camila mendes');
    expect(resultado).toBe('Camila Mendes');
  });
});
