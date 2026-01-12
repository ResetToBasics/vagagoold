/**
 * @fileoverview Funções utilitárias para formatação de dados
 * @description Helpers para formatação de datas, textos e valores
 */

/**
 * Formata uma data para o padrão brasileiro (DD/MM/YYYY às HH:mm)
 * 
 * @param data - Data a ser formatada (Date ou string ISO)
 * @returns String formatada no padrão brasileiro
 * 
 * @example
 * ```ts
 * formatarDataHora(new Date()) // "08/01/2026 às 17:30"
 * ```
 */
export function formatarDataHora(data: Date | string): string {
    const dataObj = typeof data === 'string' ? new Date(data) : data;

    // Usa componentes em UTC para evitar deslocamento quando o backend retorna ISO com "Z"
    const dia = dataObj.getUTCDate().toString().padStart(2, '0');
    const mes = (dataObj.getUTCMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getUTCFullYear();
    const hora = dataObj.getUTCHours().toString().padStart(2, '0');
    const minuto = dataObj.getUTCMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
}

/**
 * Formata apenas a data para o padrão brasileiro (DD/MM/YYYY)
 * 
 * @param data - Data a ser formatada
 * @returns String formatada
 */
export function formatarData(data: Date | string): string {
    const dataObj = typeof data === 'string' ? new Date(data) : data;

    const dia = dataObj.getUTCDate().toString().padStart(2, '0');
    const mes = (dataObj.getUTCMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getUTCFullYear();

    return `${dia}/${mes}/${ano}`;
}

/**
 * Formata um endereço completo em duas linhas
 * 
 * @param endereco - Objeto com dados do endereço
 * @returns Objeto com linha1 e linha2 do endereço
 */
export function formatarEndereco(endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
}): { linha1: string; linha2: string } {
    return {
        linha1: `${endereco.logradouro} n°${endereco.numero}, ${endereco.bairro}`,
        linha2: `${endereco.cidade} - ${endereco.estado}`,
    };
}

/**
 * Capitaliza a primeira letra de cada palavra
 * 
 * @param texto - Texto a ser formatado
 * @returns Texto com iniciais maiúsculas
 */
export function capitalizarPalavras(texto: string): string {
    return texto
        .toLowerCase()
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
}
