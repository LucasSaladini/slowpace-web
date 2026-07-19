import { NextResponse } from 'next/server';

async function handleRequest(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    try {
        const resolvedParams = await params;
        const apiPath = resolvedParams.path.join('/');

        const url = new URL(request.url);
        const searchParams = url.search;

        let cleanApiPath = apiPath;
        if (cleanApiPath.startsWith('v1/')) cleanApiPath = cleanApiPath.replace('v1/', '');

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://slowpace-api-tunnel.loca.lt';
        const apiUrl = `${baseUrl}/${cleanApiPath}${searchParams}`;

        const token = request.headers.get('cookie');

        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('bypass-tunnel-reminder', 'true');
        headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        headers.set('Referer', 'https://slowpace-web.vercel.app/');

        if (token) {
            headers.set('Cookie', token);
        }

        let body: any = undefined;
        if (!['GET', 'HEAD'].includes(request.method)) {
            body = await request.text();
        }

        const response = await fetch(apiUrl, {
            method: request.method,
            headers,
            body,
        });

        const contentType = response.headers.get('content-type');
        let data: any;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        return NextResponse.json(data, { status: response.status });

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Erro ao repassar requisição pelo BFF', error: error.message },
            { status: 500 }
        );
    }
}

export {
    handleRequest as GET,
    handleRequest as POST,
    handleRequest as PUT,
    handleRequest as DELETE,
    handleRequest as PATCH
};