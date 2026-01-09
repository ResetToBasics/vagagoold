/**
 * @fileoverview Tipos e interfaces relacionados a clientes
 * @description Define as estruturas de dados para o módulo de clientes do sistema
 */

/**
 * Permissões disponíveis para um cliente
 */
export type PermissaoCliente = 'agendamentos' | 'logs';

/**
 * Interface que representa um cliente no sistema
 */
export interface Cliente {
    /** Identificador único do cliente */
    id: string;
    /** Nome completo do cliente */
    nome: string;
    /** Email do cliente */
    email: string;
    /** Endereço completo */
    endereco: EnderecoCliente;
    /** Lista de permissões do cliente */
    permissoes: PermissaoCliente[];
    /** Se o cliente está ativo no sistema */
    ativo: boolean;
    /** Data de cadastro */
    dataCadastro: string;
    /** Data da última atualização */
    atualizadoEm: string;
}

/**
 * Interface para o endereço do cliente
 */
export interface EnderecoCliente {
    /** Logradouro (rua, avenida, etc.) */
    logradouro: string;
    /** Número */
    numero: string;
    /** Complemento (opcional) */
    complemento?: string;
    /** Bairro */
    bairro: string;
    /** Cidade */
    cidade: string;
    /** Estado (UF) */
    estado: string;
    /** CEP */
    cep: string;
}

/**
 * Interface para criação de um novo cliente
 */
export interface CriarClienteDTO {
    nome: string;
    email: string;
    senha: string;
    endereco: EnderecoCliente;
}

/**
 * Interface para atualização de um cliente
 */
export interface AtualizarClienteDTO {
    nome?: string;
    email?: string;
    endereco?: Partial<EnderecoCliente>;
    permissoes?: PermissaoCliente[];
    ativo?: boolean;
}
