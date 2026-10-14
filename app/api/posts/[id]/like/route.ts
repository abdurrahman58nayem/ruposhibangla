import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getGuestKey, getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const key = (await getSession())?.id || (await getGuestKey())
  const liked = await getRepo().hasLiked(id, key)
  return NextResponse.json({ liked })
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()
  const key = session?.id || (await getGuestKey())
  const res = await getRepo().toggleLike(id, key)
  return NextResponse.json(res)
}
