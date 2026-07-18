import { NextResponse } from 'next/server';

async function handleRequest(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    try {
        const resolvedParams = await params;
        const apiPath = resolvedParams.path.join('/');

        const searchParams = new URL(request.url).search;
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://slowpace-api-tunnel.loca.lt'}/api/${apiPath}${searchParams}`;

        const token = request.headers.get('cookie');

        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('bypass-tunnel-reminder', 'true');
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
        let data: any = null;

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