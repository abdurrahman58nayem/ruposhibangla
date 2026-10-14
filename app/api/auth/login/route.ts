import { NextResponse } from 'next/server'
import { getReadyRepo } from '@/lib/repo'
import { verifyPassword, createSessionToken, SESSION_COOKIE } from '@/lib/auth'
import { guard as rateGuard, tooManyRequests, RULES } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const _rl = rateGuard(req, RULES.auth, 'login')
  if (!_rl.ok) return tooManyRequests(_rl)

  const body = (await req.json().catch(() => null)) as { username?: string; password?: string } | null
  const username = String(body?.username || '').trim()
  const password = String(body?.password || '')
  if (!username || !password) return NextResponse.json({ error: 'ব্যবহারনাম ও পাসওয়ার্ড দিন' }, { status: 400 })

  const repo = await getReadyRepo()

  // ব্যবহারনাম বা ইমেইল — দুটোতেই লগইন করা যায়
  let user = await repo.getUserByUsername(username)
  if (!user && username.includes('@')) {
    const email = username.toLowerCase()
    user = (await repo.listUsers()).find((u) => (u.email || '').toLowerCase() === email) || null
  }
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: 'ব্যবহারনাম/ইমেইল বা পাসওয়ার্ড সঠিক নয়' }, { status: 401 })
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
