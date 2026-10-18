import Link from 'next/link'
import SpeciesCard from './SpeciesCard'
import SearchBar from './SearchBar'
import { IucnFilterBar } from './IucnGuide'
import { getRepo } from '@/lib/repo'
import { IUCN, IUCN_ORDER, toBn } from '@/lib/utils'
import {
  MAMMAL_SUB_FILTERS,
  matchesMammalSubCategory,
  normalizeCategoryName,
} from '@/lib/categories'
import type { Conservation, SpeciesType } from '@/lib/types'

export default async function SpeciesBrowser({
  type,
  title,
  subtitle,
  cat,
  sub,
  iucn,
  q,
  page = 1,
  perPage = 24,
}: {
  type: SpeciesType
  title: string
  subtitle: string
  cat?: string
  sub?: string
  iucn?: string
  q?: string
  page?: number
  perPage?: number
}) {
  const repo = getRepo()
  const base = type === 'prani' ? '/prani' : '/udbhid'
  const validIucn = iucn && IUCN[iucn] ? (iucn as Conservation) : undefined
  const normCat = cat ? normalizeCategoryName(cat) : undefined
  const isMammalCat = normCat === 'স্তন্যপায়ী'

  const allForCounts = await repo.listSpecies({ type, category: normCat, q, limit: 5000 })

  // স্তন্যপায়ীর ভেতরের উপ-বিভাগ (তিমি-শুশুক, বাঘ ও শিকারি, হরিণ, বাদুড় ইত্যাদি) ফিল্টার
  const subFiltered =
    isMammalCat && sub && sub !== 'all'
      ? allForCounts.filter((s) => matchesMammalSubCategory(s, sub))
      : allForCounts

  const iucnFiltered = validIucn
    ? subFiltered.filter((s) => s.conservation === validIucn)
    : subFiltered

  const total = iucnFiltered.length
  const pages = Math.max(1, Math.ceil(total / perPage))
  const currentPage = Math.min(page, pages)
  const offset = (currentPage - 1) * perPage
  const rows = iucnFiltered.slice(offset, offset + perPage)

  const iucnCounts: Partial<Record<Conservation, number>> = {}
  for (const code of IUCN_ORDER) iucnCounts[code] = 0
  for (const s of subFiltered) {
    iucnCounts[s.conservation] = (iucnCounts[s.conservation] || 0) + 1
  }

  const buildHref = (opts: { cat?: string; sub?: string; iucn?: Conservation; page?: number }) => {
    const params = new URLSearchParams()
    const nextCat = opts.cat !== undefined ? opts.cat : cat
    const nextSub = opts.sub !== undefined ? opts.sub : sub
    if (nextCat) params.set('cat', nextCat)
    if (nextSub && nextSub !== 'all' && nextCat === 'স্তন্যপায়ী') params.set('sub', nextSub)
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
          <SearchBar placeholder={type === 'prani' ? 'পাখি, বাঘ, তিমি, ডলফিন বা মাছের নাম লিখুন…' : 'গাছ বা ফুলের নাম লিখুন…'} />
        </div>
      </header>

      {/* উপ-ক্যাটাগরি চিপস এখন হেডারের স্ট্রিপে (CategoryTopBar) — এই বিভাগে ঢুকলেই ওপরে দেখায় */}

      {/* স্তন্যপায়ী ক্যাটাগরি নির্বাচিত থাকলে উপ-বিভাগ চিপস */}
      {isMammalCat && (
        <div className="mb-4 rounded-2xl border border-earth-100 bg-earth-50/50 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-earth-900">স্তন্যপায়ীর দলসমূহ:</span>
            <span className="text-[11px] text-earth-700">১৩৯টি বন্য স্তন্যপায়ী</span>
          </div>
          <div className="no-scrollbar -mx-2 flex gap-1.5 overflow-x-auto px-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {MAMMAL_SUB_FILTERS.map((f) => {
              const active = (!sub && f.id === 'all') || sub === f.id
              return (
                <Link
                  key={f.id}
                  href={buildHref({ cat: 'স্তন্যপায়ী', sub: f.id, iucn: validIucn, page: 1 })}
                  className={`chip text-xs ${
                    active ? 'bg-earth-800 text-white' : 'bg-white text-earth-900 hover:bg-earth-100'
                  }`}
                  title={f.hint}
                >
                  {f.label}
                  {f.badge && <span className="ml-1 rounded-full bg-black/10 px-1.5 py-0.2 text-[9px]">{f.badge}</span>}
                </Link>
              )
            })}
          </div>

          {/* তিমি ও শুশুক উপ-বিভাগের বিজ্ঞান-নির্দেশিকা */}
          {sub === 'cetacea' && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-cyan-200 bg-cyan-50/80 p-3 text-xs leading-relaxed text-cyan-950">
              <span className="text-base leading-none">🐋</span>
              <div>
                <b>বিজ্ঞান-তথ্য:</b> তিমি ও শুশুক জলে বসবাস করলেও এরা মাছ নয়। এরা উষ্ণ রক্তের সামুদ্রিক স্তন্যপায়ী (Cetacea) — ফুসফুস দিয়ে শ্বাস নেয়, সমুদ্রের ওপরে ফোয়ারা তুলে বাতাস ছাড়ে এবং সন্তানকে দুধ পান করায়।
              </div>
            </div>
          )}

          {/* বাদুড় উপ-বিভাগের বিজ্ঞান-নির্দেশিকা */}
          {sub === 'bat' && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs leading-relaxed text-amber-950">
              <span className="text-base leading-none">🦇</span>
              <div>
                <b>বিজ্ঞান-তথ্য:</b> বাদুড় ডানায় ভর করে আকাশে উড়লেও এরা পাখি নয়। এরা পৃথিবীর একমাত্র উড়তে সক্ষম স্তন্যপায়ী প্রাণী (Chiroptera) — ছানা প্রসব করে এবং দুধ পান করিয়ে বড় করে।
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-5">
        <IucnFilterBar
          active={validIucn || 'all'}
          counts={iucnCounts}
          buildHref={(code) => buildHref({ cat, sub, iucn: code, page: 1 })}
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
          {currentPage > 1 && (
            <Link href={buildHref({ cat, sub, iucn: validIucn, page: currentPage - 1 })} className="btn-outline">
              ← আগে
            </Link>
          )}
          <span className="px-3 text-sm text-black/50">
            পাতা {toBn(currentPage)} / {toBn(pages)}
          </span>
          {currentPage < pages && (
            <Link href={buildHref({ cat, sub, iucn: validIucn, page: currentPage + 1 })} className="btn-outline">
              পরে →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
