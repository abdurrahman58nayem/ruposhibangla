import type { Metadata } from 'next'
import Link from 'next/link'
import Feed from '@/components/Feed'
import SmartImage from '@/components/SmartImage'
import { buildFeedPage } from '@/lib/feed'
import { getRepo } from '@/lib/repo'
import { PORTAL_CATEGORIES } from '@/lib/portal-categories'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'গ্রামবাংলা — গ্রামের ছবি, সহজ সরল মানুষের গল্প',
  description:
    'বাংলাদেশের গ্রামের ছবি, মাঠ-পুকুর-নদী, কৃষক ও জেলের দৈনন্দিন জীবন আর সহজ সরল মানুষের গল্প — শেয়ার করুন আপনার গ্রামের ছবি।',
  alternates: { canonical: '/grambangla' },
}

const HIGHLIGHTS = [
  { src: '/seed/village/paddy-1.jpg', title: 'ধানখেতের সবুজ', note: 'ভোরের কুয়াশায় ভেজা মাঠ' },
  { src: '/seed/village/homestead.jpg', title: 'মাটির ঘর', note: 'বাঁশ আর মাটির হাতের কারিগরি' },
  { src: '/seed/village/nouka.jpg', title: 'নদীর নৌকো', note: 'জেলের সকালের শ্রম' },
  { src: '/seed/village/haat.jpg', title: 'সাপ্তাহিক হাট', note: 'গ্রামের মিলনমেলা' },
]

export default async function Page({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic = '' } = await searchParams
  const feed = await buildFeedPage({ category: 'grambangla', q: topic || undefined, limit: 12, withSpecies: false })
  const repo = getRepo()
  const count = (await repo.listPosts({ status: 'approved', category: 'grambangla', q: topic || undefined, limit: 200 })).items.length
  const villageTopics = PORTAL_CATEGORIES.find((category) => category.id === 'village')?.subcategories || []

  return (
    <div>
      <section className="relative overflow-hidden bg-forest-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/seed/village/paddy-2.jpg')" }}
        />
        <div className="container-pb relative py-12 text-white">
          <h1 className="text-3xl font-bold sm:text-4xl">গ্রামবাংলা</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            ধানখেতের সবুজ ঢেউ, পুকুরপাড়ের শৈশব, নদীতে জেলের জাল আর হাটে যাওয়ার পথ — বাংলাদেশের আসল শক্তি এই গ্রামের
            সহজ-সরল মানুষ। এখানে জমা হোক আপনার গ্রামের ছবি আর গল্প।
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <Link href="/share?category=grambangla" className="btn-gold">
              আমার গ্রামের ছবি শেয়ার করুন
            </Link>
            <Link href="/kobirchokhe" className="btn bg-white/10 text-white backdrop-blur hover:bg-white/20">
              কবির চোখে গ্রামবাংলা
            </Link>
          </div>
        </div>
      </section>

      <section className="container-pb mt-5">
        <div className="mb-2 flex items-center justify-between gap-3"><h2 className="text-sm font-bold text-forest-900">গ্রামবাংলার বিষয়</h2>{topic && <Link href="/grambangla" className="text-xs font-semibold text-forest-700 hover:underline">সব দেখুন ×</Link>}</div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1"><Link href="/grambangla" className={`chip whitespace-nowrap ${!topic ? 'chip-active' : ''}`}>সব বিষয়</Link>{villageTopics.map((item) => { const value = new URL(item.href, 'https://ruposhibangla.local').searchParams.get('topic') || ''; return <Link key={item.label} href={item.href} className={`chip whitespace-nowrap ${topic === value ? 'chip-active' : ''}`}>{item.label}</Link> })}</div>
      </section>

      <section className="container-pb mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <figure key={h.src} className="card overflow-hidden">
              <SmartImage src={h.src} alt={h.title} width={400} height={300} className="aspect-[4/3] w-full" />
              <figcaption className="p-3">
                <p className="text-sm font-semibold text-forest-900">{h.title}</p>
                <p className="text-[11px] text-black/50">{h.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-pb mt-8">
        <h2 className="section-title mb-1">গ্রাম থেকে শেয়ার করা হয়েছে</h2>
        <p className="mb-4 text-xs text-black/50">মোট {count} টি ছবি/ভিডিও</p>
        <Feed
          initialItems={feed.items as any}
          initialCursor={feed.nextCursor}
          query={{ category: 'grambangla', speciesMix: '0' }}
          emptyMessage="এখনো কেউ গ্রামের ছবি শেয়ার করেনি — প্রথমটি আপনি দিন!"
        />
      </section>
    </div>
  )
}
