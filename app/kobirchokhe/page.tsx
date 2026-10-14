import type { Metadata } from 'next'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'
import { getRepo } from '@/lib/repo'
import { Quote } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'কবির চোখে প্রকৃতি — বাংলা কবিতায় পাখি, ফুল ও জন্তুজানোয়ার',
  description:
    'রবীন্দ্রনাথ, নজরুল, জীবনানন্দ, জসীম উদ্‌দীনসহ বাংলার কবিরা কীভাবে দেখেছেন আমাদের পাখি, গাছ আর জন্তুজানোয়ার — কবিতা আর প্রকৃতির মেলবন্ধন।',
  alternates: { canonical: '/kobirchokhe' },
}

export default async function Page() {
  const repo = getRepo()
  const all = await repo.listSpecies({ limit: 300 })
  const entries = all.flatMap((s) =>
    (s.poetViews || []).map((pv) => ({
      poet: pv.poet,
      work: pv.work,
      note: pv.note,
      needsReview: pv.needsReview,
      species: s,
    })),
  )

  const byPoet = new Map<string, typeof entries>()
  entries.forEach((e) => {
    const list = byPoet.get(e.poet) || []
    list.push(e)
    byPoet.set(e.poet, list)
  })
  const poets = [...byPoet.entries()].sort((a, b) => b[1].length - a[1].length)

  return (
    <div className="container-pb py-6">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-forest-900 sm:text-3xl">
          <Quote className="text-earth-500" /> কবির চোখে প্রকৃতি
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-black/60">
          বাংলা কবিতায় প্রকৃতি কখনো প্রেমের দূত, কখনো বিদ্রোহের আগুন, কখনো বা নিঃসঙ্গতার সঙ্গী। কোকিলের ডাক থেকে সারসের
          উড্ডয়ন, শাপলা থেকে শিমুল — কবিরা যেভাবে দেখেছেন আমাদের চারপাশের প্রাণী আর গাছপালা, তার এক ঝলক এখানে।
        </p>
      </header>

      {poets.length === 0 ? (
        <div className="card p-10 text-center text-sm text-black/50">এখনো কোনো এন্ট্রি যোগ করা হয়নি।</div>
      ) : (
        <div className="space-y-10">
          {poets.map(([poet, list]) => (
            <section key={poet}>
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-700 text-sm font-bold text-white">
                  {poet.slice(0, 1)}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-forest-900">{poet}</h2>
                  <p className="text-xs text-black/50">{list.length} টি প্রজাতিতে এই কবির দৃষ্টি</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((e, i) => (
                  <Link
                    key={`${e.species.slug}-${i}`}
                    href={`${e.species.type === 'prani' ? '/prani' : '/udbhid'}/${e.species.slug}#kobi`}
                    className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <SmartImage
                      src={e.species.image}
                      alt={e.species.nameBn}
                      fallbackLabel={e.species.nameBn}
                      fallbackKind={e.species.type === 'udbhid' ? 'udbhid' : 'prani'}
                      width={500}
                      height={300}
                      className="aspect-[16/10] w-full"
                      imgClassName="transition duration-500 group-hover:scale-105"
                    />
                    <div className="p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-forest-600">
                        {e.work || 'বাংলা কাব্য'}
                      </p>
                      <h3 className="mt-0.5 text-base font-bold text-forest-900">{e.species.nameBn}</h3>
                      <p className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-black/70">{e.note}</p>
                      {e.needsReview && <p className="mt-2 text-[11px] text-amber-700">* তথ্য যাচাইয়ের অপেক্ষায়</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <section className="mt-12 rounded-3xl bg-earth-50 p-6 text-center">
        <h2 className="text-lg font-bold text-forest-900">কোনো কবিতা বা উদ্ধৃতি জানেন?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-black/60">
          কবির চোখে প্রকৃতির এই সংগ্রহ আমরা ধীরে ধীরে বাড়াতে চাই। আপনার জানা কবিতা বা তথ্য থাকলে পাঠিয়ে দিন — যাচাই করে
          যোগ করে দেব।
        </p>
        <Link href="/jeno?topic=কবির চোখে প্রকৃতি" className="btn-primary mt-4">
          তথ্য পাঠান
        </Link>
      </section>
    </div>
  )
}
