'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Search, X, ChevronDown } from 'lucide-react'
import { PORTAL_CATEGORIES } from '@/lib/portal-categories'
import { CATEGORIES } from '@/lib/categories'
import CategoryIcon, { toneOf } from '@/components/icons/CategoryIcon'
import SearchBar from '@/components/SearchBar'
import { cn } from '@/lib/utils'

function CategoryTopBarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [allOpen, setAllOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const topic = searchParams?.get('topic')

  useEffect(() => {
    if (!allOpen && !searchOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setAllOpen(false); setSearchOpen(false) } }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [allOpen, searchOpen])

  const isActive = (id: string) => {
    if (id === 'animals') return pathname.startsWith('/prani') || (pathname === '/gyan' && searchParams?.get('type') === 'prani')
    if (id === 'plants') return pathname.startsWith('/udbhid') || (pathname === '/gyan' && searchParams?.get('type') === 'udbhid')
    if (id === 'habitats' || id === 'tourism') return pathname.startsWith('/sthan') && (id === 'tourism' ? topic === 'tourism' : topic !== 'tourism')
    const cultureTopics = ['মেলা', 'নৌকাবাইচ', 'লোকসংগীত', 'কৃষি উৎসব', 'নৌকা', 'কারুশিল্প']
    if (id === 'village' || id === 'culture') return pathname === '/grambangla' && (id === 'culture' ? cultureTopics.includes(searchParams?.get('topic') || '') : !cultureTopics.includes(searchParams?.get('topic') || ''))
    if (id === 'water') return pathname === '/gyan' && searchParams?.get('group') === 'nadi'
    if (id === 'seasons') return pathname === '/search' && /ঋতু|গ্রীষ্ম|বর্ষা|শরৎ|হেমন্ত|শীত|বসন্ত/.test(searchParams?.get('q') || '')
    if (id === 'conservation') return pathname === '/songrokkhon'
    return id === 'stories' && ['/feed', '/khobor', '/observations'].includes(pathname)
  }

  const closePanels = () => { setAllOpen(false); setSearchOpen(false) }

  return (
    <div className="relative border-b border-black/5 bg-white/95 backdrop-blur-md dark:border-white/5 dark:bg-[#0c1810]/95">
      <div className="container-pb flex min-h-11 items-center gap-1.5">
        <nav aria-label="প্রধান ক্যাটাগরি নেভিগেশন" className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-1">
          {PORTAL_CATEGORIES.map((category) => {
            const tone = toneOf(category.iconGroup)
            const active = isActive(category.id)
            return <Link key={category.id} href={category.href} title={category.label} aria-current={active ? 'page' : undefined}
              className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition sm:text-xs', active ? 'text-white shadow-sm' : 'text-forest-900/80 hover:bg-forest-50 dark:text-white/80 dark:hover:bg-white/10')}
              style={active ? { backgroundImage: `linear-gradient(135deg, ${tone.from}, ${tone.to})` } : undefined}>
              <CategoryIcon id={category.iconGroup} size={15} variant={active ? 'mono' : 'auto'} strokeWidth={1.85} className="shrink-0" />
              <span className="whitespace-nowrap">{category.shortLabel}</span>
            </Link>
          })}
        </nav>
        <button type="button" aria-label="সার্চ খুলুন" aria-expanded={searchOpen} aria-controls="category-search-panel"
          onClick={() => { setSearchOpen((value) => !value); setAllOpen(false) }}
          className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full transition', searchOpen ? 'bg-forest-800 text-white' : 'text-forest-800 hover:bg-forest-50')}>
          {searchOpen ? <X size={17} /> : <Search size={17} />}
        </button>
        <button type="button" aria-expanded={allOpen} aria-controls="all-category-panel"
          onClick={() => { setAllOpen((value) => !value); setSearchOpen(false) }}
          className={cn('inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1.5 text-[10px] font-bold text-forest-800 transition hover:bg-forest-50 sm:px-2.5 sm:text-xs', allOpen && 'bg-forest-50')}>
          <span className="hidden sm:inline">সব ক্যাটাগরি</span><span className="sm:hidden">সব</span><ChevronDown size={13} className={cn('transition-transform', allOpen && 'rotate-180')} />
        </button>
      </div>

      {searchOpen && <div id="category-search-panel" className="absolute right-3 top-full z-[70] mt-2 w-[min(94vw,34rem)] rounded-2xl border border-black/10 bg-white p-3 shadow-2xl dark:bg-[#122218]">
        <p className="mb-2 text-xs font-semibold text-forest-900 dark:text-white">প্রাণী, উদ্ভিদ, স্থান, সংবাদ বা পোস্ট খুঁজুন</p>
        <SearchBar compact autoFocus placeholder="বাংলা বা English নাম লিখুন…" />
        <div className="mt-2 flex flex-wrap gap-1.5">{['বাঘ', 'Sundarbans', 'শাপলা', 'কাপ্তাই'].map((term) => <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} onClick={closePanels} className="rounded-full bg-forest-50 px-2.5 py-1 text-[10px] text-forest-800 hover:bg-forest-100">{term}</Link>)}</div>
      </div>}

      {allOpen && <div id="all-category-panel" className="absolute left-0 right-0 top-full z-[70] max-h-[min(76vh,46rem)] overflow-y-auto border-b border-black/10 bg-white shadow-2xl dark:bg-[#102017]">
        <div className="container-pb py-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div><h2 className="text-sm font-bold text-forest-900 dark:text-white">সব বিভাগ ও উপবিভাগ</h2><p className="mt-0.5 text-[11px] text-black/50">জীববৈচিত্র্য, প্রকৃতি, ভ্রমণ, গ্রামবাংলা ও সংবাদ</p></div>
            <button onClick={() => setAllOpen(false)} aria-label="ক্যাটাগরি প্যানেল বন্ধ করুন" className="rounded-full p-1.5 text-forest-800 hover:bg-forest-50"><X size={17}/></button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PORTAL_CATEGORIES.map((category) => {
              const tone = toneOf(category.iconGroup)
              return <section key={category.id} className="rounded-xl border border-black/5 p-2.5 dark:border-white/10">
                <Link href={category.href} onClick={closePanels} className="mb-2 flex items-center gap-2 text-xs font-bold text-forest-900 hover:text-forest-700 dark:text-white">
                  <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ backgroundColor: tone.soft }}><CategoryIcon id={category.iconGroup} size={16}/></span>
                  {category.label}
                </Link>
                <div className="flex flex-wrap gap-1">{category.subcategories.map((sub) => <Link key={`${sub.label}-${sub.href}`} href={sub.href} onClick={closePanels} className="rounded-full bg-stone-50 px-2 py-1 text-[10px] leading-tight text-black/65 hover:bg-forest-50 hover:text-forest-900 dark:bg-white/5 dark:text-white/70">{sub.label}</Link>)}</div>
              </section>
            })}
          </div>
          <div className="mt-3 border-t border-black/5 pt-3 dark:border-white/10">
            <p className="mb-2 text-[10px] font-semibold text-black/45">প্রজাতির বিদ্যমান শ্রেণিবিন্যাস</p>
            <div className="flex flex-wrap gap-1.5">{CATEGORIES.map((category) => <Link key={category.id} href={category.route} onClick={closePanels} className="inline-flex items-center gap-1 rounded-full border border-black/5 px-2 py-1 text-[10px] text-forest-800 hover:bg-forest-50"><CategoryIcon id={category.id} size={12}/>{category.label}</Link>)}</div>
          </div>
          <Link href="/categories" onClick={closePanels} className="mt-3 inline-flex rounded-full bg-forest-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-forest-900">সব ক্যাটাগরি পাতা দেখুন →</Link>
        </div>
      </div>}
    </div>
  )
}

export default function CategoryTopBar() {
  return <Suspense fallback={<div className="h-11 border-b border-black/5 bg-white/90" />}><CategoryTopBarInner /></Suspense>
}
