import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://slowpace-api-tunnel.loca.lt'}/auth/login`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'bypass-tunnel-reminder': 'true',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': `${process.env.NEXT_PUBLIC_API_URL || 'https://slowpace.duckdns.org'}/`
            },
            body: JSON.stringify(body),
        });

        const contentType = response.headers.get('content-type');
        let data: any = {};

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const textError = await response.text();
            return NextResponse.json(
                { message: `Resposta inesperada: ${textError.substring(0, 100)}` },
                { status: response.status }
            );
        }

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Erro ao autenticar' },
                { status: response.status }
            );
        }

        const nextResponse = NextResponse.json({ user: data.user }, { status: 200 });

        const token = data.token || data.data?.token;
        if (token && typeof token === 'string') {
            nextResponse.cookies.set({
                name: 'slowpace.token',
                value: token,
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                maxAge: 30 * 24 * 60 * 60,
            });
        }

        return nextResponse;

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Erro interno no BFF', error: error.message },
            { status: 500 }
        );
    }
}