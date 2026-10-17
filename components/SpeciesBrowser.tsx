import Link from 'next/link'
import SpeciesCard from './SpeciesCard'
import SearchBar from './SearchBar'
import { IucnFilterBar } from './IucnGuide'
import { getRepo } from '@/lib/repo'
import { IUCN, IUCN_ORDER, toBn } from '@/lib/utils'
import type { Conservation, SpeciesType } from '@/lib/types'

export default async function SpeciesBrowser({
  type,
  title,
  subtitle,
  cat,
  iucn,
  q,
  page = 1,
  perPage = 24,
}: {
  type: SpeciesType
  title: string
  subtitle: string
  cat?: string
  iucn?: string
  q?: string
  page?: number
  perPage?: number
}) {
  const repo = getRepo()
  const base = type === 'prani' ? '/prani' : '/udbhid'
  const validIucn = (iucn && IUCN[iucn] ? (iucn as Conservation) : undefined)
  const [categories, allForCounts, total] = await Promise.all([
    repo.listCategories(type),
    repo.listSpecies({ type, category: cat, q, limit: 5000 }),
    repo.countSpecies({ type, category: cat, conservation: validIucn, q }),
  ])
  const rows = await repo.listSpecies({
    type,
    category: cat,
    conservation: validIucn,
    q,
    limit: perPage,
    offset: (page - 1) * perPage,
  })
  const pages = Math.max(1, Math.ceil(total / perPage))

  const iucnCounts: Partial<Record<Conservation, number>> = {}
  for (const code of IUCN_ORDER) iucnCounts[code] = 0
  for (const s of allForCounts) {
    iucnCounts[s.conservation] = (iucnCounts[s.conservation] || 0) + 1
  }

  const buildHref = (opts: { cat?: string; iucn?: Conservation; page?: number }) => {
    const params = new URLSearchParams()
    if (opts.cat) params.set('cat', opts.cat)
    if (opts.iucn) params.set('iucn', opts.iucn)
    if (q) params.set('q', q)
    if (opts.page && opts.page > 1) params.set('page', String(opts.page))
    const qs = params.toString()
    return qs ? `${base}?${qs}` : base
  }

  return (
    <div className="container-pb py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-forest-900 sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-black/55">{subtitle}</p>
        <div className="mt-4 max-w-2xl">
          <SearchBar placeholder={type === 'prani' ? 'পাখি বা প্রাণীর নাম লিখুন…' : 'গাছ বা ফুলের নাম লিখুন…'} />
        </div>
      </header>

      <nav className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={buildHref({ cat: undefined, iucn: validIucn, page: 1 })} className={`chip ${!cat ? 'chip-active' : ''}`}>
          সব <span className="opacity-70">({toBn(allForCounts.length)})</span>
        </Link>
        {categories.map((c) => (
          <Link
            key={c.name}
            href={buildHref({ cat: c.name, iucn: validIucn, page: 1 })}
            className={`chip ${cat === c.name ? 'chip-active' : ''}`}
          >
            {c.name} <span className="opacity-70">({toBn(c.count)})</span>
          </Link>
        ))}
      </nav>

      <div className="mb-5">
        <IucnFilterBar
          active={validIucn || 'all'}
          counts={iucnCounts}
          buildHref={(code) => buildHref({ cat, iucn: code, page: 1 })}
        />
      </div>

      {rows.length === 0 ? (
        <div className="card p-10 text-center text-sm text-black/50">
          এই ফিল্টারে কিছু পাওয়া যায়নি। অন্য নাম বা সংরক্ষণ অবস্থা দিয়ে চেষ্টা করুন।
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((s) => (
            <SpeciesCard key={s.slug} s={s} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={buildHref({ cat, iucn: validIucn, page: page - 1 })} className="btn-outline">
              ← আগে
            </Link>
          )}
          <span className="px-3 text-sm text-black/50">
            পাতা {toBn(page)} / {toBn(pages)}
          </span>
          {page < pages && (
            <Link href={buildHref({ cat, iucn: validIucn, page: page + 1 })} className="btn-outline">
              পরে →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
