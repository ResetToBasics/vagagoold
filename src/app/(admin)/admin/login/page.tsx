/**
 * @fileoverview Página de Login do Administrador
 * @description Tela de autenticação para acesso ao painel administrativo
 */

'use client';

import { useState } from 'react';
import { LogoVagaGoold } from '@/components/ui/Icones';
import { authService } from '@/services';
import { authStorage } from '@/utils';

/**
 * Página de Login do Admin
 */
export default function LoginAdminPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const formularioCompleto = email.trim().length > 0 && senha.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formularioCompleto) return;

        setCarregando(true);

        try {
            const resposta = await authService.loginAdmin({ email, senha });
            authStorage.salvarSessao(resposta.dados.token, resposta.dados.usuario);
            document.cookie = 'admin_session=true; path=/; max-age=86400';
            window.location.href = '/admin/agendamentos';
        } catch (erro) {
            console.error('Erro no login admin:', erro);
            setCarregando(false);
        }
    };

    return (
        <div className="admin-login-page">
            <main className="admin-login-main">
                <div className="admin-login-panel">
                    <LogoVagaGoold largura={48} altura={48} className="admin-login-logo" />
                    <h1 className="admin-login-title">Login Admin</h1>

                    <div className="admin-login-card">
                        <form className="admin-login-form" onSubmit={handleSubmit}>
                            <div className="cliente-campo admin-login-field">
                                <label className="cliente-label admin-login-label">
                                    E-mail <span className="cliente-label-hint">(Obrigatorio)</span>
                                </label>
                                <input
                                    type="email"
                                    className="cliente-input admin-login-input"
                                    placeholder="admin@vagagoold.com.br"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="cliente-campo admin-login-field">
                                <label className="cliente-label admin-login-label">
                                    Senha de acesso <span className="cliente-label-hint">(Obrigatorio)</span>
                                </label>
                                <div className="cliente-input-wrapper">
                                    <input
                                        type={mostrarSenha ? 'text' : 'password'}
                                        className="cliente-input admin-login-input"
                                        placeholder="************"
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
                                        {mostrarSenha ? '👁' : '👁‍🗨'}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`cliente-btn-submit ${formularioCompleto ? 'cliente-btn-submit--ativo' : ''}`}
                                disabled={!formularioCompleto || carregando}
                            >
                                {carregando ? 'Entrando...' : 'Acessar conta'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
