/**
 * @fileoverview Componente Sidebar do painel administrativo
 * @description Menu lateral de navegação do painel admin
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogoVagaGoold, IconeCalendario, IconeUsuarios, IconeLista, IconeSetaBaixo } from '../ui/Icones';
import { MENU_ADMIN, USUARIO_ADMIN } from '@/constants';
import { authStorage } from '@/utils';

/**
 * Componente Sidebar para navegação do painel administrativo
 * 
 * @description
 * Renderiza o menu lateral com:
 * - Logo da aplicação
 * - Links de navegação com destaque no item ativo
 * - Informações do usuário logado
 */
export function Sidebar() {
    // Hook para obter a rota atual e destacar o item ativo
    const pathname = usePathname();
    const router = useRouter();
    const profileRef = useRef<HTMLDivElement | null>(null);
    const [menuAberto, setMenuAberto] = useState(false);

    /**
     * Renderiza o ícone correto baseado no tipo
     */
    const renderizarIcone = (tipoIcone: string) => {
        switch (tipoIcone) {
            case 'calendario':
                return <IconeCalendario />;
            case 'usuarios':
                return <IconeUsuarios />;
            case 'lista':
                return <IconeLista />;
            default:
                return null;
        }
    };

    /**
     * Verifica se o item está ativo baseado na rota atual
     */
    const estaAtivo = (href: string) => pathname === href;

    const handleLogout = () => {
        authStorage.limparSessao();
        setMenuAberto(false);
        router.push('/admin/login');
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

    return (
        <aside className="admin-sidebar">
            {/* Área do logo */}
            <div className="admin-logo-area">
                <LogoVagaGoold largura={52} altura={52} className="admin-logo" />
            </div>

            {/* Menu de navegação */}
            <nav className="admin-nav" aria-label="Menu principal">
                {MENU_ADMIN.map((item) => {
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

            {/* Perfil do usuário */}
            <div className="admin-profile" ref={profileRef}>
                <button
                    type="button"
                    className="admin-profile-trigger"
                    onClick={() => setMenuAberto((estadoAtual) => !estadoAtual)}
                    aria-expanded={menuAberto}
                    aria-haspopup="menu"
                >
                    <div className="admin-user-info">
                        <h4>{USUARIO_ADMIN.nome}</h4>
                        <p>{USUARIO_ADMIN.cargo}</p>
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
