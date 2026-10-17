import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, CheckCircle2, AlertTriangle } from 'lucide-react'
import CategoryRail from '@/components/CategoryRail'
import SpeciesCard from '@/components/SpeciesCard'
import { IucnFilterBar } from '@/components/IucnGuide'
import { getReadyRepo } from '@/lib/repo'
import { CATEGORY_MAP } from '@/lib/categories'
import { IUCN_ORDER, toBn } from '@/lib/utils'
import type { Conservation, DataStatus, GroupId, SpeciesType } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'জ্ঞানভান্ডার — প্রাণী, উদ্ভিদ, স্থান ও সাহিত্য',
  description:
    'বাংলাদেশের সমগ্র জীববৈচিত্র্য, প্রকৃতির স্থান ও সাহিত্যের একক জ্ঞানভান্ডার — যাচাইকৃত রেকর্ড ও যেগুলো যাচাই করা যায়নি সেগুলোর সুনির্দিষ্ট কারণসহ।',
}

const TYPES: { id: SpeciesType | 'all'; label: string }[] = [
  { id: 'all', label: 'সব' },
  { id: 'prani', label: 'প্রাণী' },
  { id: 'udbhid', label: 'উদ্ভিদ/ছত্রাক' },
  { id: 'sthan', label: 'নদী-বন-পাহাড়' },
  { id: 'sahitto', label: 'সাহিত্য' },
]

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ group?: string; type?: string; q?: string; status?: string; iucn?: string; page?: string }>
}) {
  const sp = await searchParams
  const group = (sp.group && CATEGORY_MAP[sp.group] ? sp.group : 'all') as GroupId | 'all'
  const type = (TYPES.some((t) => t.id === sp.type) ? sp.type : 'all') as SpeciesType | 'all'
  const q = (sp.q || '').trim()
  const rawIucn = (sp.iucn || '').toUpperCase() as Conservation
  const iucn: Conservation | 'all' = IUCN_ORDER.includes(rawIucn) ? rawIucn : 'all'
  const statusFilter: DataStatus | 'unverified' | 'all' =
    sp.status === 'verified' ? 'verified' : sp.status === 'unverified' ? 'unverified' : 'all'

  const pageSize = 60
  const requestedPage = /^\d{1,6}$/.test(sp.page || '') ? Math.max(1, Number(sp.page)) : 1
  const repo = await getReadyRepo()
  const filters = {
    group,
    type,
    q: q || undefined,
    conservation: iucn,
    dataStatus: statusFilter,
  }
  const [total, allInGroup] = await Promise.all([
    repo.countSpecies(filters),
    repo.listSpecies({ group, type, q: q || undefined, limit: 5000 }),
  ])

  const countsByIucn: Partial<Record<Conservation, number>> = {}
  let verifiedCount = 0
  let unverifiedCount = 0
  for (const code of IUCN_ORDER) countsByIucn[code] = 0
  for (const s of allInGroup) {
    if ((s.dataStatus || 'partial') === 'verified') verifiedCount++
    else unverifiedCount++
    if (s.type === 'prani' || s.type === 'udbhid' || s.conservation !== 'NE') {
      countsByIucn[s.conservation] = (countsByIucn[s.conservation] || 0) + 1
    }
  }

  const pages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(requestedPage, pages)

  const buildHref = (next: {
    group?: string
    type?: SpeciesType | 'all'
    iucn?: Conservation
    status?: 'verified' | 'unverified' | 'all'
    page?: number
  }) => {
    const params = new URLSearchParams()
    const g = next.group !== undefined ? next.group : group
    const t = next.type !== undefined ? next.type : type
    const c = 'iucn' in next ? next.iucn : iucn !== 'all' ? iucn : undefined
    const st = next.status !== undefined ? next.status : statusFilter
    if (g && g !== 'all') params.set('group', g)
    if (t && t !== 'all') params.set('type', t)
    if (q) params.set('q', q)
    if (c) params.set('iucn', c)
    if (st && st !== 'all') params.set('status', st)
    if (next.page && next.page > 1) params.set('page', String(next.page))
    const qs = params.toString()
    return `/gyan${qs ? `?${qs}` : ''}`
  }

  const pageHref = (target: number) => buildHref({ page: target })
  const items = await repo.listSpecies({ ...filters, limit: pageSize, offset: (page - 1) * pageSize })

  return (
    <div className="container-pb py-6">
      <h1 className="text-2xl font-bold text-forest-900">জ্ঞানভান্ডার</h1>
      <p className="mt-1 text-sm text-black/55">
        বাংলাদেশে পাওয়া যায় এমন প্রাণী, উদ্ভিদ, ছত্রাক, অণুজীব, নদী-বন ও সাহিত্যের তথ্য। প্রতিটি রেকর্ডে
        উৎস, যাচাই অবস্থা এবং যেগুলো একক প্রজাতি হিসেবে যাচাই করা যায়নি সেগুলোর সুনির্দিষ্ট কারণ দেওয়া আছে।
      </p>

      {/* অনুসন্ধান */}
      <form action="/gyan" className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
          <input
            name="q"
            defaultValue={q}
            placeholder="বাংলা, ইংরেজি, বৈজ্ঞানিক নাম বা IUCN চিহ্ন (CR, EN, VU)…"
            className="field pl-9"
          />
        </div>
        {group !== 'all' && <input type="hidden" name="group" value={group} />}
        {type !== 'all' && <input type="hidden" name="type" value={type} />}
        {iucn !== 'all' && <input type="hidden" name="iucn" value={iucn} />}
        {statusFilter !== 'all' && <input type="hidden" name="status" value={statusFilter} />}
        <button className="btn-primary shrink-0">খুঁজুন</button>
      </form>

      {/* যাচাই অবস্থা ফিল্টার */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-forest-100 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-bold text-forest-900">তথ্য যাচাই অবস্থা:</span>
          <Link
            href={buildHref({ status: 'all', page: 1 })}
            className={`chip text-xs ${statusFilter === 'all' ? 'chip-active' : ''}`}
          >
            সব রেকর্ড ({toBn(allInGroup.length)})
          </Link>
          <Link
            href={buildHref({ status: 'verified', page: 1 })}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
              statusFilter === 'verified'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 size={13} /> যাচাইকৃত ✓ ({toBn(verifiedCount)})
          </Link>
          <Link
            href={buildHref({ status: 'unverified', page: 1 })}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
              statusFilter === 'unverified'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-950 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle size={13} /> যাচাই করা যায়নি — কারণসহ ({toBn(unverifiedCount)})
          </Link>
        </div>
        <Link href="/songrokkhon#unverified" className="text-xs font-semibold text-forest-800 hover:underline">
          সব কারণের পূর্ণ তালিকা দেখুন →
        </Link>
      </div>

      {/* ক্যাটাগরি */}
      <div className="mt-4">
        <CategoryRail active={group === 'all' ? undefined : group} />
      </div>

      {/* ধরন ও অবস্থা */}
      <div className="mt-3 flex flex-wrap gap-2">
        {TYPES.map((t) => {
          const href = buildHref({ type: t.id, page: 1 })
          const active = type === t.id
          return (
            <Link key={t.id} href={href} className={`chip ${active ? 'chip-active' : ''}`}>
              {t.label}
            </Link>
          )
        })}
        <Link href="/categories" className="chip">
          সব ক্যাটাগরি
        </Link>
        <Link href="/admin/coverage" className="chip">
          কভারেজ ও যাচাই রিপোর্ট
        </Link>
      </div>

      {/* IUCN সংরক্ষণ অবস্থা ফিল্টার বার */}
      <IucnFilterBar
        active={iucn}
        counts={countsByIucn}
        buildHref={(code) => buildHref({ iucn: code, page: 1 })}
      />

      <p className="mt-4 text-xs text-black/50">
        {group !== 'all' && (
          <>
            <b className="text-forest-800">{CATEGORY_MAP[group]?.label}</b> — মোট{' '}
          </>
        )}
        {group === 'all' && <>মোট </>}
        <b className="text-forest-800">{toBn(total)}</b> টি রেকর্ড
        {q && <> · “{q}” অনুসন্ধানে {toBn(total)} টি</>}
      </p>

      {total > 0 && (
        <p className="mt-1 text-xs text-black/50">
          দেখানো হচ্ছে {toBn((page - 1) * pageSize + 1)}–{toBn(Math.min(page * pageSize, total))}
        </p>
      )}

      {items.length ? (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((s) => (
            <SpeciesCard key={s.slug} s={s} />
          ))}
        </div>
      ) : (
        <div className="card mt-4 p-8 text-center">
          <p className="text-sm text-black/55">এই ফিল্টারে কোনো রেকর্ড পাওয়া যায়নি।</p>
          <p className="mt-2 text-xs text-black/45">
            আপনি জানেন এমন কোনো প্রজাতি এখানে নেই?{' '}
            <Link href="/jeno" className="font-semibold text-forest-700 underline">
              জেনো-তে আমাদের জানান
            </Link>
            ।
          </p>
        </div>
      )}
      {pages > 1 && (
        <nav aria-label="জ্ঞানভান্ডারের পৃষ্ঠা" className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="btn-primary" rel="prev">
              আগের পৃষ্ঠা
            </Link>
          )}
          <span className="text-sm" aria-current="page">
            পৃষ্ঠা {toBn(page)} / {toBn(pages)}
          </span>
          {page < pages && (
            <Link href={pageHref(page + 1)} className="btn-primary" rel="next">
              পরের পৃষ্ঠা
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
