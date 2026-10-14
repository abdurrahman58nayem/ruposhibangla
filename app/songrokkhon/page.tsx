import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, ExternalLink } from 'lucide-react'
import { getRepo } from '@/lib/repo'
import { IUCN, toBn, bnDate, excerpt } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'পরিবেশ ও সংরক্ষণ',
  description: 'বাংলাদেশের বিপন্ন প্রজাতি, হুমকি, গবেষণা ও সংরক্ষণ উদ্যোগ।',
}

const ORDER = ['CR', 'EN', 'VU', 'NT'] as const

export default async function Page() {
  const repo = getRepo()
  const [all, news, coverage] = await Promise.all([
    repo.listSpecies({ limit: 300 }),
    repo.listNews({ publishedOnly: true, limit: 5 }),
    repo.coverage(),
  ])

  const threatened = all.filter((s) => (ORDER as readonly string[]).includes(s.conservation))
  const byStatus = ORDER.map((st) => ({
    status: st,
    label: IUCN[st]?.label || st,
    items: threatened.filter((s) => s.conservation === st),
  })).filter((g) => g.items.length)

  const total = all.length
  const verified = coverage.reduce((a, c) => a + c.verified, 0)

  return (
    <div className="container-pb py-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-forest-900">
        <ShieldCheck size={24} /> পরিবেশ ও সংরক্ষণ
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-black/55">
        বাংলাদেশের জীববৈচিত্র্য কোথায় হুমকির মুখে, কী করা যায় — আর আমাদের জ্ঞানভান্ডারের তথ্য কতটা
        সম্পূর্ণ, সবটাই খোলাখুলি।
      </p>

      {/* সংরক্ষণ অবস্থা */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(byStatus.length ? byStatus : []).map((g) => (
          <div key={g.status} className="card p-4">
            <p className="text-xs font-medium text-black/50">
              {g.status === 'CR' ? 'মহাবিপন্ন' : g.status === 'EN' ? 'বিপন্ন' : g.status === 'VU' ? 'অসুরক্ষিত' : 'সংকটের কাছাকাছি'}
            </p>
            <p className="text-2xl font-bold text-forest-900">{toBn(g.items.length)}</p>
            <p className="text-[10px] text-black/40">টি প্রজাতি</p>
          </div>
        ))}
      </div>

      {/* কভারেজ সারাংশ */}
      <section className="card mt-4 p-4">
        <h2 className="mb-3 text-sm font-bold text-forest-900">তথ্য কভারেজ — কী সম্পূর্ণ, কী বাকি</h2>
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          <span className="chip">মোট রেকর্ড: {toBn(total)}</span>
          <span className="chip">যাচাইকৃত: {toBn(verified)}</span>
          <span className="chip">অসম্পূর্ণ: {toBn(total - verified)}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-xs">
            <thead className="text-left text-[11px] uppercase tracking-wide text-forest-800">
              <tr>
                <th className="p-2">ক্যাটাগরি</th>
                <th className="p-2">মোট</th>
                <th className="p-2">যাচাইকৃত</th>
                <th className="p-2">ছবি নেই</th>
                <th className="p-2">উৎস নেই</th>
              </tr>
            </thead>
            <tbody>
              {coverage.map((c) => (
                <tr key={c.group} className="border-t border-black/5">
                  <td className="p-2 font-medium text-forest-900">{c.label}</td>
                  <td className="p-2">{toBn(c.total)}</td>
                  <td className="p-2">{toBn(c.verified)}</td>
                  <td className="p-2">{toBn(c.missingImage)}</td>
                  <td className="p-2">{toBn(c.missingSource)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-black/45">
          যে ক্যাটাগরিতে রেকর্ড কম বা তথ্য অসম্পূর্ণ, সেটি এড়িয়ে যাওয়া হয়নি — স্পষ্টভাবে দেখানো হয়েছে।
        </p>
      </section>

      {/* বিপন্ন প্রজাতি */}
      {byStatus.map((g) => (
        <section key={g.status} className="mt-5">
          <h2 className="section-title">
            {g.status === 'CR' ? 'মহাবিপন্ন' : g.status === 'EN' ? 'বিপন্ন' : g.status === 'VU' ? 'অসুরক্ষিত' : 'সংকটের কাছাকাছি'}{' '}
            প্রজাতি ({toBn(g.items.length)})
          </h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.slice(0, 12).map((s) => (
              <Link
                key={s.slug}
                href={s.type === 'prani' ? `/prani/${s.slug}` : `/udbhid/${s.slug}`}
                className="card flex items-center gap-3 p-3 transition hover:bg-forest-50"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-forest-900">{s.nameBn}</span>
                  <span className="block truncate text-[11px] italic text-black/45">{s.scientificName}</span>
                </span>
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">
                  {s.conservation}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* খবর */}
      {news.length > 0 && (
        <section className="mt-6">
          <h2 className="section-title">সাম্প্রতিক খবর ও গবেষণা</h2>
          <div className="mt-2 space-y-2">
            {news.map((n) => (
              <Link key={n.id} href={`/khobor/${n.slug}`} className="card block p-3 transition hover:bg-forest-50">
                <p className="text-sm font-semibold text-forest-900">{n.title}</p>
                <p className="mt-0.5 text-xs text-black/55">{excerpt(n.excerpt || n.body, 120)}</p>
                <p className="mt-1 text-[10px] text-black/40">
                  {bnDate(n.createdAt)}
                  {n.publisher ? ` · ${n.publisher}` : ''}
                  {n.sourceUrl && (
                    <span className="ml-1 inline-flex items-center gap-1">
                      <ExternalLink size={10} /> মূল সূত্র
                    </span>
                  )}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
