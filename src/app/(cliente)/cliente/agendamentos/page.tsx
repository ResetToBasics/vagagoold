'use client';

import { useEffect, useMemo, useState } from 'react';
import { ClienteLayout, Modal } from '@/components/layout';
import { CampoBusca, CampoData, CampoTexto, Select } from '@/components/forms';
import { useModal } from '@/hooks';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { IconeCalendario, IconeRelogio, IconeSetaBaixo } from '@/components/ui/Icones';
import { agendamentoService } from '@/services';
import { AGENDAMENTOS_MOCK, SALAS_MOCK } from '@/mocks';
import { authStorage, formatarDataHora } from '@/utils';
import type { Agendamento, SalaAgendamento, StatusAgendamento } from '@/types';

const usarMocks = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false';

const STATUS_LABELS: Record<StatusAgendamento, string> = {
    pendente: 'Em análise',
    agendado: 'Agendado',
    cancelado: 'Cancelado',
    concluido: 'Concluído',
};

const STATUS_ESTILOS: Record<StatusAgendamento, { badge: string; linha: string }> = {
    pendente: { badge: 'admin-badge-gray', linha: 'admin-row-white' },
    agendado: { badge: 'admin-badge-cyan', linha: 'admin-row-blue' },
    cancelado: { badge: 'admin-badge-red', linha: 'admin-row-pink' },
    concluido: { badge: 'admin-badge-gray', linha: 'admin-row-white' },
};

const IconeX = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <rect width="30" height="30" rx="15" fill="black" />
        <path
            d="M15.6462 15.0002L19.8872 9.81667C20.0622 9.60317 20.0302 9.28817 19.8162 9.11317C19.6022 8.93917 19.2877 8.96967 19.1127 9.18417L15.0002 14.2107L10.8872 9.18367C10.7117 8.96917 10.3972 8.93867 10.1837 9.11267C9.96972 9.28817 9.93822 9.60267 10.1127 9.81617L14.3542 15.0002L10.1132 20.1837C9.93822 20.3972 9.97022 20.7122 10.1842 20.8872C10.3967 21.0612 10.7122 21.0312 10.8877 20.8162L15.0002 15.7897L19.1132 20.8162C19.2887 21.0312 19.6042 21.0607 19.8167 20.8872C20.0307 20.7117 20.0622 20.3972 19.8877 20.1837L15.6462 15.0002Z"
            fill="white"
        />
    </svg>
);

