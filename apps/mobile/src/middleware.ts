import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const token = request.cookies.get('slowpace.token')?.value
    const { pathname } = request.nextUrl

    const isLoginPage = pathname === '/login'
    const isRootPage = pathname === '/'
    const isDashboardPage = pathname.startsWith('/dashboard')

    if (!token && (isDashboardPage || isRootPage)) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if (token && (isLoginPage || isRootPage)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/dashboard/:path*', '/login'],
}