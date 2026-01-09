/**
 * @fileoverview Layout base do painel do cliente
 * @description Wrapper para páginas do cliente com sidebar e header
 */

'use client';

import React, { useEffect, useState } from 'react';
import { SidebarCliente } from './SidebarCliente';
import { authStorage } from '@/utils';

/**
 * Props do componente ClienteLayout
 */
interface ClienteLayoutProps {
    /** Conteúdo da página */
    children: React.ReactNode;
    /** Título da página */
    titulo: string;
    /** Subtítulo/descrição da página */
    subtitulo?: string;
    /** Nome do cliente logado */
    nomeCliente?: string;
}

/**
 * Layout base para páginas do cliente
 */
export function ClienteLayout({ children, titulo, subtitulo, nomeCliente }: ClienteLayoutProps) {
    const [nomeExibido, setNomeExibido] = useState(nomeCliente);

    useEffect(() => {
        if (nomeCliente) {
            setNomeExibido(nomeCliente);
            return;
        }

        const usuario = authStorage.obterUsuario();
        if (usuario?.nome) {
            setNomeExibido(usuario.nome);
        }
    }, [nomeCliente]);

    return (
        <div className="admin-page">
            <SidebarCliente nomeCliente={nomeExibido} />

            <main className="admin-content">
                <header className="admin-page-header">
                    <h1>{titulo}</h1>
                    {subtitulo && <p>{subtitulo}</p>}
                </header>

                {children}
            </main>
        </div>
    );
}