export default function AgendamentosClientePage() {
    const modal = useModal();
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [salas, setSalas] = useState<SalaAgendamento[]>([]);
    const [busca, setBusca] = useState('');
    const [dataFiltro, setDataFiltro] = useState('');
    const [novoAgendamento, setNovoAgendamento] = useState({
        data: '',
        horario: '',
        salaId: '',
    });

    useEffect(() => {
        let ativo = true;

        const carregarDados = async () => {
            if (usarMocks) {
                if (!ativo) return;
                setAgendamentos(AGENDAMENTOS_MOCK);
                setSalas(SALAS_MOCK);
                return;
            }

            try {
                const [agendamentosResp, salasResp] = await Promise.all([
                    agendamentoService.listar(),
                    agendamentoService.listarSalas(),
                ]);

                if (!ativo) return;
                setAgendamentos(agendamentosResp.dados);
                setSalas(salasResp.dados);
            } catch (erro) {
                if (!ativo) return;
                setAgendamentos(AGENDAMENTOS_MOCK);
                setSalas(SALAS_MOCK);
            }
        };

        carregarDados();

        return () => {
            ativo = false;
        };
    }, []);

    const agendamentosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        const dataSelecionada = dataFiltro.trim();

        if (!termo && !dataSelecionada) return agendamentos;

        return agendamentos.filter((item) => {
            const correspondeBusca = !termo || item.clienteNome.toLowerCase().includes(termo);
            const correspondeData =
                !dataSelecionada || item.dataHora?.slice(0, 10) === dataSelecionada;
            return correspondeBusca && correspondeData;
        });
    }, [agendamentos, busca, dataFiltro]);

    const handleConfirmarAgendamento = async () => {
        if (!novoAgendamento.data || !novoAgendamento.horario || !novoAgendamento.salaId) {
            return;
        }

        modal.fechar();

        const dataHora = `${novoAgendamento.data}T${novoAgendamento.horario}:00`;
        const salaId = novoAgendamento.salaId;
        const salaSelecionada = salas.find((sala) => sala.id === salaId);
        const usuario = authStorage.obterUsuario();
        const clienteId = usuario?.id;
        const clienteNome = usuario?.nome ?? 'Cliente';

        setNovoAgendamento({ data: '', horario: '', salaId: '' });

        if (usarMocks) {
            setAgendamentos((estadoAtual) => [
                {
                    id: `ag-${Date.now()}`,
                    dataHora,
                    clienteId: clienteId ?? 'cli-001',
                    clienteNome,
                    salaId,
                    salaNome: salaSelecionada?.nome || 'Sala 012',
                    status: 'pendente',
                    criadoEm: new Date().toISOString(),
                    atualizadoEm: new Date().toISOString(),
                },
                ...estadoAtual,
            ]);
            return;
        }

        if (!clienteId) {
            return;
        }

        await agendamentoService.criar({
            dataHora,
            clienteId,
            salaId,
        });
    };

    const renderizarStatus = (status: StatusAgendamento) => (
        <span className={`admin-badge ${STATUS_ESTILOS[status].badge}`}>{STATUS_LABELS[status]}</span>
    );

    const renderizarAcao = (status: StatusAgendamento) => {
        if (status === 'cancelado') return null;

        return (
            <button
                className="admin-action-btn"
                type="button"
                aria-label="Cancelar agendamento"
                title="Cancelar"
            >
                <IconeX />
            </button>
        );
    };

    return (
        <ClienteLayout
            titulo="Agendamento"
            subtitulo="Acompanhe todos os seus agendamentos de forma simples"
        >
            <div className="admin-card">
                <section className="admin-filter">
                    <div className="admin-inputs">
                        <CampoBusca
                            placeholder="Filtre por nome do parceiro, CPF / CNPJ ou E-mail"
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
                    <button className="admin-btn-black" type="button" onClick={modal.abrir}>
                        Novo Agendamento
                    </button>
                </section>

                <section
                    className={`admin-table-container ${
                        agendamentosFiltrados.length === 0 ? 'admin-empty-container' : ''
                    }`}
                >
                    {agendamentosFiltrados.length === 0 ? (
                        <EstadoVazio mensagem="Nada por aqui ainda..." />
                    ) : (
                        <table className="admin-table admin-table--agendamentos">
                            <thead>
                                <tr>
                                    <th>Data agendamento ↓</th>
                                    <th>Nome</th>
                                    <th className="admin-text-center">Sala de agendamento</th>
                                    <th className="admin-text-center">Status transação</th>
                                    <th className="admin-text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agendamentosFiltrados.map((agendamento) => (
                                    <tr
                                        key={agendamento.id}
                                        className={STATUS_ESTILOS[agendamento.status].linha}
                                    >
                                        <td>{formatarDataHora(agendamento.dataHora)}</td>
                                        <td>
                                            <div className="admin-client-info">
                                                <span className="admin-client-name">{agendamento.clienteNome}</span>
                                                <span className="admin-client-role">Cliente</span>
                                            </div>
                                        </td>
                                        <td className="admin-text-center">
                                            <span className="admin-room-badge">{agendamento.salaNome}</span>
                                        </td>
                                        <td className="admin-text-center">
                                            {renderizarStatus(agendamento.status)}
                                        </td>
                                        <td className="admin-text-right">
                                            <div className="admin-actions">
                                                {renderizarAcao(agendamento.status)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
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

            <Modal
                aberto={modal.aberto}
                onFechar={modal.fechar}
                titulo="Novo Agendamento"
                rodape={
                    <button
                        className="modal-btn-save"
                        type="button"
                        onClick={handleConfirmarAgendamento}
                    >
                        Confirmar Agendamento
                    </button>
                }
            >
                <CampoTexto
                    label={
                        <>
                            Selecione uma <strong>data</strong> <span className="modal-label-hint">(Obrigatório)</span>
                        </>
                    }
                    placeholder="Selecione uma data"
                    value={novoAgendamento.data}
                    onChange={(e) =>
                        setNovoAgendamento((estadoAtual) => ({
                            ...estadoAtual,
                            data: e.target.value,
                        }))
                    }
                    icone={<IconeCalendario largura={18} altura={18} />}
                />
                <CampoTexto
                    label={
                        <>
                            Selecione um <strong>horário</strong>{' '}
                            <span className="modal-label-hint">(Obrigatório)</span>
                        </>
                    }
                    placeholder="Selecione um horário"
                    value={novoAgendamento.horario}
                    onChange={(e) =>
                        setNovoAgendamento((estadoAtual) => ({
                            ...estadoAtual,
                            horario: e.target.value,
                        }))
                    }
                    icone={<IconeRelogio largura={18} altura={18} />}
                />
                <div className="modal-field">
                    <label className="modal-label">
                        Selecione uma <strong>Sala</strong>{' '}
                        <span className="modal-label-hint">(Obrigatório)</span>
                    </label>
                    <div className="modal-select-wrapper">
                        <select
                            className="modal-select"
                            value={novoAgendamento.salaId}
                            onChange={(e) =>
                                setNovoAgendamento((estadoAtual) => ({
                                    ...estadoAtual,
                                    salaId: e.target.value,
                                }))
                            }
                        >
                            <option value="">Selecione uma sala</option>
                            {salas.map((sala) => (
                                <option key={sala.id} value={sala.id}>
                                    {sala.nome}
                                </option>
                            ))}
                        </select>
                        <IconeSetaBaixo largura={18} altura={18} className="modal-select-icon" />
                    </div>
                </div>
            </Modal>
        </ClienteLayout>
    );
}
