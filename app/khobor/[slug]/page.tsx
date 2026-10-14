import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SmartImage from '@/components/SmartImage'
import { getRepo } from '@/lib/repo'
import { bnDate, excerpt } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const n = await getRepo().getNews(slug)
  if (!n) return { title: 'খবর পাওয়া যায়নি' }
  return {
    title: n.title,
    description: excerpt(n.excerpt || n.body, 160),
    alternates: { canonical: `/khobor/${n.slug}` },
    openGraph: { title: n.title, description: excerpt(n.excerpt || n.body, 160), images: n.cover ? [n.cover] : undefined, type: 'article' },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const repo = getRepo()
  const news = await repo.getNews(slug)
  if (!news) notFound()
  const more = (await repo.listNews({ publishedOnly: true, limit: 8 })).filter((n) => n.slug !== slug).slice(0, 3)

  return (
    <article className="container-pb py-6">
      <nav className="mb-3 text-xs text-black/50">
        <Link href="/" className="hover:text-forest-700">হোম</Link> / <Link href="/khobor" className="hover:text-forest-700">খবর</Link>
      </nav>

      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold leading-tight text-forest-900 sm:text-3xl">{news.title}</h1>
        <p className="mt-2 text-xs text-black/45">{bnDate(news.createdAt)}</p>

        {news.cover && (
          <SmartImage
            src={news.cover}
            alt={news.title}
            fallbackKind="gram"
            fallbackLabel="প্রকৃতির খবর"
            width={1000}
            height={560}
            className="mt-4 aspect-[16/9] w-full rounded-2xl"
          />
        )}

        <div className="prose-bn mt-6">
          {news.body.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {!!news.tags?.length && (
          <div className="mt-6 flex flex-wrap gap-2">
            {news.tags.map((t) => (
              <span key={t} className="rounded-full bg-forest-50 px-3 py-1 text-xs text-forest-800">
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl bg-earth-50 p-5 text-sm">
          <p className="text-black/70">
            এই বিষয়ে আপনার কাছে তথ্য বা ছবি থাকলে আমাদের জানান —{' '}
            <Link href="/jeno" className="font-medium text-forest-700 hover:underline">
              জেনো
            </Link>{' '}
            পাতা থেকে পাঠিয়ে দিন। অথবা{' '}
            <Link href="/ai" className="font-medium text-forest-700 hover:underline">
              এআই সহচর
            </Link>{' '}
            এর কাছে জিজ্ঞেস করুন।
          </p>
        </div>
      </div>

      {more.length > 0 && (
        <section className="mx-auto mt-12 max-w-3xl">
          <h2 className="mb-3 text-lg font-bold text-forest-900">আরও খবর</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {more.map((n) => (
              <Link key={n.id} href={`/khobor/${n.slug}`} className="card overflow-hidden">
                <SmartImage src={n.cover} alt={n.title} fallbackKind="gram" fallbackLabel="খবর" width={400} height={240} className="aspect-[16/9] w-full" />
                <p className="p-3 text-[13px] font-semibold leading-snug text-forest-900 line-clamp-3">{n.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
