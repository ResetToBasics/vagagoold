/**
 * @fileoverview Layout base do painel administrativo
 * @description Wrapper para todas as páginas do admin
 */

'use client';

import React from 'react';
import { Sidebar } from './Sidebar';

/**
 * Props do componente AdminLayout
 */
interface AdminLayoutProps {
    /** Conteúdo da página */
    children: React.ReactNode;
    /** Título da página */
    titulo: string;
    /** Subtítulo/descrição da página */
    subtitulo?: string;
}

/**
 * Layout base para páginas administrativas
 * 
 * @description
 * Fornece estrutura consistente com:
 * - Sidebar de navegação
 * - Área de conteúdo principal
 * - Header com título da página
 * 
 * @example
 * ```tsx
 * <AdminLayout titulo="Agendamentos" subtitulo="Gerencie os agendamentos">
 *   <TabelaAgendamentos />
 * </AdminLayout>
 * ```
 */
export function AdminLayout({ children, titulo, subtitulo }: AdminLayoutProps) {
    return (
        <div className="admin-page">
            {/* Menu lateral */}
            <Sidebar />

            {/* Área de conteúdo principal */}
            <main className="admin-content">
                {/* Cabeçalho da página */}
                <header className="admin-page-header">
                    <h1>{titulo}</h1>
                    {subtitulo && <p>{subtitulo}</p>}
                </header>

                {/* Conteúdo específico da página */}
                {children}
            </main>
        </div>
    );
}
