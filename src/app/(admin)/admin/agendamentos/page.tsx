'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminLayout, Modal } from '@/components/layout';
import { CampoBusca, CampoData, CampoTexto, Select } from '@/components/forms';
import { useModal } from '@/hooks';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { IconeRelogio } from '@/components/ui/Icones';
import { OPCOES_DURACAO_BLOCO } from '@/constants';
import { agendamentoService } from '@/services';
import { AGENDAMENTOS_MOCK, SALAS_MOCK } from '@/mocks';
import { formatarDataHora } from '@/utils';
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

const IconeCheck = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <rect width="30" height="30" rx="15" fill="black" />
        <path
            d="M22.9682 10.2395L12.5241 20.6836C12.4635 20.7443 12.3915 20.7924 12.3122 20.8253C12.233 20.8581 12.148 20.875 12.0623 20.875C11.9765 20.875 11.8915 20.8581 11.8123 20.8253C11.7331 20.7924 11.6611 20.7443 11.6004 20.6836L7.03114 16.1143C6.90865 15.9918 6.83984 15.8257 6.83984 15.6524C6.83984 15.4792 6.90865 15.3131 7.03114 15.1906C7.15362 15.0681 7.31975 14.9993 7.49296 14.9993C7.66618 14.9993 7.83231 15.0681 7.95479 15.1906L12.0623 19.2989L22.0446 9.31581C22.167 9.19332 22.3332 9.12451 22.5064 9.12451C22.6796 9.12451 22.8457 9.19332 22.9682 9.31581C23.0907 9.43829 23.1595 9.60441 23.1595 9.77763C23.1595 9.95085 23.0907 10.117 22.9682 10.2395Z"
            fill="white"
        />
    </svg>
);

const IconeX = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <rect width="30" height="30" rx="15" fill="black" />
        <path
            d="M15.6462 15.0002L19.8872 9.81667C20.0622 9.60317 20.0302 9.28817 19.8162 9.11317C19.6022 8.93917 19.2877 8.96967 19.1127 9.18417L15.0002 14.2107L10.8872 9.18367C10.7117 8.96917 10.3972 8.93867 10.1837 9.11267C9.96972 9.28817 9.93822 9.60267 10.1127 9.81617L14.3542 15.0002L10.1132 20.1837C9.93822 20.3972 9.97022 20.7122 10.1842 20.8872C10.3967 21.0612 10.7122 21.0312 10.8877 20.8162L15.0002 15.7897L19.1132 20.8162C19.2887 21.0312 19.6042 21.0607 19.8167 20.8872C20.0307 20.7117 20.0622 20.3972 19.8877 20.1837L15.6462 15.0002Z"
            fill="white"
        />
    </svg>
);

