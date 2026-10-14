import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { hashPassword, createSessionToken, SESSION_COOKIE } from '@/lib/auth'
import { slugify, uid } from '@/lib/utils'
import type { UserRecord } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    name?: string
    username?: string
    password?: string
    email?: string
    bio?: string
    location?: string
  } | null

  const name = String(body?.name || '').trim()
  const username = slugify(String(body?.username || name))
  const password = String(body?.password || '')

  if (name.length < 2) return NextResponse.json({ error: 'নাম দিন' }, { status: 400 })
  if (username.length < 3) return NextResponse.json({ error: 'ব্যবহারনাম কমপক্ষে ৩ অক্ষরের হতে হবে' }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }, { status: 400 })

  const repo = getRepo()
  if (await repo.getUserByUsername(username)) {
    return NextResponse.json({ error: 'এই ব্যবহারনাম আগেই নেওয়া হয়েছে' }, { status: 409 })
  }

  const isFirst = (await repo.listUsers()).filter((u) => u.role === 'admin').length === 0

  const user: UserRecord = {
    id: uid('user'),
    username,
    name,
    passwordHash: hashPassword(password),
    email: String(body?.email || '').slice(0, 120),
    role: isFirst ? 'admin' : 'user',
    verified: false,
    avatar: '',
    bio: String(body?.bio || '').slice(0, 400),
    location: String(body?.location || '').slice(0, 80),
    followers: 0,
    following: 0,
    createdAt: new Date().toISOString(),
  }
  await repo.createUser(user)

  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, username: user.username, name: user.name, role: user.role, verified: user.verified },
  })
  res.cookies.set(SESSION_COOKIE, createSessionToken({ id: user.id, username, name, role: user.role }), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  })
  return res
}
