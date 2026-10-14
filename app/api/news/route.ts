import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { slugify, uid } from '@/lib/utils'
import type { News } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const rows = await getRepo().listNews({
    publishedOnly: url.searchParams.get('all') !== '1',
    limit: Math.min(Number(url.searchParams.get('limit') || 50), 200),
  })
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = (await req.json().catch(() => null)) as Partial<News> | null
  if (!body?.title) return NextResponse.json({ error: 'শিরোনাম দিন' }, { status: 400 })
  const news: News = {
    id: body.id || uid('news'),
    slug: body.slug || slugify(body.title),
    title: body.title,
    excerpt: body.excerpt || '',
    body: body.body || '',
    cover: body.cover || '',
    tags: body.tags || [],
    published: body.published !== false,
    pinned: !!body.pinned,
    views: body.views || 0,
    createdAt: body.createdAt || new Date().toISOString(),
  }
  await getRepo().upsertNews(news)
  return NextResponse.json({ ok: true, news })
}
