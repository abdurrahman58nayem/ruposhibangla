import type { Metadata } from 'next'
import Link from 'next/link'
import { Search } from 'lucide-react'
import CategoryRail from '@/components/CategoryRail'
import SpeciesCard from '@/components/SpeciesCard'
import { getReadyRepo } from '@/lib/repo'
import { CATEGORY_MAP } from '@/lib/categories'
import { toBn } from '@/lib/utils'
import type { GroupId, SpeciesType } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'জ্ঞানভান্ডার' }

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
  searchParams: Promise<{ group?: string; type?: string; q?: string; status?: string; page?: string }>
}) {
  const sp = await searchParams
  const group = (sp.group && CATEGORY_MAP[sp.group] ? sp.group : 'all') as GroupId | 'all'
  const type = (TYPES.some((t) => t.id === sp.type) ? sp.type : 'all') as SpeciesType | 'all'
  const q = (sp.q || '').trim()

  const pageSize = 60
  const requestedPage = /^\d{1,6}$/.test(sp.page || '') ? Math.max(1, Number(sp.page)) : 1
  const repo = await getReadyRepo()
  const filters = { group, type, q: q || undefined }
  const total = await repo.countSpecies(filters)
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(requestedPage, pages)
  const pageHref = (target: number) => {
    const params = new URLSearchParams()
    if (group !== 'all') params.set('group', group)
    if (type !== 'all') params.set('type', type)
    if (q) params.set('q', q)
    params.set('page', String(target))
    return `/gyan?${params}`
  }
  const items = await repo.listSpecies({ ...filters, limit: pageSize, offset: (page - 1) * pageSize })

  return (
    <div className="container-pb py-6">
      <h1 className="text-2xl font-bold text-forest-900">জ্ঞানভান্ডার</h1>
      <p className="mt-1 text-sm text-black/55">
        বাংলাদেশে পাওয়া যায় এমন প্রাণী, উদ্ভিদ, ছত্রাক, অণুজীব, নদী-বন ও সাহিত্যের তথ্য। প্রতিটি রেকর্ডে
        উৎস ও তথ্যের অবস্থা দেওয়া আছে — অসম্পূর্ণ তথ্য লুকানো হয় না।
      </p>

      {/* অনুসন্ধান */}
      <form action="/gyan" className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
          <input
            name="q"
            defaultValue={q}
            placeholder="বাংলা, ইংরেজি বা বৈজ্ঞানিক নাম…"
            className="field pl-9"
          />
        </div>
        {group !== 'all' && <input type="hidden" name="group" value={group} />}
        {type !== 'all' && <input type="hidden" name="type" value={type} />}
        <button className="btn-primary shrink-0">খুঁজুন</button>
      </form>

      {/* ক্যাটাগরি */}
      <div className="mt-4">
        <CategoryRail active={group === 'all' ? undefined : group} />
      </div>

      {/* ধরন ও অবস্থা */}
      <div className="mt-3 flex flex-wrap gap-2">
        {TYPES.map((t) => {
          const params = new URLSearchParams()
          if (group !== 'all') params.set('group', group)
          if (t.id !== 'all') params.set('type', t.id)
          if (q) params.set('q', q)
          const href = `/gyan${params.toString() ? `?${params}` : ''}`
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
          কভারেজ রিপোর্ট
        </Link>
      </div>

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

      {total > 0 && <p className="mt-1 text-xs text-black/50">দেখানো হচ্ছে {toBn((page - 1) * pageSize + 1)}–{toBn(Math.min(page * pageSize, total))}</p>}

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
          {page > 1 && <Link href={pageHref(page - 1)} className="btn-primary" rel="prev">আগের পৃষ্ঠা</Link>}
          <span className="text-sm" aria-current="page">পৃষ্ঠা {toBn(page)} / {toBn(pages)}</span>
          {page < pages && <Link href={pageHref(page + 1)} className="btn-primary" rel="next">পরের পৃষ্ঠা</Link>}
        </nav>
      )}
    </div>
  )
}
