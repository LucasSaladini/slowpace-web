import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/login`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Erro ao autenticar' },
                { status: response.status }
            );
        }

        const nextResponse = NextResponse.json({ user: data.user }, { status: 200 });

        const setCookieHeader = response.headers.get('set-cookie');

        if (setCookieHeader) {
            nextResponse.headers.append('Set-Cookie', setCookieHeader);
        } else {
            const token = data.token || data.data?.token;
            if (token && typeof token === 'string') {
                const isLocalhost = request.headers.get('host')?.includes('localhost') || false;
                nextResponse.cookies.set({
                    name: 'slowpace.token',
                    value: token,
                    httpOnly: true,
                    secure: !isLocalhost,
                    sameSite: isLocalhost ? 'lax' : 'none',
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60,
                });
            }
        }

        return nextResponse;

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Erro interno no Next.js BFF', error: error.message },
            { status: 500 }
        );
    }
}