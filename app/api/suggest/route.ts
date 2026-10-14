import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')?.trim() || ''
  if (q.length < 2) return NextResponse.json({ hits: [] })
  const repo = getRepo()
  const [species, news, posts] = await Promise.all([
    repo.listSpecies({ q, limit: 6 }),
    repo.listNews({ publishedOnly: true, limit: 20 }),
    repo.listPosts({ status: 'approved', q, limit: 4 }),
  ])
  const needle = q.toLowerCase()
  const hits = [
    ...species.map((s) => ({
      title: `${s.nameBn} — ${s.scientificName}`,
      href: s.type === 'prani' ? `/prani/${s.slug}` : `/udbhid/${s.slug}`,
      type: s.type === 'prani' ? 'প্রাণী' : 'উদ্ভিদ',
    })),
    ...news
      .filter((n) => n.title.toLowerCase().includes(needle) || n.excerpt.toLowerCase().includes(needle))
      .slice(0, 2)
      .map((n) => ({ title: n.title, href: `/khobor/${n.slug}`, type: 'খবর' })),
    ...posts.items.slice(0, 2).map((p) => ({ title: p.title || p.body?.slice(0, 40) || 'পোস্ট', href: `/post/${p.id}`, type: 'পোস্ট' })),
  ]
  return NextResponse.json({ hits: hits.slice(0, 8) })
}
