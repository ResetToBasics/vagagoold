/**
 * @fileoverview Cliente HTTP para comunicação com a API
 * @description Configuração base do cliente para requisições HTTP
 */

/**
 * URL base da API (será configurada via variável de ambiente)
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Tipo para métodos HTTP suportados
 */
type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Interface para configuração de requisição
 */
interface ConfiguracaoRequisicao {
    /** Corpo da requisição (para POST, PUT, PATCH) */
    corpo?: unknown;
    /** Headers adicionais */
    headers?: Record<string, string>;
    /** Token de autenticação (opcional, usa o armazenado se não fornecido) */
    token?: string;
}

/**
 * Interface para resposta padronizada da API
 */
interface RespostaApi<T> {
    /** Dados retornados pela API */
    dados: T;
    /** Mensagem de sucesso ou erro */
    mensagem?: string;
    /** Se a requisição foi bem sucedida */
    sucesso: boolean;
}

/**
 * Realiza uma requisição HTTP para a API
 * 
 * @param metodo - Método HTTP (GET, POST, etc.)
 * @param endpoint - Endpoint da API (sem a URL base)
 * @param config - Configurações adicionais da requisição
 * @returns Promessa com os dados da resposta
 * 
 * @example
 * ```ts
 * const { dados } = await requisicaoHttp<Cliente[]>('GET', '/clientes');
 * ```
 */
async function requisicaoHttp<T>(
    metodo: MetodoHttp,
    endpoint: string,
    config: ConfiguracaoRequisicao = {}
): Promise<RespostaApi<T>> {
    const { corpo, headers = {}, token } = config;
    const tokenLocal =
        token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined);

    // Monta os headers da requisição
    const headersFinais: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    // Adiciona token de autenticação se disponível
    if (tokenLocal) {
        headersFinais['Authorization'] = `Bearer ${tokenLocal}`;
    }

    try {
        const resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: metodo,
            headers: headersFinais,
            body: corpo ? JSON.stringify(corpo) : undefined,
            credentials: 'include',
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro na requisição');
        }

        return {
            dados,
            sucesso: true,
        };
    } catch (erro) {
        console.error(`Erro na requisição ${metodo} ${endpoint}:`, erro);
        throw erro;
    }
}

/**
 * Cliente HTTP com métodos convenientes para cada verbo
 */
export const clienteHttp = {
    /**
     * Requisição GET
     */
    get: <T>(endpoint: string, config?: ConfiguracaoRequisicao) =>
        requisicaoHttp<T>('GET', endpoint, config),

    /**
     * Requisição POST
     */
    post: <T>(endpoint: string, corpo: unknown, config?: Omit<ConfiguracaoRequisicao, 'corpo'>) =>
        requisicaoHttp<T>('POST', endpoint, { ...config, corpo }),

    /**
     * Requisição PUT
     */
    put: <T>(endpoint: string, corpo: unknown, config?: Omit<ConfiguracaoRequisicao, 'corpo'>) =>
        requisicaoHttp<T>('PUT', endpoint, { ...config, corpo }),

    /**
     * Requisição PATCH
     */
    patch: <T>(endpoint: string, corpo: unknown, config?: Omit<ConfiguracaoRequisicao, 'corpo'>) =>
        requisicaoHttp<T>('PATCH', endpoint, { ...config, corpo }),

    /**
     * Requisição DELETE
     */
    delete: <T>(endpoint: string, config?: ConfiguracaoRequisicao) =>
        requisicaoHttp<T>('DELETE', endpoint, config),
};
