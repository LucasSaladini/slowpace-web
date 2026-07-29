import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  let token = request.cookies.get('slowpace.token')?.value

  if (token === 'undefined' || token === 'null' || !token) {
    token = undefined
  } else {
    const parts = token.split('.')
    const isJwtValid = parts.length === 3 && parts[0].length > 0 && parts[1].length > 0 && parts[2].length > 0
    
    if (!isJwtValid) {
      token = undefined
    } else {
      try {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8')
        const payload = JSON.parse(payloadJson)

        if (payload.exp && Date.now() >= payload.exp * 1000) {
          token = undefined
        }
      } catch (e) {
        token = undefined
      } 
    }
  }

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

  const response = NextResponse.next()

  if (!token && (isDashboardPage || isRoot)) {
    const redirectResponse = NextResponse.redirect(new URL('/login', request.url))
    redirectResponse.cookies.delete('slowpace.token')
    return redirectResponse
  }

  if (token && (isLoginPage || isRoot)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|manifest.json|icons/.*|favicon.ico).*)'],
}