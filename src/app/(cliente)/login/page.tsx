/**
 * @fileoverview Página de Login do Cliente
 * @description Tela de autenticação para clientes acessarem o sistema
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogoVagaGoold } from '@/components/ui/Icones';
import { authService } from '@/services';
import { authStorage } from '@/utils';

const usarMocks = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false';

/**
 * Página de Login do Cliente
 * 
 * @description
 * Implementa login com revelação progressiva:
 * - Primeiro mostra apenas campo de email
 * - Após preencher email, revela campo de senha
 * - Botão fica ativo apenas quando ambos campos estão preenchidos
 */
export default function LoginClientePage() {
    const router = useRouter();

    // Estados do formulário
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

    // Verifica se o email foi preenchido para mostrar campo de senha
    const emailPreenchido = email.trim().length > 0;

    // Verifica se o formulário está completo para habilitar botão
    const formularioCompleto = emailPreenchido && senha.length > 0;

    /**
     * Manipula o envio do formulário de login
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formularioCompleto) return;

        setCarregando(true);

        try {
            if (usarMocks) {
                authStorage.salvarSessao('mock-token-cliente', {
                    id: 'cli-001',
                    nome: 'Camila Mendes',
                    email,
                    tipo: 'cliente',
                });
                router.push('/cliente/agendamentos');
                return;
            }

            const resposta = await authService.loginCliente({ email, senha });
            authStorage.salvarSessao(resposta.dados.token, resposta.dados.usuario);
            router.push('/cliente/agendamentos');
        } catch (erro) {
            console.error('Erro no login:', erro);
            setCarregando(false);
        }
    };

    return (
        <div className="cliente-page">
            {/* Header */}
            <header className="cliente-header">
                <div className="cliente-header-content">
                    <LogoVagaGoold largura={32} altura={32} />

                    <Link href="/cadastro" className="cliente-btn-outline">
                        Cadastre-se
                    </Link>
                </div>
            </header>

            {/* Conteúdo principal */}
            <main className="cliente-main">
                <div className="cliente-login-container">
                    <h1 className="cliente-login-titulo">Entre na sua conta</h1>

                    <div className="cliente-login-card">
                        <form className="cliente-login-form" onSubmit={handleSubmit}>
                            {/* Campo de Email */}
                            <div className="cliente-campo">
                                <label className="cliente-label">
                                    E-mail <span className="cliente-label-hint">(Obrigatório)</span>
                                </label>
                                <input
                                    type="email"
                                    className="cliente-input"
                                    placeholder="Insira seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Campo de Senha - Aparece apenas após preencher email */}
                            {emailPreenchido && (
                                <div className="cliente-campo">
                                    <label className="cliente-label">
                                        Senha de acesso <span className="cliente-label-hint">(Obrigatório)</span>
                                    </label>
                                    <div className="cliente-input-wrapper">
                                        <input
                                            type={mostrarSenha ? 'text' : 'password'}
                                            className="cliente-input"
                                            placeholder="••••••••••••"
                                            value={senha}
                                            onChange={(e) => setSenha(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="cliente-toggle-senha"
                                            onClick={() => setMostrarSenha(!mostrarSenha)}
                                            aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                                        >
                                            {mostrarSenha ? (
                                                // Ícone olho aberto
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            ) : (
                                                // Ícone olho fechado
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                    <line x1="1" y1="1" x2="23" y2="23" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Botão de Submit */}
                            <button
                                type="submit"
                                className={`cliente-btn-submit ${formularioCompleto ? 'cliente-btn-submit--ativo' : ''}`}
                                disabled={!formularioCompleto || carregando}
                            >
                                {carregando ? 'Entrando...' : 'Acessar conta'}
                            </button>
                        </form>

                        {/* Link para cadastro */}
                        <p className="cliente-login-cadastro">
                            <span>Ainda não tem um cadastro?</span>
                            <Link href="/cadastro" className="cliente-link">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
