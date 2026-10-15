import type { Metadata } from 'next'
import ReelsFeed from '@/components/ReelsFeed'
import { CURATED_REELS, type ReelPost } from '@/lib/curated-reels'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'রিলস — প্রকৃতির ছোট ভিডিও' }

export default async function Page() {
  const repo = getRepo()
  const [reelPage, videoPage] = await Promise.all([
    repo.listPosts({ status: 'approved', kind: 'reel', limit: 30 }),
    repo.listPosts({ status: 'approved', kind: 'video', limit: 30 }),
  ])
  const seen = new Set<string>()
  const communityVideos: ReelPost[] = [...reelPage.items, ...videoPage.items].filter((post) => {
    if (post.mediaType !== 'video' || !post.mediaUrl || seen.has(post.id)) return false
    seen.add(post.id)
    return true
  })

  // The curated clips are virtual editorial entries; no post or user data is
  // inserted into the database. Real community uploads follow them when present.
  return <ReelsFeed items={[...CURATED_REELS, ...communityVideos]} />
}
