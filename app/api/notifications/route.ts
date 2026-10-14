import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getGuestKey, getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/** ব্যবহারকারী বা অতিথির নোটিফিকেশন */
export async function GET() {
  const session = await getSession()
  const key = session ? `u:${session.id}` : `g:${await getGuestKey()}`
  const repo = getRepo()
  const items = (await repo.listNotifications?.(key)) || []
  return NextResponse.json({ items })
}

/** পঠিত হিসেবে চিহ্নিত */
export async function POST() {
  const session = await getSession()
  const key = session ? `u:${session.id}` : `g:${await getGuestKey()}`
  await getRepo().markNotificationsRead?.(key)
  return NextResponse.json({ ok: true })
}
