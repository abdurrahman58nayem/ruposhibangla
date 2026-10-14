import type { Metadata } from 'next'
import ReelsFeed from '@/components/ReelsFeed'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'রিলস — প্রকৃতির ছোট ভিডিও' }

export default async function Page() {
  const page = await getRepo().listPosts({ status: 'approved', kind: 'reel', limit: 30 })
  const reels = page.items.filter((p) => p.mediaType === 'video' && p.mediaUrl)
  const videos = reels.length
    ? reels
    : (await getRepo().listPosts({ status: 'approved', kind: 'video', limit: 30 })).items.filter(
        (p) => p.mediaType === 'video' && p.mediaUrl,
      )
  return <ReelsFeed items={videos} />
}
