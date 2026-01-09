/**
 * @fileoverview Componente Modal reutilizável
 * @description Modal genérico para formulários e confirmações
 */

'use client';

import React, { useEffect } from 'react';

/**
 * Props do componente Modal
 */
interface ModalProps {
    /** Se o modal está aberto */
    aberto: boolean;
    /** Callback para fechar o modal */
    onFechar: () => void;
    /** Título do modal */
    titulo: string;
    /** Conteúdo do modal */
    children: React.ReactNode;
    /** Conteúdo do rodapé (botões de ação) */
    rodape?: React.ReactNode;
    /** Classe adicional para o modal */
    className?: string;
    /** Classe adicional para o overlay */
    overlayClassName?: string;
}

/**
 * Componente Modal reutilizável
 * 
 * @description
 * Modal acessível com:
 * - Fechamento ao clicar no overlay
 * - Fechamento com tecla ESC
 * - Prevenção de scroll do body
 * 
 * @example
 * ```tsx
 * <Modal 
 *   aberto={modalAberto} 
 *   onFechar={() => setModalAberto(false)}
 *   titulo="Ajustes de agendamento"
 * >
 *   <FormularioAjustes />
 * </Modal>
 * ```
 */
export function Modal({ aberto, onFechar, titulo, children, rodape, className, overlayClassName }: ModalProps) {
    /**
     * Efeito para fechar modal com tecla ESC e prevenir scroll
     */
    useEffect(() => {
        const handleKeyDown = (evento: KeyboardEvent) => {
            if (evento.key === 'Escape') {
                onFechar();
            }
        };

        if (aberto) {
            // Adiciona listener para tecla ESC
            document.addEventListener('keydown', handleKeyDown);
            // Previne scroll do body
            document.body.style.overflow = 'hidden';
        }

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [aberto, onFechar]);

    // Não renderiza se não estiver aberto
    if (!aberto) return null;

    return (
        <div className={`modal-overlay${overlayClassName ? ` ${overlayClassName}` : ''}`} onClick={onFechar}>
            <div className={`modal${className ? ` ${className}` : ''}`} onClick={(e) => e.stopPropagation()}>
                {/* Cabeçalho do modal */}
                <div className="modal-header">
                    <h2 className="modal-title">{titulo}</h2>
                    <button
                        className="modal-close"
                        type="button"
                        onClick={onFechar}
                        aria-label="Fechar modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Corpo do modal */}
                <div className="modal-body">
                    {children}
                </div>

                {/* Rodapé do modal (opcional) */}
                {rodape && (
                    <div className="modal-footer">
                        {rodape}
                    </div>
                )}
            </div>
        </div>
    );
}
