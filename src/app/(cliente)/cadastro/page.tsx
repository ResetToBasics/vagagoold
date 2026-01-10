/**
 * @fileoverview Página de Cadastro do Cliente
 * @description Tela de registro para novos clientes do sistema
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconeOlhoSenha, LogoVagaGoold } from '@/components/ui/Icones';
import { clienteService } from '@/services';

/**
 * Interface para dados do formulário de cadastro
 */
interface DadosCadastro {
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
}

/**
 * Estado inicial do formulário
 */
const ESTADO_INICIAL: DadosCadastro = {
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
};

/**
 * Página de Cadastro do Cliente
 * 
 * @description
 * Implementa cadastro com revelação progressiva:
 * - Primeiro mostra campos básicos (nome, email, senha, CEP)
 * - Após preencher CEP válido, busca endereço e revela campos de endereço
 * - Campos de endereço automáticos são readonly
 */
export default function CadastroClientePage() {
    const router = useRouter();
    // Estado do formulário
    const [dados, setDados] = useState<DadosCadastro>(ESTADO_INICIAL);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [buscandoCep, setBuscandoCep] = useState(false);
    const [enderecoCarregado, setEnderecoCarregado] = useState(false);

    /**
     * Atualiza um campo do formulário
     */
    const atualizarCampo = (campo: keyof DadosCadastro, valor: string) => {
        setDados((prev) => ({ ...prev, [campo]: valor }));
    };

    /**
     * Formata o CEP enquanto digita (00000-000)
     */
    const formatarCep = (valor: string) => {
        const apenasNumeros = valor.replace(/\D/g, '');
        if (apenasNumeros.length <= 5) {
            return apenasNumeros;
        }
        return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5, 8)}`;
    };

    /**
     * Manipula mudança no campo CEP
     */
    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorFormatado = formatarCep(e.target.value);
        atualizarCampo('cep', valorFormatado);

        // Busca endereço quando CEP tiver 9 caracteres (00000-000)
        if (valorFormatado.length === 9) {
            await buscarEndereco(valorFormatado);
        } else {
            // Limpa campos de endereço se CEP incompleto
            setEnderecoCarregado(false);
            setDados((prev) => ({
                ...prev,
                endereco: '',
                bairro: '',
                cidade: '',
                estado: '',
            }));
        }
    };

    /**
     * Busca endereço via API ViaCEP
     */
    const buscarEndereco = async (cep: string) => {
        const cepLimpo = cep.replace('-', '');
        setBuscandoCep(true);

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const dados = await resposta.json();

            if (!dados.erro) {
                setDados((prev) => ({
                    ...prev,
                    endereco: dados.logradouro || '',
                    bairro: dados.bairro || '',
                    cidade: dados.localidade || '',
                    estado: dados.uf || '',
                }));
                setEnderecoCarregado(true);
            } else {
                setEnderecoCarregado(false);
            }
        } catch (erro) {
            console.error('Erro ao buscar CEP:', erro);
            setEnderecoCarregado(false);
        } finally {
            setBuscandoCep(false);
        }
    };

    /**
     * Verifica se o formulário está completo
     */
    const formularioCompleto = () => {
        return (
            dados.nome.trim() &&
            dados.sobrenome.trim() &&
            dados.email.trim() &&
            dados.senha.length >= 6 &&
            dados.cep.length === 9 &&
            enderecoCarregado &&
            dados.numero.trim()
        );
    };

    /**
     * Manipula o envio do formulário
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formularioCompleto()) return;

        setCarregando(true);

        try {
            await clienteService.criar({
                nome: `${dados.nome} ${dados.sobrenome}`.trim(),
                email: dados.email,
                senha: dados.senha,
                endereco: {
                    logradouro: dados.endereco,
                    numero: dados.numero,
                    complemento: dados.complemento || undefined,
                    bairro: dados.bairro,
                    cidade: dados.cidade,
                    estado: dados.estado,
                    cep: dados.cep,
                },
            });

            router.push('/login');
        } catch (erro) {
            console.error('Erro no cadastro:', erro);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="cliente-page">
            {/* Header */}
            <header className="cliente-header">
                <div className="cliente-header-content">
                    <LogoVagaGoold largura={32} altura={32} />

                    <a href="/login" className="cliente-btn-outline">
                        Login
                    </a>
                </div>
            </header>

            {/* Conteúdo principal */}
            <main className="cliente-main">
                <div className="cliente-cadastro-container">
                    <div className="cliente-login-card">
                        <h1 className="cliente-login-titulo">Cadastre-se</h1>

                        <form className="cliente-login-form" onSubmit={handleSubmit}>
                            {/* Nome e Sobrenome - lado a lado */}
                            <div className="cliente-campo-row">
                                <div className="cliente-campo">
                                    <label className="cliente-label">
                                        Nome <span className="cliente-label-hint">(Obrigatório)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="cliente-input"
                                        placeholder="ex: José"
                                        value={dados.nome}
                                        onChange={(e) => atualizarCampo('nome', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="cliente-campo">
                                    <label className="cliente-label">
                                        Sobrenome <span className="cliente-label-hint">(Obrigatório)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="cliente-input"
                                        placeholder="ex: Lima"
                                        value={dados.sobrenome}
                                        onChange={(e) => atualizarCampo('sobrenome', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="cliente-campo">
                                <label className="cliente-label">
                                    E-mail <span className="cliente-label-hint">(Obrigatório)</span>
                                </label>
                                <input
                                    type="email"
                                    className="cliente-input"
                                    placeholder="Insira seu e-mail"
                                    value={dados.email}
                                    onChange={(e) => atualizarCampo('email', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Senha */}
                            <div className="cliente-campo">
                                <label className="cliente-label">
                                    Senha de acesso <span className="cliente-label-hint">(Obrigatório)</span>
                                </label>
                                <div className="cliente-input-wrapper">
                                    <input
                                        type={mostrarSenha ? 'text' : 'password'}
                                        className="cliente-input"
                                        placeholder="Insira sua senha"
                                        value={dados.senha}
                                        onChange={(e) => atualizarCampo('senha', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="cliente-toggle-senha"
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
                                        aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                                    >
                                        <IconeOlhoSenha />
                                    </button>
                                </div>
                            </div>

                            {/* CEP */}
                            <div className="cliente-campo">
                                <label className="cliente-label">
                                    CEP <span className="cliente-label-hint">(Obrigatório)</span>
                                </label>
                                <input
                                    type="text"
                                    className="cliente-input"
                                    placeholder="Insira seu CEP"
                                    value={dados.cep}
                                    onChange={handleCepChange}
                                    maxLength={9}
                                    required
                                />
                                {buscandoCep && (
                                    <span className="cliente-campo-loading">Buscando endereço...</span>
                                )}
                            </div>

                            {/* Campos de Endereço - aparecem após CEP válido */}
                            {enderecoCarregado && (
                                <>
                                    {/* Endereço (readonly) */}
                                    <div className="cliente-campo">
                                        <label className="cliente-label">Endereço</label>
                                        <input
                                            type="text"
                                            className="cliente-input cliente-input--readonly"
                                            value={dados.endereco}
                                            readOnly
                                        />
                                    </div>

                                    {/* Número */}
                                    <div className="cliente-campo">
                                        <label className="cliente-label">Número</label>
                                        <input
                                            type="text"
                                            className="cliente-input"
                                            placeholder="Número"
                                            value={dados.numero}
                                            onChange={(e) => atualizarCampo('numero', e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Complemento */}
                                    <div className="cliente-campo">
                                        <label className="cliente-label">Complemento</label>
                                        <input
                                            type="text"
                                            className="cliente-input"
                                            placeholder="Apartamento, sala, etc."
                                            value={dados.complemento}
                                            onChange={(e) => atualizarCampo('complemento', e.target.value)}
                                        />
                                    </div>

                                    {/* Bairro (readonly) */}
                                    <div className="cliente-campo">
                                        <label className="cliente-label">Bairro</label>
                                        <input
                                            type="text"
                                            className="cliente-input cliente-input--readonly"
                                            value={dados.bairro}
                                            readOnly
                                        />
                                    </div>

                                    {/* Cidade (readonly) */}
                                    <div className="cliente-campo">
                                        <label className="cliente-label">Cidade</label>
                                        <input
                                            type="text"
                                            className="cliente-input cliente-input--readonly"
                                            value={dados.cidade}
                                            readOnly
                                        />
                                    </div>

                                    {/* Estado (readonly) */}
                                    <div className="cliente-campo">
                                        <label className="cliente-label">Estado</label>
                                        <input
                                            type="text"
                                            className="cliente-input cliente-input--readonly"
                                            value={dados.estado}
                                            readOnly
                                        />
                                    </div>
                                </>
                            )}

                            {/* Botão de Submit */}
                            <button
                                type="submit"
                                className={`cliente-btn-submit ${formularioCompleto() ? 'cliente-btn-submit--ativo' : ''}`}
                                disabled={!formularioCompleto() || carregando}
                            >
                                {carregando ? 'Cadastrando...' : 'Cadastrar-se'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
