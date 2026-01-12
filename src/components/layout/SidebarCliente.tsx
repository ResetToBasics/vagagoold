/**
 * @fileoverview Sidebar do Painel do Cliente
 * @description Menu lateral de navegação para clientes logados
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogoVagaGoold, IconeCalendario, IconeLista, IconeUsuario, IconeSetaBaixo } from '../ui/Icones';
import { authStorage } from '@/utils';

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
    const router = useRouter();
    const profileRef = useRef<HTMLDivElement | null>(null);
    const [menuAberto, setMenuAberto] = useState(false);
    const [menuMobileAberto, setMenuMobileAberto] = useState(false);

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

    const handleLogout = () => {
        authStorage.limparSessao();
        setMenuAberto(false);
        router.push('/login');
    };

    useEffect(() => {
        if (!menuAberto) return;

        const handleClickFora = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setMenuAberto(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuAberto(false);
            }
        };

        document.addEventListener('mousedown', handleClickFora);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickFora);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [menuAberto]);

    useEffect(() => {
        setMenuMobileAberto(false);
    }, [pathname]);

    return (
        <aside className={`admin-sidebar${menuMobileAberto ? ' admin-sidebar--mobile-open' : ''}`}>
            {/* Área do logo */}
            <div className="admin-logo-area">
                <LogoVagaGoold largura={52} altura={52} className="admin-logo" />
                <button
                    type="button"
                    className="admin-hamburger"
                    aria-label={menuMobileAberto ? 'Fechar menu' : 'Abrir menu'}
                    aria-expanded={menuMobileAberto}
                    aria-controls="cliente-nav"
                    onClick={() => setMenuMobileAberto((estadoAtual) => !estadoAtual)}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            {/* Menu de navegação */}
            <nav className="admin-nav" aria-label="Menu principal" id="cliente-nav">
                {MENU_CLIENTE.map((item) => {
                    const ativo = estaAtivo(item.href);

                    return (
                        <Link
                            key={item.id}
                            className={`admin-nav-item ${ativo ? 'admin-nav-item--active' : ''}`}
                            href={item.href}
                            aria-current={ativo ? 'page' : undefined}
                            onClick={() => setMenuMobileAberto(false)}
                        >
                            {renderizarIcone(item.icone)}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Perfil do cliente */}
            <div className="admin-profile" ref={profileRef}>
                <button
                    type="button"
                    className="admin-profile-trigger"
                    onClick={() => setMenuAberto((estadoAtual) => !estadoAtual)}
                    aria-expanded={menuAberto}
                    aria-haspopup="menu"
                >
                    <div className="admin-user-info">
                        <h4>{nomeCliente}</h4>
                        <p>Cliente</p>
                    </div>
                    <IconeSetaBaixo className={`admin-profile-chevron${menuAberto ? ' admin-profile-chevron--open' : ''}`} />
                </button>
                {menuAberto && (
                    <div className="admin-profile-menu" role="menu">
                        <button type="button" className="admin-profile-logout" onClick={handleLogout} role="menuitem">
                            Sair
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
