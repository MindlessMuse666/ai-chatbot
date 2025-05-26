import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that don't require authentication
const publicPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    // Всегда пропускаем
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value

  // Redirect to login if accessing protected route without token
  if (!token && !isPublicPath) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect to home if accessing auth pages with token
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
} 