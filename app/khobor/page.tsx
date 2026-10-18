import type { Metadata } from 'next'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'
import { getRepo } from '@/lib/repo'
import { bnDate, toBn } from '@/lib/utils'
import { Newspaper } from 'lucide-react'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'প্রকৃতির খবর — বাংলাদেশের জীববৈচিত্র্য ও পরিবেশ',
  description: 'বাংলাদেশের বন্যপ্রাণী, বন, হাওর, জলবায়ু ও সংরক্ষণ নিয়ে সর্বশেষ খবর ও আপডেট।',
  alternates: { canonical: '/khobor' },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind = '' } = await searchParams
  const allNews = await getRepo().listNews({ publishedOnly: true, limit: 100 })
  const validKind = ['news', 'research', 'conservation'].includes(kind) ? kind : ''
  const news = validKind ? allNews.filter((item) => item.kind === validKind) : allNews
  const [featured, ...rest] = news

  return (
    <div className="container-pb py-6">
      <header className="mb-5">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-forest-900 sm:text-3xl">
          <Newspaper className="text-forest-600" /> প্রকৃতির খবর
        </h1>
        <p className="mt-1 text-sm text-black/55">জীববৈচিত্র্য, বন, হাওর-নদী আর সংরক্ষণ — যা ঘটছে আমাদের চারপাশে</p>
      </header>

      <nav aria-label="সংবাদ বিভাগ" className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {[{ id: '', label: 'সব' }, { id: 'news', label: 'সংবাদ' }, { id: 'research', label: 'গবেষণা ও প্রতিবেদন' }, { id: 'conservation', label: 'সংরক্ষণ' }].map((tab) => <Link key={tab.id || 'all'} href={tab.id ? `/khobor?kind=${tab.id}` : '/khobor'} className={cn('chip whitespace-nowrap', validKind === tab.id && 'chip-active')}>{tab.label}</Link>)}
      </nav>

      {featured && (
        <Link href={`/khobor/${featured.slug}`} className="card group mb-6 overflow-hidden lg:flex">
          <SmartImage
            src={featured.cover}
            alt={featured.title}
            fallbackKind="gram"
            fallbackLabel="প্রকৃতির খবর"
            width={900}
            height={520}
            className="aspect-[16/9] w-full lg:w-1/2"
            imgClassName="transition duration-500 group-hover:scale-105"
          />
          <div className="flex flex-1 flex-col justify-center p-5 sm:p-8">
            <span className="mb-2 w-fit rounded-full bg-earth-100 px-2.5 py-1 text-[11px] font-semibold text-earth-800">
              সর্বশেষ
            </span>
            <h2 className="text-xl font-bold leading-snug text-forest-900 sm:text-2xl">{featured.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-black/65">{featured.excerpt}</p>
            <p className="mt-4 text-[11px] text-black/40">
              {bnDate(featured.createdAt)} · {toBn(featured.views || 0)} বার পড়া হয়েছে
            </p>
          </div>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((n) => (
          <Link key={n.id} href={`/khobor/${n.slug}`} className="card group overflow-hidden">
            <SmartImage
              src={n.cover}
              alt={n.title}
              fallbackKind="gram"
              fallbackLabel="প্রকৃতির খবর"
              width={500}
              height={300}
              className="aspect-[16/9] w-full"
              imgClassName="transition duration-500 group-hover:scale-105"
            />
            <div className="p-4">
              <p className="text-[11px] text-black/40">{bnDate(n.createdAt)}</p>
              <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug text-forest-900">{n.title}</h3>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-black/60">{n.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      {!news.length && <div className="card p-10 text-center text-sm text-black/50">এখনো কোনো খবর প্রকাশিত হয়নি।</div>}
    </div>
  )
}
