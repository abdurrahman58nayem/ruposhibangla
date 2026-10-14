import type { Metadata } from 'next'
import Link from 'next/link'
import { Quote } from 'lucide-react'
import { getRepo } from '@/lib/repo'
import { excerpt } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'কবির চোখে প্রকৃতি — প্রকৃতি ও সাহিত্য',
  description: 'রবীন্দ্রনাথ, নজরুল, জীবনানন্দ, জসীম উদ্‌দীন ও আরও অনেকের চোখে বাংলাদেশের প্রকৃতি।',
}

export default async function Page() {
  const items = await getRepo().listSpecies({ type: 'sahitto', limit: 100 })
  const poets = await getRepo().listSpecies({ type: 'all', q: '', limit: 300 }).catch(() => [])

  return (
    <div className="container-pb py-6">
      <h1 className="text-2xl font-bold text-forest-900">কবির চোখে প্রকৃতি</h1>
      <p className="mt-1 max-w-2xl text-sm text-black/55">
        বাংলা সাহিত্যে নদী, পাখি, ফুল, গাছ আর ঋতু কীভাবে এসেছে — তার বাস্তব পরিচয় ও ব্যাখ্যা। সংক্ষিপ্ত
        উদ্ধৃতি ও নিজস্ব ব্যাখ্যা ব্যবহার করা হয়েছে; কপিরাইটযুক্ত রচনা অনুমতি ছাড়া সম্পূর্ণ প্রকাশ করা হয় না।
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((s) => (
          <Link
            key={s.slug}
            href={`/sahitto/${s.slug}`}
            className="card group flex flex-col gap-2 p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-earth-50 text-earth-700">
              <Quote size={18} />
            </span>
            <h2 className="font-semibold text-forest-900">{s.nameBn}</h2>
            <p className="text-xs leading-relaxed text-black/60">{excerpt(s.summary, 150)}</p>
            {s.poetViews?.[0]?.poet && (
              <p className="text-[11px] font-medium text-forest-700">{s.poetViews[0].poet}</p>
            )}
          </Link>
        ))}
      </div>

      {!items.length && (
        <div className="card p-8 text-center text-sm text-black/55">কোনো নিবন্ধ যোগ করা হয়নি।</div>
      )}

      <div className="mt-6 rounded-2xl bg-forest-50 p-4 text-xs text-forest-900">
        <b>সূচনা:</b> এই বিভাগ ধাপে ধাপে সমৃদ্ধ করা হবে। আপনার জানা কোনো কবিতায় প্রকৃতির উল্লেখ থাকলে{' '}
        <Link href="/jeno" className="font-semibold underline">
          জেনো
        </Link>
        -তে পাঠিয়ে দিন।
      </div>
    </div>
  )
}
