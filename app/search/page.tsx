import type { Metadata } from 'next'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'
import PostCard from '@/components/PostCard'
import SpeciesCard from '@/components/SpeciesCard'
import SearchBar from '@/components/SearchBar'
import { getRepo } from '@/lib/repo'
import { bnDate, toBn } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'খুঁজুন',
  description: 'বাংলাদেশের প্রাণী, উদ্ভিদ, প্রাকৃতিক স্থান, সংবাদ ও সম্প্রদায়ের পোস্ট — বাংলা বা ইংরেজি নাম দিয়ে খুঁজুন।',
}

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const repo = getRepo()
  const [results, allObservations] = q.trim() ? await Promise.all([
    repo.search(q.trim()),
    repo.listObservations?.({ limit: 200 }) || Promise.resolve([]),
  ]) : [{ species: [], posts: [], news: [] }, []]
  const needle = q.trim().toLowerCase()
  const observations = allObservations.filter((item) => item.status !== 'rejected' && [item.name, item.guessedName, item.speciesSlug, item.notes].join(' ').toLowerCase().includes(needle))
  const total = results.species.length + results.posts.length + results.news.length + observations.length

  return <main className="container-pb py-6">
    <h1 className="mb-2 text-2xl font-bold text-forest-900">সবকিছু খুঁজুন</h1>
    <p className="mb-4 text-sm text-black/55">বাংলা বা English নাম দিয়ে প্রাণী, উদ্ভিদ, স্থান, সংবাদ, গবেষণা ও ব্যবহারকারীর পোস্ট খুঁজুন।</p>
    <div className="mb-6 max-w-2xl"><SearchBar /></div>

    {!q.trim() ? <p className="text-sm text-black/55">যেমন “দোয়েল”, “Royal Bengal Tiger”, “সুন্দরবন”, “কাপ্তাই” বা “বসন্ত” লিখে খুঁজুন।</p> : <>
      <p className="mb-5 text-sm text-black/55">“{q}” — {toBn(total)}টি ফলাফল পাওয়া গেছে</p>

      {!!results.species.length && <section className="mb-8">
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-forest-900">প্রাণী, উদ্ভিদ ও প্রাকৃতিক স্থান</h2><span className="text-xs text-black/45">{toBn(results.species.length)}টি</span></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{results.species.map((item) => <SpeciesCard key={item.slug} s={item}/>)}</div>
      </section>}

      {!!results.news.length && <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-forest-900">প্রকৃতির খবর ও গবেষণা</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{results.news.map((item) => <Link key={item.id} href={`/khobor/${item.slug}`} className="card group overflow-hidden">
          <SmartImage src={item.cover} alt={item.title} fallbackKind="gram" fallbackLabel="প্রকৃতির খবর" width={500} height={280} className="aspect-[16/9] w-full" imgClassName="transition duration-500 group-hover:scale-105" />
          <div className="p-4"><span className="rounded-full bg-forest-50 px-2 py-0.5 text-[10px] font-semibold text-forest-700">{item.kind === 'research' ? 'গবেষণা' : item.kind === 'conservation' ? 'সংরক্ষণ' : 'সংবাদ'}</span><h3 className="mt-2 text-sm font-bold text-forest-900">{item.title}</h3><p className="mt-1 line-clamp-2 text-xs text-black/55">{item.excerpt}</p><p className="mt-2 text-[10px] text-black/40">{bnDate(item.publishedAt || item.createdAt)}</p></div>
        </Link>)}</div>
      </section>}

      {!!results.posts.length && <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-forest-900">ব্যবহারকারীর ছবি, ভিডিও ও গল্প</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{results.posts.map((post) => <PostCard key={post.id} post={post} dense />)}</div>
      </section>}

      {!!observations.length && <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-forest-900">ব্যবহারকারীর প্রকৃতি পর্যবেক্ষণ</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{observations.map((item) => <Link key={item.id} href={`/observations?q=${encodeURIComponent(q)}`} className="card flex gap-3 p-3 hover:bg-forest-50">
          <SmartImage src={item.photoUrl} alt={item.guessedName || item.name} fallbackKind="gram" fallbackLabel="পর্যবেক্ষণ" width={100} height={100} className="h-20 w-24 shrink-0 rounded-lg" />
          <span className="min-w-0"><span className="block truncate text-sm font-bold text-forest-900">{item.guessedName || item.speciesSlug || item.name}</span><span className="mt-1 block text-[11px] text-black/45">{item.name} · {item.status === 'verified' ? 'যাচাইকৃত' : 'পর্যালোচনাধীন'}</span>{item.notes && <span className="mt-1 line-clamp-2 block text-xs text-black/60">{item.notes}</span>}</span>
        </Link>)}</div>
      </section>}

      {total === 0 && <div className="card p-8 text-center">
        <p className="text-sm font-semibold text-forest-900">“{q}” নিয়ে কোনো ফলাফল পাওয়া যায়নি।</p>
        <p className="mt-2 text-xs text-black/50">বানান যাচাই করুন অথবা বাংলা/ইংরেজি অন্য নাম দিয়ে চেষ্টা করুন। বিষয়টি তথ্যভাণ্ডারে না থাকলে{' '}<Link href="/jeno" className="font-semibold text-forest-700 hover:underline">আমাদের জানান</Link>।</p>
      </div>}
    </>}
  </main>
}
