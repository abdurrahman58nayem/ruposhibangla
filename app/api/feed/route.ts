import { NextResponse } from 'next/server'
import { buildFeedPage } from '@/lib/feed'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const params = {
    category: (url.searchParams.get('category') as any) || undefined,
    kind: (url.searchParams.get('kind') as any) || undefined,
    speciesSlug: url.searchParams.get('species') || undefined,
    authorId: url.searchParams.get('author') || undefined,
    q: url.searchParams.get('q') || undefined,
    cursor: url.searchParams.get('cursor') || null,
    limit: Math.min(Number(url.searchParams.get('limit') || 12), 24),
    withSpecies: url.searchParams.get('speciesMix') !== '0',
  }
  try {
    const data = await buildFeedPage(params)
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ items: [], nextCursor: null, error: 'feed failed' }, { status: 200 })
  }
}
