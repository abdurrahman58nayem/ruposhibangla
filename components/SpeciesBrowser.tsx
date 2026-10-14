import Link from 'next/link'
import SpeciesCard from './SpeciesCard'
import SearchBar from './SearchBar'
import { getRepo } from '@/lib/repo'
import { toBn } from '@/lib/utils'
import type { SpeciesType } from '@/lib/types'

export default async function SpeciesBrowser({
  type,
  title,
  subtitle,
  cat,
  q,
  page = 1,
  perPage = 24,
}: {
  type: SpeciesType
  title: string
  subtitle: string
  cat?: string
  q?: string
  page?: number
  perPage?: number
}) {
  const repo = getRepo()
  const base = type === 'prani' ? '/prani' : '/udbhid'
  const categories = await repo.listCategories(type)
  const total = await repo.countSpecies({ type, category: cat, q })
  const rows = await repo.listSpecies({
    type,
    category: cat,
    q,
    limit: perPage,
    offset: (page - 1) * perPage,
  })
  const pages = Math.max(1, Math.ceil(total / perPage))

  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    if (cat) params.set('cat', cat)
    if (q) params.set('q', q)
    if (p > 1) params.set('page', String(p))
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

      <nav className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={buildHref(1).replace(/cat=[^&]*/, '').replace('?&', '?')} className={`chip ${!cat ? 'chip-active' : ''}`}>
          সব <span className="opacity-70">({toBn(total)})</span>
        </Link>
        {categories.map((c) => {
          const params = new URLSearchParams()
          params.set('cat', c.name)
          if (q) params.set('q', q)
          return (
            <Link key={c.name} href={`${base}?${params.toString()}`} className={`chip ${cat === c.name ? 'chip-active' : ''}`}>
              {c.name} <span className="opacity-70">({toBn(c.count)})</span>
            </Link>
          )
        })}
      </nav>

      {rows.length === 0 ? (
        <div className="card p-10 text-center text-sm text-black/50">
          এই ফিল্টারে কিছু পাওয়া যায়নি। অন্য নাম দিয়ে চেষ্টা করুন।
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
            <Link href={buildHref(page - 1)} className="btn-outline">
              ← আগে
            </Link>
          )}
          <span className="px-3 text-sm text-black/50">
            পাতা {toBn(page)} / {toBn(pages)}
          </span>
          {page < pages && (
            <Link href={buildHref(page + 1)} className="btn-outline">
              পরে →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
