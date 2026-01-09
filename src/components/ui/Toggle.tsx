/**
 * @fileoverview Componente Toggle Switch
 * @description Interruptor de alternância para status booleanos
 */

import React from 'react';

/**
 * Props do componente Toggle
 */
interface ToggleProps {
    /** Se o toggle está ativado */
    ativo: boolean;
    /** Callback quando o valor muda */
    onChange: (novoValor: boolean) => void;
    /** Label de acessibilidade */
    ariaLabel?: string;
    /** Se o toggle está desabilitado */
    desabilitado?: boolean;
}

/**
 * Componente Toggle Switch para alternância de estados
 * 
 * @example
 * ```tsx
 * <Toggle 
 *   ativo={cliente.ativo} 
 *   onChange={(valor) => handleToggle(valor)} 
 * />
 * ```
 */
export function Toggle({ ativo, onChange, ariaLabel, desabilitado = false }: ToggleProps) {
    return (
        <label className="admin-toggle">
            <input
                type="checkbox"
                checked={ativo}
                onChange={(e) => onChange(e.target.checked)}
                aria-label={ariaLabel}
                disabled={desabilitado}
            />
            <span className="admin-toggle-slider" />
        </label>
    );
}
