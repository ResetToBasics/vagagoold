/**
 * @fileoverview Redirecionamento da raiz do Admin
 * @description Garante que acessos a /admin sejam direcionados para o login administrativo
 */

import { redirect } from 'next/navigation';

export default function AdminRootRedirect() {
    redirect('/admin/login');
}
