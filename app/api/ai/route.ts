import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { buildDocs, retrieve, answer, matchByColors } from '@/lib/ai'
import { guard as rateGuard, tooManyRequests, RULES } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
  const _rl = await rateGuard(req, RULES.ai, 'ai')
  if (!_rl.ok) return tooManyRequests(_rl)

  const body = (await req.json().catch(() => ({}))) as {
    message?: string
    palette?: string[]
    imageUrl?: string
    history?: { role: string; content: string }[]
  }
  const message = (body.message || '').trim()
  const palette = Array.isArray(body.palette) ? body.palette.slice(0, 6) : []

  const repo = getRepo()
  const [species, news, posts, settings] = await Promise.all([
    repo.listSpecies({ limit: 500 }),
    repo.listNews({ publishedOnly: true, limit: 50 }),
    repo.listPosts({ status: 'approved', limit: 60 }),
    repo.getSettings(),
  ])

  const docs = buildDocs(species, news, posts.items, settings)
  const hits = message ? retrieve(docs, message, 6) : []

  // ছবি দেওয়া হলে রঙের মিল থেকে সম্ভাব্য প্রজাতি বের করা
  let imageMatches: { slug: string; name: string; scientificName: string; score: number; image: string; href: string }[] = []
  if (palette.length) {
    const { matches } = matchByColors(palette, species)
    imageMatches = matches.map((m) => ({
      slug: m.species.slug,
      name: m.species.nameBn,
      scientificName: m.species.scientificName,
      score: Math.round(m.score * 10) / 10,
      image: m.species.image,
      href: m.species.type === 'prani' ? `/prani/${m.species.slug}` : `/udbhid/${m.species.slug}`,
    }))
  }

  // ছবির সাথে মিল পাওয়া গেলে সেই প্রজাতিগুলোকেও প্রসঙ্গে যোগ করা
  if (imageMatches.length) {
    const extra = imageMatches
      .map((m) => species.find((s) => s.slug === m.slug))
      .filter(Boolean)
      .map((s) => ({
        doc: {
          id: `species:${s!.slug}`,
          type: 'species' as const,
          title: `${s!.nameBn}`,
          text: s!.summary + ' ' + s!.description,
          keywords: s!.nameBn + ' ' + s!.nameEn,
          href: s!.type === 'prani' ? `/prani/${s!.slug}` : `/udbhid/${s!.slug}`,
        },
        score: 5,
      }))
    hits.unshift(...extra)
  }

  const question = message || (imageMatches.length ? 'এই ছবির প্রাণী বা উদ্ভিদটি সম্পর্কে বলুন' : '')
  const result = await answer(question, hits.slice(0, 6), { aiName: settings.aiName, intro: settings.aiIntro })

  /**
   * আস্থা যাচাই — যথেষ্ট প্রসঙ্গ না থাকলে বা ছবির মিল দুর্বল হলে
   * উত্তরটি “অনিশ্চিত” হিসেবে চিহ্নিত হয় এবং বিশেষজ্ঞের কাছে পাঠানোর পথ দেখানো হয়।
   */
  const bestScore = hits[0]?.score ?? 0
  const bestImage = imageMatches[0]?.score ?? 0
  const lowConfidence = hits.length === 0 || bestScore < 1.2 || (!!palette.length && bestImage < 55)

  return NextResponse.json({
    answer: result.answer,
    mode: result.mode,
    lowConfidence,
    missingInfo: lowConfidence
      ? [
          hits.length ? 'প্রসঙ্গ পাওয়া গেলেও মিল যথেষ্ট শক্তিশালী নয়' : 'এই প্রশ্নের জন্য কোনো প্রসঙ্গ পাওয়া যায়নি',
          palette.length ? `ছবির সেরা মিল: ${bestImage}%` : '',
        ]
          .filter(Boolean)
          .join(' · ')
      : '',
    sources: hits.slice(0, 5).map((h) => ({ title: h.doc.title, href: h.doc.href, type: h.doc.type })),
    imageMatches,
  })
}
