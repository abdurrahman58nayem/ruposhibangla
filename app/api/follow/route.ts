import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getGuestKey, getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('user')
  if (!userId) return NextResponse.json({ following: false })
  const key = (await getSession())?.id || (await getGuestKey())
  return NextResponse.json({ following: await getRepo().isFollowing(key, userId) })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const userId = String(body.userId || '')
  if (!userId) return NextResponse.json({ error: 'user required' }, { status: 400 })
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'ফলো করতে লগইন করুন' }, { status: 401 })
  const following = await getRepo().toggleFollow(session.id, userId)
  return NextResponse.json({ following })
}
