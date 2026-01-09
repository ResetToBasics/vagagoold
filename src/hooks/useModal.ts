/**
 * @fileoverview Hook para gerenciamento de estado de modal
 * @description Hook customizado para controlar abertura/fechamento de modais
 */

import { useState, useCallback } from 'react';

/**
 * Retorno do hook useModal
 */
interface UseModalRetorno {
    /** Se o modal está aberto */
    aberto: boolean;
    /** Função para abrir o modal */
    abrir: () => void;
    /** Função para fechar o modal */
    fechar: () => void;
    /** Função para alternar estado do modal */
    alternar: () => void;
}

/**
 * Hook para gerenciamento de estado de modal
 * 
 * @param estadoInicial - Estado inicial do modal (padrão: false)
 * @returns Objeto com estado e funções de controle
 * 
 * @example
 * ```tsx
 * function MeuComponente() {
 *   const modal = useModal();
 * 
 *   return (
 *     <>
 *       <button onClick={modal.abrir}>Abrir Modal</button>
 *       <Modal aberto={modal.aberto} onFechar={modal.fechar}>
 *         Conteúdo
 *       </Modal>
 *     </>
 *   );
 * }
 * ```
 */
export function useModal(estadoInicial: boolean = false): UseModalRetorno {
    const [aberto, setAberto] = useState(estadoInicial);

    const abrir = useCallback(() => {
        setAberto(true);
    }, []);

    const fechar = useCallback(() => {
        setAberto(false);
    }, []);

    const alternar = useCallback(() => {
        setAberto((estadoAtual) => !estadoAtual);
    }, []);

    return {
        aberto,
        abrir,
        fechar,
        alternar,
    };
}
