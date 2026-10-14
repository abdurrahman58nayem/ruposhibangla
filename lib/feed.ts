import { getRepo } from '@/lib/repo'
import type { Species, Post } from '@/lib/types'
import type { PostQuery } from '@/lib/repo/types'

export type FeedItem =
  | { type: 'post'; key: string; data: Post }
  | { type: 'species'; key: string; data: Species }

export type FeedParams = {
  category?: PostQuery['category']
  kind?: PostQuery['kind']
  speciesSlug?: string
  authorId?: string
  q?: string
  cursor?: string | null
  limit?: number
  withSpecies?: boolean
}

/**
 * পোস্ট আর প্রজাতির তথ্য একসাথে মিশিয়ে ফিড তৈরি করে — যাতে স্ক্রল করতে করতে
 * প্রাণী/উদ্ভিদের তথ্যও সামনে আসে।
 */
export async function buildFeedPage(params: FeedParams = {}): Promise<{ items: FeedItem[]; nextCursor: string | null }> {
  const repo = getRepo()
  const limit = params.limit ?? 12
  const page = await repo.listPosts({
    status: 'approved',
    category: params.category,
    kind: params.kind,
    speciesSlug: params.speciesSlug,
    authorId: params.authorId,
    q: params.q,
    cursor: params.cursor ?? null,
    limit,
  })

  const items: FeedItem[] = []
  let speciesPool: Species[] = []

  if (params.withSpecies !== false && !params.speciesSlug && !params.authorId) {
    const all = await repo.listSpecies({ limit: 200 })
    speciesPool = all.filter((s) => !!s.image)
    if (!speciesPool.length) speciesPool = all.slice(0, 40)
    // স্টার্ট ইনডেক্স অনুযায়ী ডিটারমিনিস্টিকভাবে মেশানো
    const start = Number((params.cursor || '0').replace(/\D/g, '').slice(0, 6) || page.items.length)
    const step = 4
    let si = start % Math.max(1, speciesPool.length)
    page.items.forEach((post, i) => {
      items.push({ type: 'post', key: `p-${post.id}`, data: post })
      if ((i + 1) % step === 0 && speciesPool.length) {
        const s = speciesPool[si % speciesPool.length]
        si += 1
        items.push({ type: 'species', key: `s-${s.slug}-${i}-${si}`, data: s })
      }
    })
  } else {
    page.items.forEach((post) => items.push({ type: 'post', key: `p-${post.id}`, data: post }))
  }

  return { items, nextCursor: page.nextCursor }
}
