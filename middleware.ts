import { NextResponse, type NextRequest } from 'next/server'

const GUEST_COOKIE = 'pb_guest'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  if (!req.cookies.get(GUEST_COOKIE)) {
    const value = 'g-' + crypto.randomUUID().replace(/-/g, '').slice(0, 24)
    res.cookies.set(GUEST_COOKIE, value, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 * 2,
    })
  }
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads|seed|brand|robots.txt|sitemap.xml).*)'],
}
