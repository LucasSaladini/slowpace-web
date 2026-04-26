import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('slowpace.token')?.value
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  const isLoginPage = pathname === '/login'
  const isDashboardPage = pathname.startsWith('/dashboard')
  const isRoot = pathname === '/'

  if (!token && (isDashboardPage || isRoot)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && (isLoginPage || isRoot)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}