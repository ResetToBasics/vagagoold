/**
 * @fileoverview Tipos e interfaces relacionados a logs do sistema
 * @description Define as estruturas de dados para o módulo de logs/auditoria
 */

/**
 * Tipos de atividade que podem ser registradas
 */
export type TipoAtividade =
    | 'login'
    | 'logout'
    | 'criacao_agendamento'
    | 'cancelamento_agendamento'
    | 'atualizacao_email'
    | 'atualizacao_perfil'
    | 'alteracao_senha';

/**
 * Módulos do sistema que podem gerar logs
 */
export type ModuloSistema = 'agendamento' | 'minha_conta' | 'autenticacao';

/**
 * Interface que representa um registro de log no sistema
 */
export interface LogSistema {
    /** Identificador único do log */
    id: string;
    /** ID do cliente que realizou a ação */
    clienteId: string;
    /** Nome do cliente */
    clienteNome: string;
    /** Tipo de atividade realizada */
    tipoAtividade: TipoAtividade;
    /** Módulo onde a ação foi realizada */
    modulo: ModuloSistema;
    /** Descrição detalhada da ação (opcional) */
    descricao?: string;
    /** Endereço IP de origem */
    ipOrigem?: string;
    /** User Agent do navegador */
    userAgent?: string;
    /** Data e hora do registro */
    dataHora: string;
}

/**
 * Interface para filtros de busca de logs
 */
export interface FiltroLog {
    /** Filtrar por cliente específico */
    clienteId?: string;
    /** Filtrar por tipo de atividade */
    tipoAtividade?: TipoAtividade;
    /** Filtrar por módulo */
    modulo?: ModuloSistema;
    /** Data inicial do período */
    dataInicio?: string;
    /** Data final do período */
    dataFim?: string;
    /** Número da página para paginação */
    pagina?: number;
    /** Quantidade de itens por página */
    itensPorPagina?: number;
}

/**
 * Mapeamento de tipos de atividade para labels amigáveis
 */
export const LABELS_TIPO_ATIVIDADE: Record<TipoAtividade, string> = {
    login: 'Login',
    logout: 'Logout',
    criacao_agendamento: 'Criação de agendamento',
    cancelamento_agendamento: 'Cancelamento de agendamento',
    atualizacao_email: 'Atualização de e-mail',
    atualizacao_perfil: 'Atualização de perfil',
    alteracao_senha: 'Alteração de senha',
};

/**
 * Mapeamento de módulos para labels amigáveis
 */
export const LABELS_MODULO: Record<ModuloSistema, string> = {
    agendamento: 'Agendamento',
    minha_conta: 'Minha Conta',
    autenticacao: 'Autenticação',
};
