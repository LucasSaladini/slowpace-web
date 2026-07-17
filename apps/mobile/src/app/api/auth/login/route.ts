import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    console.log("\n🚀 [BFF] Requisição recebida no Next.js API Route!");
    try {
        const body = await request.json();

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/login`;
        console.log(`🌍 [BFF] Chamando a API do Fastify em: ${apiUrl}`);

        // 1. Faz a chamada para a Render
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        console.log(`📡 [BFF] Resposta do Fastify. Status: ${response.status}`);

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
            console.log("🍪 [BFF] Cookie detetado nos headers da Render! Repassando para o cliente...");

            nextResponse.headers.append('Set-Cookie', setCookieHeader);
        } else {
            console.warn("⚠️ [BFF] Nenhum cabeçalho Set-Cookie foi enviado pela Render.");

            const token = data.token || data.data?.token;
            if (token && typeof token === 'string') {
                console.log("🔑 [BFF] Token encontrado no body JSON como fallback.");
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
        console.error("💥 [BFF] ERRO:", error.message);
        return NextResponse.json(
            { message: 'Erro interno no Next.js BFF', error: error.message },
            { status: 500 }
        );
    }
}