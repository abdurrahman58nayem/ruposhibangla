import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getGuestKey, getSession } from '@/lib/auth'
import { uid } from '@/lib/utils'
import type { SavedItem } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  const key = session ? `u:${session.id}` : `g:${await getGuestKey()}`
  const items = (await getRepo().listSaves?.(key)) || []
  return NextResponse.json({ items })
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { targetType?: string; targetId?: string } | null
  if (!body?.targetType || !body?.targetId) {
    return NextResponse.json({ error: 'কী সংরক্ষণ করবেন তা দিন' }, { status: 400 })
  }
  const session = await getSession()
  const key = session ? `u:${session.id}` : `g:${await getGuestKey()}`
  const item: SavedItem = {
    id: uid('sv'),
    userKey: key,
    targetType: body.targetType as SavedItem['targetType'],
    targetId: String(body.targetId),
    createdAt: new Date().toISOString(),
  }
  const saved = await getRepo().toggleSave?.(item)
  return NextResponse.json({ saved: !!saved })
}
