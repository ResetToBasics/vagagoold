/**
 * @fileoverview Tipos e interfaces relacionados a agendamentos
 * @description Define as estruturas de dados para o módulo de agendamentos do sistema
 */

/**
 * Status possíveis de um agendamento
 */
export type StatusAgendamento = 'pendente' | 'agendado' | 'cancelado' | 'concluido';

/**
 * Interface que representa um agendamento no sistema
 */
export interface Agendamento {
    /** Identificador único do agendamento */
    id: string;
    /** Data e hora do agendamento */
    dataHora: string;
    /** ID do cliente que fez o agendamento */
    clienteId: string;
    /** Nome do cliente */
    clienteNome: string;
    /** Sala onde será realizado o agendamento */
    salaId: string;
    /** Nome da sala */
    salaNome: string;
    /** Status atual do agendamento */
    status: StatusAgendamento;
    /** Data de criação do registro */
    criadoEm: string;
    /** Data da última atualização */
    atualizadoEm: string;
}

/**
 * Interface para criação de um novo agendamento
 */
export interface CriarAgendamentoDTO {
    dataHora: string;
    clienteId: string;
    salaId: string;
}

/**
 * Interface para atualização de um agendamento
 */
export interface AtualizarAgendamentoDTO {
    dataHora?: string;
    salaId?: string;
    status?: StatusAgendamento;
}

/**
 * Interface para configuração de sala de agendamento
 */
export interface SalaAgendamento {
    /** Identificador único da sala */
    id: string;
    /** Nome da sala */
    nome: string;
    /** Horário de início de funcionamento (formato HH:mm) */
    horarioInicio: string;
    /** Horário de fim de funcionamento (formato HH:mm) */
    horarioFim: string;
    /** Duração do bloco de agendamento em minutos */
    duracaoBloco: number;
    /** Se a sala está ativa */
    ativa: boolean;
}

/**
 * Interface para criação de uma nova sala de agendamento
 */
export interface CriarSalaAgendamentoDTO {
    nome: string;
    horarioInicio: string;
    horarioFim: string;
    duracaoBloco: number;
    ativa?: boolean;
}
