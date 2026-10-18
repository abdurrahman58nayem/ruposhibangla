import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { speciesPath, typeLabel } from '@/lib/categories'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')?.trim() || ''
  if (q.length < 2) return NextResponse.json({ hits: [] })
  const repo = getRepo()
  const [{ species, news, posts }, observations] = await Promise.all([
    repo.search(q),
    repo.listObservations?.({ limit: 100 }) || Promise.resolve([]),
  ])
  const needle = q.toLowerCase()
  const observationHits = observations.filter((item) => [item.name, item.guessedName, item.speciesSlug, item.notes].join(' ').toLowerCase().includes(needle)).slice(0, 2)
  const hits = [
    ...species.slice(0, 5).map((s) => ({
      title: `${s.nameBn}${s.nameEn ? ` · ${s.nameEn}` : ''}`,
      href: speciesPath(s),
      type: `${typeLabel(s.type)} · ${s.category}`,
      image: s.image || undefined,
      imageKind: s.type,
    })),
    ...news.slice(0, 2).map((item) => ({
      title: item.title,
      href: `/khobor/${item.slug}`,
      type: item.kind === 'research' ? 'গবেষণা ও প্রতিবেদন · সংবাদ' : item.kind === 'conservation' ? 'সংরক্ষণ · সংবাদ' : 'প্রকৃতির খবর',
      image: item.cover || undefined,
      imageKind: 'gram' as const,
    })),
    ...posts.slice(0, 2).map((post) => ({
      title: post.title || post.body?.slice(0, 55) || 'প্রকৃতির ছবি ও গল্প',
      href: `/post/${post.id}`,
      type: `ব্যবহারকারীর ${post.kind === 'video' || post.kind === 'reel' ? 'ভিডিও' : 'পোস্ট'} · ${post.category}`,
      image: post.thumbUrl || (post.mediaType === 'image' ? post.mediaUrl : undefined),
      imageKind: 'gram' as const,
    })),
    ...observationHits.filter((item) => item.status !== 'rejected').map((item) => ({
      title: `${item.guessedName || item.speciesSlug || item.name} · পর্যবেক্ষণ`,
      href: `/observations?q=${encodeURIComponent(q)}`,
      type: 'ব্যবহারকারীর প্রজাতি পর্যবেক্ষণ',
      image: item.photoUrl || undefined,
      imageKind: 'gram' as const,
    })),
  ]
  return NextResponse.json({ hits: hits.slice(0, 8) })
}
