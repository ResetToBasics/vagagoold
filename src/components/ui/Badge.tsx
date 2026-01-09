/**
 * @fileoverview Componente de Badge reutilizável
 * @description Badge estilizado para exibir status, categorias e labels
 */

import React from 'react';

/**
 * Variantes de estilo do badge
 */
type VarianteBadge = 'padrao' | 'cinza' | 'ciano' | 'vermelho' | 'preto';

/**
 * Props do componente Badge
 */
interface BadgeProps {
    /** Texto a ser exibido no badge */
    children: React.ReactNode;
    /** Variante de estilo do badge */
    variante?: VarianteBadge;
    /** Classe CSS adicional */
    className?: string;
}

/**
 * Mapeamento de variantes para classes CSS
 */
const CLASSES_VARIANTE: Record<VarianteBadge, string> = {
    padrao: 'admin-badge',
    cinza: 'admin-badge admin-badge-gray',
    ciano: 'admin-badge admin-badge-cyan',
    vermelho: 'admin-badge admin-badge-red',
    preto: 'admin-room-badge',
};

/**
 * Componente Badge para exibir status e categorias
 * 
 * @example
 * ```tsx
 * <Badge variante="ciano">Agendado</Badge>
 * <Badge variante="vermelho">Cancelado</Badge>
 * ```
 */
export function Badge({ children, variante = 'padrao', className = '' }: BadgeProps) {
    const classeBase = CLASSES_VARIANTE[variante];

    return (
        <span className={`${classeBase} ${className}`.trim()}>
            {children}
        </span>
    );
}

/**
 * Badge específico para permissões de cliente
 */
interface BadgePermissaoProps {
    /** Texto da permissão */
    children: React.ReactNode;
    /** Se a permissão está ativa (preenchida) */
    ativo?: boolean;
}

/**
 * Badge para exibir permissões de clientes
 */
export function BadgePermissao({ children, ativo = false }: BadgePermissaoProps) {
    const classe = ativo
        ? 'admin-permission-badge admin-permission-badge--filled'
        : 'admin-permission-badge';

    return <span className={classe}>{children}</span>;
}
