import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession, hashPassword } from '@/lib/auth'
import type { UserRecord } from '@/lib/types'

export const dynamic = 'force-dynamic'

/** নিজের প্রোফাইল হালনাগাদ — নাম, পরিচিতি, ছবি, কভার, ইউজারনেম, পাসওয়ার্ড */
export async function PATCH(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 })
  const body = (await req.json().catch(() => null)) as (Partial<UserRecord> & { password?: string }) | null
  if (!body) return NextResponse.json({ error: 'তথ্য নেই' }, { status: 400 })

  const repo = getRepo()
  const patch: Partial<UserRecord> = {}
  if (body.name) patch.name = String(body.name).slice(0, 60)
  if (body.bio !== undefined) patch.bio = String(body.bio).slice(0, 300)
  if (body.avatar !== undefined) patch.avatar = String(body.avatar).slice(0, 500)
  if (body.cover !== undefined) patch.cover = String(body.cover).slice(0, 500)
  if (body.location !== undefined) patch.location = String(body.location).slice(0, 80)

  if (body.username) {
    const wanted = String(body.username).toLowerCase().replace(/[^a-z0-9_]/g, '')
    if (wanted.length < 3) return NextResponse.json({ error: 'ইউজারনেম অন্তত ৩ অক্ষরের হতে হবে' }, { status: 400 })
    const existing = await repo.getUserByUsername(wanted)
    if (existing && existing.id !== session.id) {
      return NextResponse.json({ error: 'এই ইউজারনেম আগেই নেওয়া' }, { status: 400 })
    }
    patch.username = wanted
  }
  if (body.password && String(body.password).length >= 6) patch.passwordHash = hashPassword(String(body.password))
  if (body.deletionRequested) patch.deletionRequested = true

  const updated = await repo.updateUser(session.id, patch)
  if (!updated) return NextResponse.json({ error: 'হালনাগাদ করা যায়নি' }, { status: 400 })
  const { passwordHash: _p, ...rest } = updated
  return NextResponse.json({ ok: true, user: rest })
}
