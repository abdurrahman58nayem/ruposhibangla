import type { Metadata } from 'next'
import ReelsFeed from '@/components/ReelsFeed'
import { SPECIES } from '@/data/seed'
import { CURATED_REELS, speciesMediaReels, type ReelPost } from '@/lib/curated-reels'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'রিলস — প্রকৃতির ছোট ভিডিও' }

export default async function Page() {
  const repo = getRepo()
  const [reelPage, videoPage, dbVideoSpecies] = await Promise.all([
    repo.listPosts({ status: 'approved', kind: 'reel', limit: 30 }),
    repo.listPosts({ status: 'approved', kind: 'video', limit: 30 }),
    // অ্যাডমিন এডিট ফর্ম থেকে যোগ করা প্রজাতি-ভিডিও (সিডের ভিডিওর সঙ্গে মিলিয়ে URL-ডিডুপ করা হয়)
    repo.listSpecies({ hasVideo: true, limit: 200 }),
  ])
  const seen = new Set<string>()
  const communityVideos: ReelPost[] = [...reelPage.items, ...videoPage.items].filter((post) => {
    if (post.mediaType !== 'video' || !post.mediaUrl || seen.has(post.id)) return false
    seen.add(post.id)
    return true
  })

  // Curated clips and verified species videos are virtual editorial entries;
  // no post, author, or engagement is inserted into the database. Avoid showing
  // a video twice when it already has a dedicated Commons editorial reel.
  const curatedUrls = new Set(CURATED_REELS.map((item) => item.mediaUrl).filter(Boolean))
  const speciesVideos = speciesMediaReels(SPECIES).filter((item) => !curatedUrls.has(item.mediaUrl || ''))
  const seenUrls = new Set([...curatedUrls, ...speciesVideos.map((item) => item.mediaUrl || '')])
  const dbSpeciesVideos = speciesMediaReels(dbVideoSpecies).filter((item) => {
    if (!item.mediaUrl || seenUrls.has(item.mediaUrl)) return false
    seenUrls.add(item.mediaUrl)
    return true
  })
  return <ReelsFeed items={[...CURATED_REELS, ...speciesVideos, ...dbSpeciesVideos, ...communityVideos]} />
}
