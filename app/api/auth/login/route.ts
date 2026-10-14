import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { verifyPassword, createSessionToken, SESSION_COOKIE } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { username?: string; password?: string } | null
  const username = String(body?.username || '').trim()
  const password = String(body?.password || '')
  if (!username || !password) return NextResponse.json({ error: 'ব্যবহারনাম ও পাসওয়ার্ড দিন' }, { status: 400 })

  const user = await getRepo().getUserByUsername(username)
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: 'ব্যবহারনাম বা পাসওয়ার্ড সঠিক নয়' }, { status: 401 })
  }

  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, username: user.username, name: user.name, role: user.role, verified: user.verified },
  })
  res.cookies.set(SESSION_COOKIE, createSessionToken({ id: user.id, username: user.username, name: user.name, role: user.role }), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  })
  return res
}
