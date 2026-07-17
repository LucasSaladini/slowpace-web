import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Erro ao autenticar' },
                { status: response.status }
            );
        }

        const token = data.token || data.data?.token || data;

        const nextResponse = NextResponse.json({ user: data.user });

        if (token && typeof token === 'string') {
            nextResponse.cookies.set('slowpace.token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 24 * 60 * 60,
            });
        }

        return nextResponse;
    } catch (error) {
        return NextResponse.json(
            { message: 'Erro interno no servidor proxy do Next.js' },
            { status: 500 }
        );
    }
}