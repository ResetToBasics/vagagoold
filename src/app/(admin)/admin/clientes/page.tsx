'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/layout';
import { CampoBusca, CampoData } from '@/components/forms';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { CLIENTES_MOCK } from '@/mocks';
import { clienteService } from '@/services';
import { formatarData, formatarEndereco } from '@/utils';
import type { Cliente } from '@/types';

const usarMocks = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false';

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [busca, setBusca] = useState('');
    const [dataFiltro, setDataFiltro] = useState('');

    useEffect(() => {
        let ativo = true;

        const carregarDados = async () => {
            if (usarMocks) {
                if (!ativo) return;
                setClientes(CLIENTES_MOCK);
                return;
            }

            try {
                const clientesResp = await clienteService.listar();

                if (!ativo) return;
                setClientes(clientesResp.dados);
            } catch (erro) {
                if (!ativo) return;
                setClientes(CLIENTES_MOCK);
            }
        };

        carregarDados();

        return () => {
            ativo = false;
        };
    }, []);

    const clientesFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        const dataSelecionada = dataFiltro.trim();

        if (!termo && !dataSelecionada) return clientes;

        return clientes.filter((cliente) => {
            const correspondeBusca =
                !termo ||
                [cliente.nome, cliente.email].some((campo) => campo.toLowerCase().includes(termo));

            const correspondeData =
                !dataSelecionada || cliente.dataCadastro?.slice(0, 10) === dataSelecionada;

            return correspondeBusca && correspondeData;
        });
    }, [clientes, busca, dataFiltro]);

    const alternarStatus = async (id: string) => {
        setClientes((estadoAtual) =>
            estadoAtual.map((cliente) =>
                cliente.id === id ? { ...cliente, ativo: !cliente.ativo } : cliente
            )
        );

        if (usarMocks) return;

        const clienteAtual = clientes.find((cliente) => cliente.id === id);
        if (!clienteAtual) return;

        try {
            await clienteService.atualizar(id, { ativo: !clienteAtual.ativo });
        } catch (erro) {
            setClientes((estadoAtual) =>
                estadoAtual.map((cliente) =>
                    cliente.id === id ? { ...cliente, ativo: clienteAtual.ativo } : cliente
                )
            );
        }
    };

    return (
        <AdminLayout titulo="Clientes" subtitulo="Overview de todos os clientes">
            <div className="admin-card">
                <section className="admin-filter">
                    <div className="admin-inputs">
                        <CampoBusca
                            placeholder="Filtre por nome"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            larguraMaxima="400px"
                        />
                        <CampoData
                            placeholder="Selecione"
                            type="date"
                            value={dataFiltro}
                            onChange={(e) => setDataFiltro(e.target.value)}
                        />
                    </div>
                </section>

                <section
                    className={`admin-table-container ${
                        clientesFiltrados.length === 0 ? 'admin-empty-container' : ''
                    }`}
                >
                    {clientesFiltrados.length === 0 ? (
                        <EstadoVazio mensagem="Nada por aqui ainda..." />
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Data de cadastro ↓↑</th>
                                    <th>Nome</th>
                                    <th>Endereço</th>
                                    <th>Permissões</th>
                                    <th className="admin-text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientesFiltrados.map((cliente) => {
                                    const endereco = formatarEndereco(cliente.endereco);

                                    return (
                                        <tr key={cliente.id} className="admin-row-white">
                                            <td>{formatarData(cliente.dataCadastro)}</td>
                                            <td>
                                                <div className="admin-client-info">
                                                    <span className="admin-client-name">{cliente.nome}</span>
                                                    <span className="admin-client-role">Cliente</span>
                                                </div>
                                            </td>
                                            <td className="admin-address">
                                                {endereco.linha1}
                                                <br />
                                                {endereco.linha2}
                                            </td>
                                            <td>
                                                <div className="admin-permissions">
                                                    {cliente.permissoes.map((permissao) => (
                                                        <span
                                                            key={permissao}
                                                            className={`admin-permission-badge ${
                                                                permissao === 'agendamentos'
                                                                    ? 'admin-permission-badge--filled'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {permissao === 'agendamentos' ? 'Agendamentos' : 'Logs'}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="admin-text-center">
                                                <label className="admin-toggle">
                                                    <input
                                                        type="checkbox"
                                                        checked={cliente.ativo}
                                                        onChange={() => alternarStatus(cliente.id)}
                                                    />
                                                    <span className="admin-toggle-slider"></span>
                                                </label>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </section>

                <div className="admin-pagination">
                    <button className="admin-page-btn" type="button" aria-label="Anterior">
                        ‹
                    </button>
                    <button className="admin-page-btn admin-page-btn--active" type="button" aria-current="page">
                        1
                    </button>
                    <button className="admin-page-btn" type="button" aria-label="Próximo">
                        ›
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
