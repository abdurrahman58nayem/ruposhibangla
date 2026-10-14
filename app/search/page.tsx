import type { Metadata } from 'next'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'
import PostCard from '@/components/PostCard'
import SearchBar from '@/components/SearchBar'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'খুঁজুন',
  description: 'বাংলাদেশের প্রাণী, উদ্ভিদ, খবর ও সম্প্রদায়ের পোস্ট — সবকিছু একসাথে খুঁজুন।',
}

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const repo = getRepo()
  const results = q.trim() ? await repo.search(q) : { species: [], posts: [], news: [] }
  const total = results.species.length + results.posts.length + results.news.length

  return (
    <div className="container-pb py-6">
      <h1 className="mb-4 text-2xl font-bold text-forest-900">খুঁজুন</h1>
      <div className="mb-6 max-w-2xl">
        <SearchBar />
      </div>

      {!q.trim() ? (
        <p className="text-sm text-black/55">উপরে কিছু লিখে খুঁজুন — যেমন “দোয়েল”, “বাঘ”, “শাপলা”, “সুন্দরবন”।</p>
      ) : (
        <>
          <p className="mb-5 text-sm text-black/55">
            “{q}” — {total} টি ফলাফল পাওয়া গেছে
          </p>

          {!!results.species.length && (
            <section className="mb-8">
              <h2 className="mb-3 text-lg font-bold text-forest-900">প্রজাতি</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {results.species.map((s) => (
                  <Link key={s.slug} href={s.type === 'prani' ? `/prani/${s.slug}` : `/udbhid/${s.slug}`} className="card group overflow-hidden">
                    <SmartImage
                      src={s.image}
                      alt={s.nameBn}
                      fallbackLabel={s.nameBn}
                      fallbackKind={s.type === 'udbhid' ? 'udbhid' : 'prani'}
                      width={400}
                      height={300}
                      className="aspect-[4/3] w-full"
                      imgClassName="transition duration-500 group-hover:scale-105"
                    />
                    <div className="p-3">
                      <p className="text-sm font-bold text-forest-900">{s.nameBn}</p>
                      <p className="truncate text-[11px] italic text-black/45">{s.scientificName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {!!results.news.length && (
            <section className="mb-8">
              <h2 className="mb-3 text-lg font-bold text-forest-900">খবর</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.news.map((n) => (
                  <Link key={n.id} href={`/khobor/${n.slug}`} className="card p-4 hover:bg-forest-50">
                    <p className="text-sm font-semibold text-forest-900">{n.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-black/55">{n.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {!!results.posts.length && (
            <section>
              <h2 className="mb-3 text-lg font-bold text-forest-900">সম্প্রদায়ের পোস্ট</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.posts.map((p) => (
                  <PostCard key={p.id} post={p} dense />
                ))}
              </div>
            </section>
          )}

          {total === 0 && (
            <div className="card p-10 text-center">
              <p className="text-sm text-black/55">“{q}” নিয়ে কিছু পাওয়া যায়নি।</p>
              <p className="mt-2 text-xs text-black/45">
                বানান ভিন্ন হতে পারে, অথবা বিষয়টি এখনো আমাদের তথ্যভাণ্ডারে নেই।{' '}
                <Link href="/jeno" className="font-medium text-forest-700 hover:underline">
                  আপনি জানালে আমরা যোগ করব
                </Link>
                !
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
