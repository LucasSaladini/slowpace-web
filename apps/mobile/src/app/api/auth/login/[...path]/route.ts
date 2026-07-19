import { NextResponse } from "next/server";

async function handleRequest(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    try {
        const resolvedParams = await params;
        const apiPath = resolvedParams.path.join('/');

        const url = new URL(request.url);
        const searchParams = url.search;

        // Limpeza de rota
        let cleanApiPath = apiPath.replace(/^(v1\/|api\/)/, '');

        const baseUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:3333'
            : (process.env.NEXT_PUBLIC_API_URL || 'https://slowpace-api-tunnel.loca.lt');

        const apiUrl = `${baseUrl}/${cleanApiPath}${searchParams}`;

        const headers = new Headers();
        // Propaga o token que já está no Cookie do navegador
        const token = request.headers.get('cookie');
        if (token) headers.set('Cookie', token);

        headers.set('Content-Type', 'application/json');
        headers.set('bypass-tunnel-reminder', 'true');

        let body: any = undefined;
        if (!['GET', 'HEAD'].includes(request.method)) {
            body = await request.text();
        }

        const response = await fetch(apiUrl, {
            method: request.method,
            headers,
            body,
        });

        // --- A MÁGICA ESTÁ AQUI: Propagar o Set-Cookie de volta ---
        const contentType = response.headers.get('content-type');
        let data: any = contentType?.includes('application/json') ? await response.json() : await response.text();

        const nextResponse = NextResponse.json(data, { status: response.status });

        // Se a API mandar um novo cookie, repasse para o navegador
        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
            nextResponse.headers.set('Set-Cookie', setCookie);
        }

        return nextResponse;

    } catch (error: any) {
        return NextResponse.json({ message: 'Erro no BFF', error: error.message }, { status: 500 });
    }
}