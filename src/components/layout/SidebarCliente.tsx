/**
 * @fileoverview Sidebar do Painel do Cliente
 * @description Menu lateral de navegação para clientes logados
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoVagaGoold, IconeCalendario, IconeLista, IconeUsuario, IconeSetaBaixo } from '../ui/Icones';

/**
 * Itens de navegação do menu do cliente
 */
const MENU_CLIENTE = [
    {
        id: 'agendamentos',
        label: 'Agendamentos',
        href: '/cliente/agendamentos',
        icone: 'calendario',
    },
    {
        id: 'logs',
        label: 'Logs',
        href: '/cliente/logs',
        icone: 'lista',
    },
    {
        id: 'minha-conta',
        label: 'Minha Conta',
        href: '/cliente/minha-conta',
        icone: 'usuario',
    },
];

/**
 * Props do componente
 */
interface SidebarClienteProps {
    /** Nome do cliente logado */
    nomeCliente?: string;
}

/**
 * Sidebar para o painel do cliente
 */
export function SidebarCliente({ nomeCliente = 'Camila Mendes' }: SidebarClienteProps) {
    const pathname = usePathname();

    /**
     * Renderiza o ícone correto baseado no tipo
     */
    const renderizarIcone = (tipoIcone: string) => {
        switch (tipoIcone) {
            case 'calendario':
                return <IconeCalendario />;
            case 'lista':
                return <IconeLista />;
            case 'usuario':
                return <IconeUsuario />;
            default:
                return null;
        }
    };

    /**
     * Verifica se o item está ativo baseado na rota atual
     */
    const estaAtivo = (href: string) => pathname?.includes(href);

    return (
        <aside className="admin-sidebar">
            {/* Área do logo */}
            <div className="admin-logo-area">
                <LogoVagaGoold largura={52} altura={52} className="admin-logo" />
            </div>

            {/* Menu de navegação */}
            <nav className="admin-nav" aria-label="Menu principal">
                {MENU_CLIENTE.map((item) => {
                    const ativo = estaAtivo(item.href);

                    return (
                        <Link
                            key={item.id}
                            className={`admin-nav-item ${ativo ? 'admin-nav-item--active' : ''}`}
                            href={item.href}
                            aria-current={ativo ? 'page' : undefined}
                        >
                            {renderizarIcone(item.icone)}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Perfil do cliente */}
            <div className="admin-profile">
                <div className="admin-user-info">
                    <h4>{nomeCliente}</h4>
                    <p>Cliente</p>
                </div>
                <IconeSetaBaixo />
            </div>
        </aside>
    );
}
