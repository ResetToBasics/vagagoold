'use client';

import { useEffect, useMemo, useState } from 'react';
import { ClienteLayout } from '@/components/layout';
import { CampoBusca, CampoData } from '@/components/forms';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { IconeCalendario, IconeUsuario } from '@/components/ui/Icones';
import { logService } from '@/services';
import { LABELS_MODULO, LABELS_TIPO_ATIVIDADE, LogSistema } from '@/types';
import { formatarDataHora } from '@/utils';

export default function LogsClientePage() {
    const [logs, setLogs] = useState<LogSistema[]>([]);
    const [busca, setBusca] = useState('');
    const [dataFiltro, setDataFiltro] = useState('');

    useEffect(() => {
        let ativo = true;

        const carregarDados = async () => {
            try {
                const logsResp = await logService.listar();

                if (!ativo) return;
                setLogs(logsResp.dados);
            } catch (erro) {
                if (!ativo) return;
                console.error('Erro ao carregar logs:', erro);
                setLogs([]);
            }
        };

        carregarDados();

        return () => {
            ativo = false;
        };
    }, []);

    const logsFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        const dataSelecionada = dataFiltro.trim();

        if (!termo && !dataSelecionada) return logs;

        return logs.filter((log) => {
            const tipo = LABELS_TIPO_ATIVIDADE[log.tipoAtividade].toLowerCase();
            const modulo = LABELS_MODULO[log.modulo].toLowerCase();
            const correspondeData =
                !dataSelecionada || log.dataHora?.slice(0, 10) === dataSelecionada;

            const correspondeBusca = tipo.includes(termo) || modulo.includes(termo);

            return correspondeBusca && correspondeData;
        });
    }, [logs, busca, dataFiltro]);

    const renderizarModulo = (modulo: LogSistema['modulo']) => {
        if (modulo === 'agendamento') {
            return (
                <span className="log-module-badge">
                    <IconeCalendario largura={14} altura={14} />
                    {LABELS_MODULO[modulo]}
                </span>
            );
        }

        return (
            <span className="log-module-badge">
                <IconeUsuario largura={14} altura={14} />
                {LABELS_MODULO[modulo]}
            </span>
        );
    };

    return (
        <ClienteLayout titulo="Logs" subtitulo="Acompanhe todas as suas logs">
            <div className="admin-card">
                <section className="admin-filter">
                    <div className="admin-inputs">
                        <CampoBusca
                            placeholder="Filtre por tipo de atividade ou módulo"
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
                    className={`admin-table-container ${logsFiltrados.length === 0 ? 'admin-empty-container' : ''}`}
                >
                    {logsFiltrados.length === 0 ? (
                        <EstadoVazio mensagem="Nada por aqui ainda..." />
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Tipo de atividade</th>
                                    <th>Módulo</th>
                                    <th>Data e horário ↓↑</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logsFiltrados.map((log) => (
                                    <tr key={log.id} className="admin-row-white">
                                        <td>
                                            <span className="log-activity-badge">
                                                {LABELS_TIPO_ATIVIDADE[log.tipoAtividade]}
                                            </span>
                                        </td>
                                        <td>{renderizarModulo(log.modulo)}</td>
                                        <td className="log-date">
                                            <span className="log-date-pill">{formatarDataHora(log.dataHora)}</span>
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
        </ClienteLayout>
    );
}
