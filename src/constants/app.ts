/**
 * @fileoverview Constantes gerais da aplicação
 * @description Define valores constantes utilizados em toda a aplicação
 */

/**
 * Configurações de paginação padrão
 */
export const PAGINACAO = {
    /** Quantidade de itens por página padrão */
    ITENS_POR_PAGINA: 10,
    /** Opções de quantidade de itens por página */
    OPCOES_ITENS: [10, 25, 50, 100],
} as const;

/**
 * Opções de duração de bloco de agendamento (em minutos)
 */
export const OPCOES_DURACAO_BLOCO = [
    { valor: 15, label: '15 minutos' },
    { valor: 30, label: '30 minutos' },
    { valor: 45, label: '45 minutos' },
    { valor: 60, label: '60 minutos' },
] as const;
