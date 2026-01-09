/**
 * @fileoverview Componente de Botão reutilizável
 * @description Botão estilizado com múltiplas variantes
 */

import React from 'react';

/**
 * Variantes de estilo do botão
 */
type VarianteBotao = 'primario' | 'secundario' | 'acao' | 'link';

/**
 * Props do componente Botao
 */
interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Conteúdo do botão */
    children: React.ReactNode;
    /** Variante de estilo */
    variante?: VarianteBotao;
    /** Se o botão está em estado de carregamento */
    carregando?: boolean;
}

/**
 * Mapeamento de variantes para classes CSS
 */
const CLASSES_VARIANTE: Record<VarianteBotao, string> = {
    primario: 'admin-btn-black',
    secundario: 'admin-btn-secondary',
    acao: 'admin-action-btn',
    link: 'modal-add-room',
};

/**
 * Componente de Botão reutilizável
 * 
 * @example
 * ```tsx
 * <Botao variante="primario" onClick={handleClick}>
 *   Salvar
 * </Botao>
 * ```
 */
export function Botao({
    children,
    variante = 'primario',
    carregando = false,
    disabled,
    className = '',
    ...props
}: BotaoProps) {
    const classeBase = CLASSES_VARIANTE[variante];

    return (
        <button
            className={`${classeBase} ${className}`.trim()}
            disabled={disabled || carregando}
            {...props}
        >
            {carregando ? 'Carregando...' : children}
        </button>
    );
}

/**
 * Botão de ação circular (aprovar/rejeitar)
 */
interface BotaoAcaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Ícone a ser exibido */
    icone: '✕' | '✓';
    /** Label de acessibilidade */
    ariaLabel: string;
    /** Título do tooltip */
    titulo?: string;
}

/**
 * Botão circular para ações rápidas na tabela
 */
export function BotaoAcao({ icone, ariaLabel, titulo, ...props }: BotaoAcaoProps) {
    return (
        <button
            className="admin-action-btn"
            type="button"
            aria-label={ariaLabel}
            title={titulo}
            {...props}
        >
            {icone}
        </button>
    );
}
