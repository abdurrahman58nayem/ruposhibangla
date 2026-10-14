import { NextResponse } from 'next/server'
import { buildFeedPage } from '@/lib/feed'
import { getSession } from '@/lib/auth'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const sort = url.searchParams.get('sort') === 'popular' ? 'popular' : 'new'
  const session = await getSession()

  let followingIds: string[] | undefined
  if (url.searchParams.get('me') === '1') {
    if (!session) return NextResponse.json({ items: [], nextCursor: null, loginRequired: true })
    followingIds = (await getRepo().followingIds?.(session.id)) || []
  }

  const params = {
    category: (url.searchParams.get('category') as any) || undefined,
    kind: (url.searchParams.get('kind') as any) || undefined,
    group: (url.searchParams.get('group') as any) || undefined,
    speciesSlug: url.searchParams.get('species') || undefined,
    authorId: url.searchParams.get('author') || undefined,
    q: url.searchParams.get('q') || undefined,
    cursor: url.searchParams.get('cursor') || null,
    limit: Math.min(Number(url.searchParams.get('limit') || 12), 24),
    withSpecies: url.searchParams.get('speciesMix') !== '0',
    sort: sort as 'new' | 'popular',
    followingIds,
  }
  try {
    const data = await buildFeedPage(params)
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ items: [], nextCursor: null, error: 'feed failed' }, { status: 200 })
  }
}
