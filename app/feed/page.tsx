import type { Metadata } from 'next'
import { Suspense } from 'react'
import Feed from '@/components/Feed'
import CategoryTabs from '@/components/CategoryTabs'
import { buildFeedPage } from '@/lib/feed'
import type { PostCategory } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'প্রকৃতির ফিড — ছবি, ভিডিও ও মতামত',
  description: 'বাংলাদেশের প্রাণী, উদ্ভিদ ও গ্রামবাংলার সব শেয়ার করা ছবি-ভিডিও এক স্রোতে।',
  alternates: { canonical: '/feed' },
}

const CATS = [
  { id: 'all', label: 'সব' },
  { id: 'prani', label: 'প্রাণী' },
  { id: 'udbhid', label: 'উদ্ভিদ' },
  { id: 'grambangla', label: 'গ্রামবাংলা' },
  { id: 'manush', label: 'মানুষ' },
]

export default async function Page({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const sp = await searchParams
  const cat = (sp.cat as PostCategory | 'all') || 'all'
  const feed = await buildFeedPage({ category: cat, limit: 12, withSpecies: cat === 'all' })

  return (
    <div className="container-pb py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-forest-900 sm:text-3xl">প্রকৃতির স্রোত</h1>
        <p className="mt-1 text-sm text-black/55">
          সম্প্রদায়ের শেয়ার করা ছবি, ভিডিও আর মতামত — মাঝে মাঝে তথ্যভাণ্ডারের প্রজাতিও মিশে থাকে
        </p>
      </header>
      <Suspense fallback={<div className="h-8" />}>
        <div className="mb-5">
          <CategoryTabs items={CATS} basePath="/feed" />
        </div>
      </Suspense>
      <Feed initialItems={feed.items as any} initialCursor={feed.nextCursor} query={{ category: cat }} />
    </div>
  )
}
