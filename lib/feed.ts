import { getRepo } from '@/lib/repo'
import type { Species, Post } from '@/lib/types'
import type { PostQuery } from '@/lib/repo/types'

export type FeedItem =
  | { type: 'post'; key: string; data: Post }
  | { type: 'species'; key: string; data: Species }

export type FeedParams = {
  category?: PostQuery['category']
  kind?: PostQuery['kind']
  group?: PostQuery['group']
  speciesSlug?: string
  authorId?: string
  /** অনুসরণ ফিল্টার — যাদের অনুসরণ করছেন তাদের আইডি */
  followingIds?: string[]
  /** নতুন (সময় অনুযায়ী) বা জনপ্রিয় (পছন্দ অনুযায়ী) */
  sort?: 'new' | 'popular'
  q?: string
  cursor?: string | null
  limit?: number
  withSpecies?: boolean
}

/** জনপ্রিয় সাজানোর সময় কার্সারে অবস্থান (অফসেট) রাখা হয় */
const POP = 'pop:'

/**
 * পোস্ট আর প্রজাতির তথ্য একসাথে মিশিয়ে ফিড তৈরি করে — যাতে স্ক্রল করতে করতে
 * প্রাণী/উদ্ভিদের তথ্যও সামনে আসে।
 */
export async function buildFeedPage(params: FeedParams = {}): Promise<{ items: FeedItem[]; nextCursor: string | null }> {
  const repo = getRepo()
  const limit = params.limit ?? 12
  const sort = params.sort === 'popular' ? 'popular' : 'new'
  const cursor = params.cursor ?? null

  // জনপ্রিয়: একটি বড় জানালা এনে পছন্দ অনুযায়ী সাজিয়ে কেটে নেওয়া হয়
  const windowLimit = sort === 'popular' ? Math.min(200, Math.max(limit * 4, 48)) : limit
  const offset = sort === 'popular' && cursor?.startsWith(POP) ? Number(cursor.slice(POP.length)) || 0 : 0

  const page = await repo.listPosts({
    status: 'approved',
    category: params.category,
    kind: params.kind,
    group: params.group,
    speciesSlug: params.speciesSlug,
    authorId: params.authorId,
    q: params.q,
    cursor: sort === 'popular' ? null : cursor,
    limit: windowLimit,
  })

  let posts = page.items
  if (params.followingIds?.length) {
    const ids = new Set(params.followingIds)
    posts = posts.filter((p) => !!p.authorId && ids.has(p.authorId))
  }
  if (sort === 'popular') {
    posts = [...posts].sort((a, b) => b.likes - a.likes || b.createdAt.localeCompare(a.createdAt))
  }

  let nextCursor: string | null = null
  if (sort === 'popular') {
    const sliced = posts.slice(offset, offset + limit)
    nextCursor = offset + limit < posts.length ? `${POP}${offset + limit}` : null
    posts = sliced
  } else {
    nextCursor = page.nextCursor
  }

  const items: FeedItem[] = []
  let speciesPool: Species[] = []

  const mixSpecies = params.withSpecies !== false && !params.speciesSlug && !params.authorId && !params.followingIds?.length && sort === 'new'

  if (mixSpecies) {
    const all = await repo.listSpecies({ limit: 200 })
    speciesPool = all.filter((s) => !!s.image)
    if (!speciesPool.length) speciesPool = all.slice(0, 40)
    const start = Number((cursor || '0').replace(/\D/g, '').slice(0, 6) || posts.length)
    const step = 4
    let si = start % Math.max(1, speciesPool.length)
    posts.forEach((post, i) => {
      items.push({ type: 'post', key: `p-${post.id}`, data: post })
      if ((i + 1) % step === 0 && speciesPool.length) {
        const s = speciesPool[si % speciesPool.length]
        si += 1
        items.push({ type: 'species', key: `s-${s.slug}-${i}-${si}`, data: s })
      }
    })
  } else {
    posts.forEach((post) => items.push({ type: 'post', key: `p-${post.id}`, data: post }))
  }

  return { items, nextCursor }
}
