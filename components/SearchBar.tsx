'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight } from 'lucide-react'
import SmartImage from '@/components/SmartImage'

type Hit = { title: string; href: string; type: string; image?: string; imageKind?: 'prani' | 'udbhid' | 'sthan' | 'sahitto' | 'gram' }

export default function SearchBar({
  placeholder = 'দোয়েল, বাংলার বাঘ, শাপলা — যেকোনো কিছু খুঁজুন…',
  compact = false,
  autoFocus = false,
}: { placeholder?: string; compact?: boolean; autoFocus?: boolean }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<Hit[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const term = q.trim()
    if (term.length < 2) {
      setHits([])
      setOpen(false)
      setLoading(false)
      setSearched(false)
      return
    }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(term)}`, { signal: controller.signal })
        if (!res.ok) throw new Error('suggestions unavailable')
        const data = (await res.json()) as { hits?: Hit[] }
        if (!controller.signal.aborted) {
          setHits(data.hits || [])
          setOpen(true)
          setSearched(true)
        }
      } catch {
        if (!controller.signal.aborted) { setHits([]); setSearched(true); setOpen(true) }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 180)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [q])

  const goToResults = () => {
    if (!q.trim()) return
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return <div className="relative">
    <form onSubmit={(event) => { event.preventDefault(); goToResults() }} className={`flex items-center gap-2 rounded-full border border-black/10 bg-white ${compact ? 'p-1 shadow-sm' : 'p-1.5 shadow-lg'}`} role="search">
      <Search size={compact ? 16 : 18} className="ml-2 shrink-0 text-black/40" aria-hidden="true" />
      <input value={q} onChange={(event) => setQ(event.target.value)} onFocus={() => { if (q.trim().length >= 2) setOpen(true) }}
        onBlur={() => window.setTimeout(() => setOpen(false), 160)} autoFocus={autoFocus} aria-label="প্রকৃতি ও জীববৈচিত্র্য খুঁজুন"
        placeholder={placeholder} className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/35 ${compact ? 'py-2 text-xs' : 'py-2 text-sm'}`} />
      <button type="submit" className={`btn-primary shrink-0 ${compact ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'}`}>খুঁজুন</button>
    </form>

    {open && (hits.length > 0 || loading || searched) && <div className="absolute left-0 right-0 top-full z-[80] mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
      {loading && <p className="px-4 py-2 text-xs text-black/50">খোঁজা হচ্ছে…</p>}
      {!loading && hits.length > 0 && hits.map((hit) => <button key={`${hit.href}-${hit.title}`} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setOpen(false); router.push(hit.href) }}
        className="flex w-full items-center gap-2.5 border-b border-black/5 px-3 py-2 text-left last:border-0 hover:bg-forest-50">
        <SmartImage src={hit.image} alt="" fallbackLabel="" fallbackKind={hit.imageKind || 'gram'} width={48} height={48} className="h-11 w-11 shrink-0 rounded-lg" />
        <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-forest-900">{hit.title}</span><span className="mt-0.5 block truncate text-[10px] text-black/45">{hit.type}</span></span>
        <ArrowRight size={14} className="shrink-0 text-forest-500" />
      </button>)}
      {!loading && searched && hits.length === 0 && <p className="px-4 py-3 text-xs text-black/55">“{q}” নামে কোনো ফলাফল পাওয়া যায়নি। অন্য বানান দিয়ে চেষ্টা করুন।</p>}
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={goToResults} className="w-full bg-forest-50 px-4 py-2.5 text-left text-xs font-semibold text-forest-800 hover:bg-forest-100">সব ফলাফল দেখুন →</button>
    </div>}
  </div>
}
