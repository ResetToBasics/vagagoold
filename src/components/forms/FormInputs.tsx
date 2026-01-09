/**
 * @fileoverview Componentes de formulário reutilizáveis
 * @description Inputs, selects e outros elementos de formulário estilizados
 */

import React from 'react';
import { IconeBusca, IconeCalendario, IconeSetaBaixo } from '../ui/Icones';

/**
 * Props do componente CampoBusca
 */
interface CampoBuscaProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Texto do placeholder */
    placeholder?: string;
    /** Largura máxima do campo */
    larguraMaxima?: string;
}

/**
 * Campo de busca com ícone de lupa
 */
export function CampoBusca({ placeholder = 'Buscar...', larguraMaxima = '300px', ...props }: CampoBuscaProps) {
    return (
        <div className="admin-input-wrapper" style={{ maxWidth: larguraMaxima }}>
            <IconeBusca className="admin-input-icon" />
            <input
                className="admin-input"
                type="text"
                placeholder={placeholder}
                {...props}
            />
        </div>
    );
}

/**
 * Props do componente CampoData
 */
interface CampoDataProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Texto do placeholder */
    placeholder?: string;
}

/**
 * Campo de seleção de data com ícone de calendário
 */
export function CampoData({ placeholder = 'Selecione', ...props }: CampoDataProps) {
    return (
        <div className="admin-input-wrapper admin-input-wrapper--compact">
            <IconeCalendario largura={16} altura={16} className="admin-input-icon admin-input-icon--right" />
            <input
                className="admin-input admin-input--right"
                type="text"
                placeholder={placeholder}
                {...props}
            />
        </div>
    );
}

/**
 * Props do componente CampoTexto
 */
interface CampoTextoProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Label do campo */
    label: React.ReactNode;
    /** Ícone à direita (opcional) */
    icone?: React.ReactNode;
}

/**
 * Campo de texto padrão com label
 */
export function CampoTexto({ label, icone, ...props }: CampoTextoProps) {
    return (
        <div className="modal-field">
            <label className="modal-label">{label}</label>
            {icone ? (
                <div className="modal-input-wrapper">
                    <input className="modal-input" {...props} />
                    <span className="modal-input-icon">{icone}</span>
                </div>
            ) : (
                <input className="modal-input" {...props} />
            )}
        </div>
    );
}

/**
 * Props do componente Select
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    /** Label do campo */
    label: string;
    /** Opções do select */
    opcoes: Array<{ valor: string | number; label: string }>;
}

/**
 * Campo de seleção (dropdown) estilizado
 */
export function Select({ label, opcoes, ...props }: SelectProps) {
    return (
        <div className="modal-field">
            <label className="modal-label">{label}</label>
            <div className="modal-select-wrapper">
                <select className="modal-select" {...props}>
                    {opcoes.map((opcao) => (
                        <option key={opcao.valor} value={opcao.valor}>
                            {opcao.label}
                        </option>
                    ))}
                </select>
                <IconeSetaBaixo largura={18} altura={18} className="modal-select-icon" />
            </div>
        </div>
    );
}
