/**
 * @fileoverview Componente de Paginação
 * @description Navegação entre páginas de listagem
 */

import React from 'react';

/**
 * Props do componente Paginacao
 */
interface PaginacaoProps {
    /** Página atual (1-indexed) */
    paginaAtual: number;
    /** Total de páginas */
    totalPaginas: number;
    /** Callback quando a página muda */
    onMudarPagina: (novaPagina: number) => void;
}

/**
 * Componente de Paginação para navegação em listas
 * 
 * @example
 * ```tsx
 * <Paginacao 
 *   paginaAtual={1} 
 *   totalPaginas={5} 
 *   onMudarPagina={setPagina} 
 * />
 * ```
 */
export function Paginacao({ paginaAtual, totalPaginas, onMudarPagina }: PaginacaoProps) {
    /**
     * Navega para a página anterior
     */
    const irParaAnterior = () => {
        if (paginaAtual > 1) {
            onMudarPagina(paginaAtual - 1);
        }
    };

    /**
     * Navega para a próxima página
     */
    const irParaProxima = () => {
        if (paginaAtual < totalPaginas) {
            onMudarPagina(paginaAtual + 1);
        }
    };

    return (
        <div className="admin-pagination">
            <button
                className="admin-page-btn"
                type="button"
                onClick={irParaAnterior}
                disabled={paginaAtual <= 1}
                aria-label="Página anterior"
            >
                ‹
            </button>

            <button
                className="admin-page-btn admin-page-btn--active"
                type="button"
                aria-current="page"
            >
                {paginaAtual}
            </button>

            <button
                className="admin-page-btn"
                type="button"
                onClick={irParaProxima}
                disabled={paginaAtual >= totalPaginas}
                aria-label="Próxima página"
            >
                ›
            </button>
        </div>
    );
}
