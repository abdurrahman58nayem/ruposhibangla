'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react'
import type { SpeciesMedia } from '@/lib/types'

export default function SpeciesMediaGallery({ media, speciesName, scientificName }: { media: SpeciesMedia[]; speciesName: string; scientificName: string }) {
  const images = useMemo(() => {
    const seen = new Set<string>()
    return (media || []).filter((item) => {
      if (item.kind !== 'image' || item.verificationStatus !== 'verified') return false
      const key = (item.directMediaUrl || item.url).trim()
      if (!key || seen.has(key)) return false
      seen.add(key)
      return !!(item.directMediaUrl || item.url) && !!item.sourceUrl && !!item.license && !!item.licenseUrl
    }).slice(0, 12)
  }, [media])
  const [visibleCount, setVisibleCount] = useState(6)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (activeIndex === null) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowRight') setActiveIndex((index) => index === null ? null : (index + 1) % images.length)
      if (event.key === 'ArrowLeft') setActiveIndex((index) => index === null ? null : (index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeIndex, images.length])

  if (!images.length) return null
  const active = activeIndex === null ? null : images[activeIndex]
  const attribution = (item: SpeciesMedia) => <>
    ছবির কৃতিত্ব:{' '}
    <a href={item.creatorUrl || item.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-forest-800 underline decoration-dotted">{item.creator || item.credit || 'মূল নির্মাতা'}</a>
    {' · '}লাইসেন্স: <a href={item.licenseUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-forest-800 underline decoration-dotted">{item.license}</a>
    {' · '}<a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-semibold text-forest-800 underline decoration-dotted">মূল উৎস <ExternalLink size={10}/></a>
  </>

  return <>
    <section className="card mt-4 overflow-hidden" aria-labelledby="species-media-gallery-title">
      <header className="border-b border-black/5 px-4 py-3 sm:px-5">
        <h2 id="species-media-gallery-title" className="font-display text-base font-bold text-forest-900">যাচাইকৃত ছবি <span className="text-xs font-normal text-black/45">· {images.length}টি</span></h2>
        <p className="mt-0.5 text-[11px] text-black/50">{scientificName} — লাইসেন্স ও প্রজাতি-পরিচয় অ্যাডমিন যাচাই করেছেন। ছবিতে চাপলে বড় করে দেখুন।</p>
      </header>
      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:gap-3">
        {images.slice(0, visibleCount).map((item, index) => <figure key={item.mediaId || item.url} className="min-w-0 overflow-hidden rounded-xl border border-black/5 bg-white dark:bg-[#102017]">
          <button type="button" onClick={() => setActiveIndex(index)} className="block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest-600" aria-label={`${speciesName} — ${item.title || item.caption || 'ছবি'} বড় করে দেখুন`}>
            {failedUrls.has(item.mediaId || item.url) ? <span className="grid aspect-[4/3] w-full place-items-center bg-stone-100 p-3 text-center text-xs text-black/55">ছবিটি এখন উৎস থেকে লোড হচ্ছে না — <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-forest-700 underline">মূল উৎস দেখুন</a></span> : <img src={item.directMediaUrl || item.url} alt={`${speciesName} — ${item.title || item.caption || scientificName}`} loading="lazy" referrerPolicy="no-referrer" className="aspect-[4/3] w-full bg-stone-100 object-cover" onError={() => setFailedUrls((current) => new Set(current).add(item.mediaId || item.url))} />}
          </button>
          <figcaption className="p-2 text-[10px] leading-relaxed text-black/55 sm:p-2.5">
            <span className="mb-1 block line-clamp-2 min-h-7 font-semibold text-black/75">{item.title || item.caption || scientificName}</span>
            {attribution(item)}
            {item.sourcePlatform === 'pexels' && <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="mt-1 block font-semibold text-forest-700 underline">Photos provided by Pexels</a>}
          </figcaption>
        </figure>)}
      </div>
      {visibleCount < images.length && <div className="px-3 pb-3 text-center"><button type="button" onClick={() => setVisibleCount((count) => Math.min(12, count + 6))} className="btn-outline justify-center px-4 py-2 text-xs">আরও ছবি দেখুন ({images.length - visibleCount})</button></div>}
    </section>

    {active && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`${speciesName} ছবির বড় দৃশ্য`} onClick={() => setActiveIndex(null)}>
      <button type="button" onClick={() => setActiveIndex(null)} aria-label="ছবি বন্ধ করুন" className="absolute right-3 top-3 z-10 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"><X size={22}/></button>
      {images.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); setActiveIndex((activeIndex! - 1 + images.length) % images.length) }} aria-label="আগের ছবি" className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 sm:left-6"><ChevronLeft size={24}/></button>}
      <figure className="max-h-full w-full max-w-5xl overflow-y-auto rounded-xl bg-white dark:bg-[#102017]" onClick={(event) => event.stopPropagation()}>
        {failedUrls.has(active.mediaId || active.url) ? <div className="grid min-h-64 place-items-center bg-stone-100 p-6 text-center text-sm text-black/60">ছবিটি এখন উৎস থেকে পাওয়া যাচ্ছে না। <a href={active.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-forest-700 underline">মূল উৎসে দেখুন</a></div> : <img src={active.directMediaUrl || active.url} alt={`${speciesName} — ${active.title || scientificName}`} className="max-h-[70vh] w-full bg-black object-contain" referrerPolicy="no-referrer" onError={() => setFailedUrls((current) => new Set(current).add(active.mediaId || active.url))} />}
        <figcaption className="p-3 text-xs leading-relaxed text-black/65 dark:text-white/75">
          <p className="mb-1 font-semibold text-forest-900 dark:text-white">{active.title || active.caption || scientificName}</p>
          {attribution(active)}
          {active.sourcePlatform === 'pexels' && <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="mt-1 block font-semibold text-forest-700 underline">Photos provided by Pexels</a>}
        </figcaption>
      </figure>
      {images.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); setActiveIndex((activeIndex! + 1) % images.length) }} aria-label="পরের ছবি" className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 sm:right-6"><ChevronRight size={24}/></button>}
    </div>}
  </>
}
