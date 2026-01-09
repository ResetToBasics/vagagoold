/**
 * @fileoverview Pagina Minha Conta do Cliente
 * @description Formulario para atualizar dados pessoais do cliente
 */

'use client';

import { useEffect, useState } from 'react';
import { ClienteLayout } from '@/components/layout';
import { clienteService } from '@/services';
import { authStorage } from '@/utils';
import { CLIENTES_MOCK } from '@/mocks';
import type { Cliente } from '@/types';

const usarMocks = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false';

interface DadosFormulario {
    nome: string;
    sobrenome: string;
    email: string;
    telefone: string;
    cpf: string;
    senha: string;
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
}

const estadoInicial: DadosFormulario = {
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cpf: '',
    senha: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
};

const separarNome = (nomeCompleto: string) => {
    const partes = nomeCompleto.trim().split(' ');
    return {
        nome: partes.shift() || '',
        sobrenome: partes.join(' '),
    };
};

/**
 * Pagina Minha Conta do Cliente
 */
export default function MinhaContaClientePage() {
    const [dados, setDados] = useState<DadosFormulario>(estadoInicial);
    const [carregando, setCarregando] = useState(false);
    const [nomeSidebar, setNomeSidebar] = useState<string | undefined>(undefined);

    useEffect(() => {
        let ativo = true;

        const carregarDados = async () => {
            const preencherFormulario = (cliente: Cliente) => {
                const nomeDividido = separarNome(cliente.nome);

                setDados((estadoAtual) => ({
                    ...estadoAtual,
                    nome: nomeDividido.nome,
                    sobrenome: nomeDividido.sobrenome,
                    email: cliente.email,
                    cep: cliente.endereco?.cep || '',
                    endereco: cliente.endereco?.logradouro || '',
                    numero: cliente.endereco?.numero || '',
                    complemento: cliente.endereco?.complemento || '',
                    bairro: cliente.endereco?.bairro || '',
                    cidade: cliente.endereco?.cidade || '',
                    estado: cliente.endereco?.estado || '',
                }));
                setNomeSidebar(cliente.nome);
            };

            if (usarMocks) {
                if (!ativo) return;
                preencherFormulario(CLIENTES_MOCK[0]);
                return;
            }

            try {
                const resposta = await clienteService.buscarMe();
                if (!ativo) return;
                preencherFormulario(resposta.dados);
            } catch (erro) {
                if (!ativo) return;
                preencherFormulario(CLIENTES_MOCK[0]);
            }
        };

        carregarDados();

        return () => {
            ativo = false;
        };
    }, []);

    const atualizarCampo = (campo: keyof DadosFormulario, valor: string) => {
        setDados((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCarregando(true);

        try {
            const nomeCompleto = `${dados.nome} ${dados.sobrenome}`.trim();

            if (!usarMocks) {
                const resposta = await clienteService.atualizarMe({
                    nome: nomeCompleto,
                    email: dados.email,
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

                setNomeSidebar(resposta.dados.nome);
                authStorage.atualizarUsuario({ nome: resposta.dados.nome, email: resposta.dados.email });
                return;
            }

            setNomeSidebar(nomeCompleto);
            authStorage.atualizarUsuario({ nome: nomeCompleto, email: dados.email });
        } catch (erro) {
            console.error('Erro ao atualizar dados:', erro);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <ClienteLayout
            titulo="Minha conta"
            subtitulo="Atualize suas informações pessoais e de contato"
            nomeCliente={nomeSidebar}
        >
            <section className="admin-card cliente-conta-card">
                <form className="cliente-conta-form" onSubmit={handleSubmit}>
                    <div className="cliente-conta-grid">
                        <div className="cliente-campo">
                            <label className="cliente-label">Nome</label>
                            <input
                                className="cliente-input"
                                type="text"
                                placeholder="Camila"
                                value={dados.nome}
                                onChange={(e) => atualizarCampo('nome', e.target.value)}
                            />
                        </div>
                        <div className="cliente-campo">
                            <label className="cliente-label">Sobrenome</label>
                            <input
                                className="cliente-input"
                                type="text"
                                placeholder="Mendes"
                                value={dados.sobrenome}
                                onChange={(e) => atualizarCampo('sobrenome', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="cliente-campo">
                        <label className="cliente-label">E-mail</label>
                        <input
                            className="cliente-input"
                            type="email"
                            placeholder="camila@exemplo.com"
                            value={dados.email}
                            onChange={(e) => atualizarCampo('email', e.target.value)}
                        />
                    </div>

                    <div className="cliente-conta-grid">
                        <div className="cliente-campo">
                            <label className="cliente-label">Telefone</label>
                            <input
                                className="cliente-input"
                                type="tel"
                                placeholder="(11) 98765-4321"
                                value={dados.telefone}
                                onChange={(e) => atualizarCampo('telefone', e.target.value)}
                            />
                        </div>
                        <div className="cliente-campo">
                            <label className="cliente-label">CPF</label>
                            <input
                                className="cliente-input"
                                type="text"
                                placeholder="000.000.000-00"
                                value={dados.cpf}
                                onChange={(e) => atualizarCampo('cpf', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="cliente-campo">
                        <label className="cliente-label">Senha de acesso</label>
                        <input
                            className="cliente-input"
                            type="password"
                            placeholder="************"
                            value={dados.senha}
                            onChange={(e) => atualizarCampo('senha', e.target.value)}
                        />
                    </div>

                    <div className="cliente-conta-grid">
                        <div className="cliente-campo">
                            <label className="cliente-label">CEP</label>
                            <input
                                className="cliente-input"
                                type="text"
                                placeholder="00000-000"
                                value={dados.cep}
                                onChange={(e) => atualizarCampo('cep', e.target.value)}
                            />
                        </div>
                        <div className="cliente-campo">
                            <label className="cliente-label">Número</label>
                            <input
                                className="cliente-input"
                                type="text"
                                placeholder="123"
                                value={dados.numero}
                                onChange={(e) => atualizarCampo('numero', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="cliente-campo">
                        <label className="cliente-label">Endereço</label>
                        <input
                            className="cliente-input"
                            type="text"
                            placeholder="Rua Exemplo, 123"
                            value={dados.endereco}
                            onChange={(e) => atualizarCampo('endereco', e.target.value)}
                        />
                    </div>

                    <div className="cliente-campo">
                        <label className="cliente-label">Complemento</label>
                        <input
                            className="cliente-input"
                            type="text"
                            placeholder="Apto 12"
                            value={dados.complemento}
                            onChange={(e) => atualizarCampo('complemento', e.target.value)}
                        />
                    </div>

                    <div className="cliente-conta-grid">
                        <div className="cliente-campo">
                            <label className="cliente-label">Bairro</label>
                            <input
                                className="cliente-input"
                                type="text"
                                placeholder="Centro"
                                value={dados.bairro}
                                onChange={(e) => atualizarCampo('bairro', e.target.value)}
                            />
                        </div>
                        <div className="cliente-campo">
                            <label className="cliente-label">Cidade</label>
                            <input
                                className="cliente-input"
                                type="text"
                                placeholder="São Paulo"
                                value={dados.cidade}
                                onChange={(e) => atualizarCampo('cidade', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="cliente-campo">
                        <label className="cliente-label">Estado</label>
                        <input
                            className="cliente-input"
                            type="text"
                            placeholder="SP"
                            value={dados.estado}
                            onChange={(e) => atualizarCampo('estado', e.target.value)}
                        />
                    </div>

                    <button className="admin-btn-black cliente-conta-btn" type="submit" disabled={carregando}>
                        {carregando ? 'Salvando...' : 'Salvar'}
                    </button>
                </form>
            </section>
        </ClienteLayout>
    );
}
