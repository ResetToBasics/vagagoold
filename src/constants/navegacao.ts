/**
 * @fileoverview Constantes de navegação do painel administrativo
 * @description Define os itens de menu e rotas do sistema admin
 */

/**
 * Interface para item de navegação
 */
export interface ItemNavegacao {
    /** Identificador único do item */
    id: string;
    /** Label exibido no menu */
    label: string;
    /** Rota de destino */
    href: string;
    /** Ícone do item (nome do ícone) */
    icone: 'calendario' | 'usuarios' | 'lista';
}

/**
 * Itens de navegação do menu lateral admin
 */
export const MENU_ADMIN: ItemNavegacao[] = [
    {
        id: 'agendamentos',
        label: 'Agendamentos',
        href: '/admin/agendamentos',
        icone: 'calendario',
    },
    {
        id: 'clientes',
        label: 'Clientes',
        href: '/admin/clientes',
        icone: 'usuarios',
    },
    {
        id: 'logs',
        label: 'Logs',
        href: '/admin/logs',
        icone: 'lista',
    },
];
