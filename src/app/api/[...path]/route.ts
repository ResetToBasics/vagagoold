import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const normalizarTarget = (target?: string) => {
    if (!target) return undefined;
    return target.endsWith('/') ? target.slice(0, -1) : target;
};

const montarDestino = (base: string, pathname: string, search: string) => {
    const baseNormalizada = normalizarTarget(base) || '';
    const isApiBase = baseNormalizada.endsWith('/api');
    const caminho = isApiBase && pathname.startsWith('/api') ? pathname.replace(/^\/api/, '') : pathname;
    return `${baseNormalizada}${caminho}${search}`;
};

const handler = async (request: NextRequest) => {
    const target = normalizarTarget(process.env.API_PROXY_TARGET);

    if (!target) {
        return NextResponse.json({ mensagem: 'API_PROXY_TARGET nao configurado' }, { status: 500 });
    }

    const url = montarDestino(target, request.nextUrl.pathname, request.nextUrl.search);
    const headers = new Headers(request.headers);
    headers.delete('host');

    const metodo = request.method.toUpperCase();
    const corpo = metodo === 'GET' || metodo === 'HEAD' ? undefined : await request.arrayBuffer();

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers,
            body: corpo ? Buffer.from(corpo) : undefined,
            redirect: 'manual',
        });

        const buffer = await resposta.arrayBuffer();
        const respostaHeaders = new Headers(resposta.headers);
        respostaHeaders.delete('content-encoding');
        respostaHeaders.delete('content-length');

        return new NextResponse(buffer, {
            status: resposta.status,
            headers: respostaHeaders,
        });
    } catch (erro) {
        console.error('Erro no proxy /api:', erro);
        return NextResponse.json({ mensagem: 'Erro ao conectar com a API' }, { status: 502 });
    }
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