export default function AgendamentosPage() {
    const modal = useModal();
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [salas, setSalas] = useState<SalaAgendamento[]>([]);
    const [busca, setBusca] = useState('');
    const [dataFiltro, setDataFiltro] = useState('');
    const [nomeSala, setNomeSala] = useState('');
    const [horarioSala, setHorarioSala] = useState('');
    const [duracaoSala, setDuracaoSala] = useState('30');
    const [salvandoSala, setSalvandoSala] = useState(false);
    const [criandoSala, setCriandoSala] = useState(false);

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

    const salaSelecionada = salas[0];

    useEffect(() => {
        if (!modal.aberto) return;
        if (!salaSelecionada) return;

        setNomeSala(salaSelecionada.nome);
        setHorarioSala(`${salaSelecionada.horarioInicio} - ${salaSelecionada.horarioFim}`);
        setDuracaoSala(String(salaSelecionada.duracaoBloco));
    }, [modal.aberto, salaSelecionada]);

    const atualizarStatus = async (id: string, status: StatusAgendamento) => {
        const statusAnterior = agendamentos.find((item) => item.id === id)?.status;

        setAgendamentos((estadoAtual) =>
            estadoAtual.map((item) => (item.id === id ? { ...item, status } : item))
        );

        if (usarMocks) return;

        try {
            await agendamentoService.atualizar(id, { status });
        } catch (erro) {
            if (!statusAnterior) return;

            setAgendamentos((estadoAtual) =>
                estadoAtual.map((item) =>
                    item.id === id ? { ...item, status: statusAnterior } : item
                )
            );
        }
    };

    const handleSalvarSala = async () => {
        if (!salaSelecionada) {
            modal.fechar();
            return;
        }

        const [inicio, fim] = horarioSala.split('-').map((valor) => valor.trim());
        if (!inicio || !fim) return;

        const payload = {
            nome: nomeSala.trim() || salaSelecionada.nome,
            horarioInicio: inicio,
            horarioFim: fim,
            duracaoBloco: Number(duracaoSala) || salaSelecionada.duracaoBloco,
        };

        setSalvandoSala(true);

        try {
            if (!usarMocks) {
                await agendamentoService.atualizarSala(salaSelecionada.id, payload);
            }

            setSalas((estadoAtual) =>
                estadoAtual.map((sala) => (sala.id === salaSelecionada.id ? { ...sala, ...payload } : sala))
            );

            modal.fechar();
        } catch (erro) {
            console.error('Erro ao atualizar sala:', erro);
        } finally {
            setSalvandoSala(false);
        }
    };

    const handleAdicionarSala = async () => {
        const [inicio, fim] = horarioSala.split('-').map((valor) => valor.trim());
        if (!nomeSala.trim() || !inicio || !fim) return;

        const payload = {
            nome: nomeSala.trim(),
            horarioInicio: inicio,
            horarioFim: fim,
            duracaoBloco: Number(duracaoSala) || 30,
        };

        setCriandoSala(true);

        try {
            let novaSala = {
                id: `sala-${Date.now()}`,
                ativa: true,
                ...payload,
            };

            if (!usarMocks) {
                const resposta = await agendamentoService.criarSala(payload);
                novaSala = resposta.dados;
            }

            setSalas((estadoAtual) => [novaSala, ...estadoAtual]);
        } catch (erro) {
            console.error('Erro ao criar sala:', erro);
        } finally {
            setCriandoSala(false);
        }
    };

    const renderizarAcoes = (agendamento: Agendamento) => {
        if (agendamento.status === 'pendente') {
            return (
                <div className="admin-actions">
                    <button
                        className="admin-action-btn"
                        type="button"
                        aria-label="Rejeitar agendamento"
                        title="Rejeitar"
                        onClick={() => atualizarStatus(agendamento.id, 'cancelado')}
                    >
                        <IconeX />
                    </button>
                    <button
                        className="admin-action-btn"
                        type="button"
                        aria-label="Aprovar agendamento"
                        title="Aprovar"
                        onClick={() => atualizarStatus(agendamento.id, 'agendado')}
                    >
                        <IconeCheck />
                    </button>
                </div>
            );
        }

        if (agendamento.status === 'agendado') {
            return (
                <div className="admin-actions">
                    <button
                        className="admin-action-btn"
                        type="button"
                        aria-label="Cancelar agendamento"
                        title="Cancelar"
                        onClick={() => atualizarStatus(agendamento.id, 'cancelado')}
                    >
                        <IconeX />
                    </button>
                </div>
            );
        }

        return <div className="admin-actions" />;
    };

    return (
        <AdminLayout
            titulo="Agendamentos"
            subtitulo="Acompanhe todos os agendamentos de clientes forma simples"
        >
            <div className="admin-card">
                <section className="admin-filter">
                    <div className="admin-inputs">
                        <CampoBusca
                            placeholder="Filtre por nome"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                        <CampoData
                            placeholder="Selecione"
                            type="date"
                            value={dataFiltro}
                            onChange={(e) => setDataFiltro(e.target.value)}
                        />
                    </div>
                    <button className="admin-btn-black" type="button" onClick={modal.abrir}>
                        Ajustes de agendamento
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
                                    <th>Data agendamento ↓↑</th>
                                    <th>Nome</th>
                                    <th className="admin-text-center">Sala de agendamento</th>
                                    <th className="admin-text-center">Status transação</th>
                                    <th className="admin-text-center">Ação</th>
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
                                            <span className={`admin-badge ${STATUS_ESTILOS[agendamento.status].badge}`}>
                                                {STATUS_LABELS[agendamento.status]}
                                            </span>
                                        </td>
                                        <td className="admin-text-center">
                                            {renderizarAcoes(agendamento)}
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
                titulo="Ajustes de agendamento"
                rodape={
                    <button
                        className="modal-btn-save"
                        type="button"
                        onClick={handleSalvarSala}
                        disabled={salvandoSala}
                    >
                        {salvandoSala ? 'Salvando...' : 'Salvar'}
                    </button>
                }
            >
                <CampoTexto
                    label="Nome da sala"
                    value={nomeSala}
                    onChange={(e) => setNomeSala(e.target.value)}
                />
                <CampoTexto
                    label="Horário Inicial & Final da sala"
                    value={horarioSala}
                    onChange={(e) => setHorarioSala(e.target.value)}
                    icone={<IconeRelogio largura={18} altura={18} />}
                />
                <Select
                    label="Bloco de Horários de agendamento"
                    opcoes={OPCOES_DURACAO_BLOCO.map((opcao) => ({
                        valor: opcao.valor,
                        label: opcao.label,
                    }))}
                    value={duracaoSala}
                    onChange={(e) => setDuracaoSala(e.target.value)}
                />
                <button
                    className="modal-add-room"
                    type="button"
                    onClick={handleAdicionarSala}
                    disabled={criandoSala}
                >
                    {criandoSala ? 'Adicionando...' : '+ Adicionar nova sala'}
                </button>
            </Modal>
        </AdminLayout>
    );
}
