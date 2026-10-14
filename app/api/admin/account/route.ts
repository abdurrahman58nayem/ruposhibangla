import { NextResponse } from 'next/server'
import { getSession, verifyPassword, hashPassword } from '@/lib/auth'
import { getReadyRepo } from '@/lib/repo'
import { guard as rateGuard, tooManyRequests, RULES } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/** বর্তমান অ্যাকাউন্টের তথ্য (পাসওয়ার্ড ছাড়া) */
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const repo = await getReadyRepo()
  const user = await repo.getUserById(session.id)
  if (!user) return NextResponse.json({ error: 'অ্যাকাউন্ট পাওয়া যায়নি' }, { status: 404 })
  return NextResponse.json({
    ok: true,
    user: { id: user.id, username: user.username, name: user.name, email: user.email || '', role: user.role },
  })
}

/**
 * অ্যাকাউন্ট হালনাগাদ — নাম, ইমেইল ও পাসওয়ার্ড।
 * পাসওয়ার্ড বদলাতে বর্তমান পাসওয়ার্ড দিতে হবে (সেশান হাইজ্যাক হলে রক্ষা)।
 */
export async function PUT(req: Request) {
  const _rl = rateGuard(req, RULES.auth, 'account')
  if (!_rl.ok) return tooManyRequests(_rl)

  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await req.json().catch(() => null)) as {
    currentPassword?: string
    newPassword?: string
    email?: string
    name?: string
  } | null
  if (!body) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  const repo = await getReadyRepo()
  const user = await repo.getUserById(session.id)
  if (!user) return NextResponse.json({ error: 'অ্যাকাউন্ট পাওয়া যায়নি' }, { status: 404 })

  const patch: { email?: string; name?: string; passwordHash?: string } = {}

  if (typeof body.name === 'string' && body.name.trim().length >= 2) patch.name = body.name.trim().slice(0, 60)

  if (typeof body.email === 'string') {
    const email = body.email.trim()
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'ইমেইল ঠিকানা সঠিক নয়' }, { status: 400 })
    }
    if (email && email !== (user.email || '')) {
      const emailLc = email.toLowerCase()
      const clash = (await repo.listUsers()).some((u) => u.id !== user.id && (u.email || '').toLowerCase() === emailLc)
      if (clash) return NextResponse.json({ error: 'এই ইমেইলে আগেই অ্যাকাউন্ট আছে' }, { status: 409 })
      patch.email = email
    }
  }

  if (body.newPassword) {
    if (!body.currentPassword || !verifyPassword(body.currentPassword, user.passwordHash)) {
      return NextResponse.json({ error: 'বর্তমান পাসওয়ার্ড সঠিক নয়' }, { status: 401 })
    }
    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: 'নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে' }, { status: 400 })
    }
    patch.passwordHash = hashPassword(body.newPassword)
  }

  if (!Object.keys(patch).length) return NextResponse.json({ ok: true, message: 'কিছু বদলানো হয়নি' })

  const updated = await repo.updateUser(user.id, patch)
  await repo.addAudit?.({
    id: `aud-${Date.now()}`,
    actorId: session.id,
    actorName: session.name,
    action: 'account.update',
    target: user.id,
    detail: `বদলানো হয়েছে: ${Object.keys(patch).join(', ')}`,
    createdAt: new Date().toISOString(),
  })

  return NextResponse.json({
    ok: true,
    message: patch.passwordHash ? 'সংরক্ষিত হয়েছে — নতুন পাসওয়ার্ড দিয়ে পরের বার লগইন করবেন।' : 'সংরক্ষিত হয়েছে।',
    user: updated
      ? { id: updated.id, username: updated.username, name: updated.name, email: updated.email || '', role: updated.role }
      : null,
  })
}
