/**
 * @fileoverview Página inicial - Redireciona para o painel do cliente
 * @description Redireciona automaticamente para a página de login do cliente
 */

import { redirect } from 'next/navigation';

/**
 * Página raiz que redireciona para o login do cliente
 */
export default function Home() {
  redirect('/login');
}
