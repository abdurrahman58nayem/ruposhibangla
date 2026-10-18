'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Expand, Images, X } from 'lucide-react'
import SmartImage from './SmartImage'
import { cn, toBn } from '@/lib/utils'

/** গ্যালারির একটি ছবি — ক্রেডিট/লাইসেন্স থাকলে ছবির নিচে সূত্রসহ দেখানো হয় */
export type GalleryItem = {
  src: string
  caption?: string
  credit?: string
  creditUrl?: string
  license?: string
  licenseUrl?: string
  sourceUrl?: string
  /** সতর্কতা/ব্যাখ্যামূলক নোট (যেমন লাইসেন্স যাচাই বাকি) */
  note?: string
  noteTone?: 'amber' | 'plain'
  /** লাইসেন্স যাচাইকৃত ছবি হলে সবুজ নিশ্চিতকরণ দেখায় */
  licenseVerified?: boolean
  /** Pexels ছবির ক্ষেত্রে অতিরিক্ত সূত্র-লাইন লাগে */
  pexels?: boolean
  /** /credits পাতার লিংক দেখাবে কি না */
  creditsLink?: boolean
}

function Attribution({ item }: { item: GalleryItem }) {
  const hasMeta = item.caption || item.credit || item.license || item.sourceUrl || item.note
  if (!hasMeta && !item.licenseVerified) return null
  return (
    <div className="mt-1.5 text-[11px] leading-relaxed text-black/50">
      {item.caption && <p className="text-xs font-medium text-black/70">{item.caption}</p>}
      {(item.licenseVerified || item.credit || item.license || item.sourceUrl) && (
        <p>
          {item.licenseVerified && <span className="font-semibold text-emerald-800">ছবির লাইসেন্স যাচাইকৃত ✓</span>}
          {item.credit && (
            <>
              {item.licenseVerified ? ' · ' : ''}ক্রেডিট:{' '}
              {item.creditUrl || item.sourceUrl ? (
                <a href={item.creditUrl || item.sourceUrl} target="_blank" rel="noreferrer" className="font-medium text-forest-700 hover:underline">
                  {item.credit}
                </a>
              ) : (
                item.credit
              )}
            </>
          )}
          {item.license && (
            <>
              {' · '}লাইসেন্স:{' '}
              {item.licenseUrl ? (
                <a href={item.licenseUrl} target="_blank" rel="noreferrer" className="font-medium text-forest-700 hover:underline">
                  {item.license}
                </a>
              ) : (
                item.license
              )}
            </>
          )}
          {item.sourceUrl && (
            <>
              {' · '}
              <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="font-medium text-forest-700 hover:underline">
                মূল উৎস
              </a>
            </>
          )}
          {item.creditsLink && (
            <>
              {' · '}
              <Link href="/credits" className="font-medium text-forest-700 hover:underline">
                মিডিয়া ক্রেডিট তালিকা
              </Link>
            </>
          )}
        </p>
      )}
      {item.note && (
        <p className={item.noteTone === 'amber' ? 'text-amber-800' : undefined}>
          {item.noteTone === 'amber' && <span className="font-semibold">ছবির লাইসেন্স যাচাই বাকি: </span>}
          {item.note}
        </p>
      )}
      {item.pexels && (
        <p>
          <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-forest-700 hover:underline">
            Photos provided by Pexels
          </a>
        </p>
      )}
    </div>
  )
}

/**
 * প্রজাতির একীভূত ছবির গ্যালারি — প্রধান ছবি + গ্যালারির ছবি + যাচাইকৃত মিডিয়া ছবি
 * একই জায়গায়: বড় ছবি, নিচে থাম্বনেইল, চাপলে পূর্ণ পর্দায় (লাইটবক্স)।
 */
export default function SpeciesGallery({
  items,
  name,
  fallbackKind = 'prani',
}: {
  items: GalleryItem[]
  name: string
  fallbackKind?: 'prani' | 'udbhid' | 'sthan' | 'sahitto'
}) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const touchX = useRef<number | null>(null)
  const swiped = useRef(false)
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])

  const count = items.length
  const current = items[active] as GalleryItem | undefined

  const go = useCallback(
    (dir: 1 | -1) => {
      if (count < 2) return
      setActive((i) => (i + dir + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, go])

  useEffect(() => {
    thumbRefs.current[active]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }, [active])

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null
    swiped.current = false
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || count < 2) return
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current
    if (Math.abs(dx) > 42) {
      swiped.current = true
      go(dx < 0 ? 1 : -1)
    }
    touchX.current = null
  }

  return (
    <div>
      <div
        className="relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={() => {
            if (swiped.current) { swiped.current = false; return }
            if (current) setLightbox(true)
          }}
          aria-label={current ? `${name} — ছবি বড় করে দেখুন` : name}
          className="block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest-600"
        >
          <SmartImage
            src={current?.src}
            alt={current?.caption ? `${name} — ${current.caption}` : name}
            fallbackLabel={name}
            fallbackKind={fallbackKind}
            width={900}
            height={640}
            priority={active === 0}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="aspect-[3/2] w-full rounded-2xl"
          />
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="আগের ছবি"
              className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="পরের ছবি"
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              <Images size={12} /> {toBn(active + 1)}/{toBn(count)}
            </span>
          </>
        )}

        {current && (
          <span className="pointer-events-none absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white backdrop-blur" aria-hidden="true">
            <Expand size={15} />
          </span>
        )}
      </div>

      {current && <Attribution item={current} />}

      {count > 1 && (
        <div className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label={`${name} — সব ছবি`}>
          {items.map((item, i) => (
            <button
              key={`${item.src}-${i}`}
              ref={(el) => { thumbRefs.current[i] = el }}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`ছবি ${toBn(i + 1)}${item.caption ? ` — ${item.caption}` : ''}`}
              onClick={() => setActive(i)}
              className={cn(
                'w-20 shrink-0 overflow-hidden rounded-xl transition sm:w-24',
                i === active ? 'ring-2 ring-forest-600 ring-offset-1' : 'opacity-75 hover:opacity-100',
              )}
            >
              <SmartImage
                src={item.src}
                alt=""
                fallbackLabel={name}
                fallbackKind={fallbackKind}
                width={192}
                height={144}
                sizes="96px"
                className="aspect-[4/3] w-full"
              />
            </button>
          ))}
        </div>
      )}

      {count > 1 && (
        <p className="mt-1 text-[11px] text-black/45">মোট {toBn(count)}টি ছবি — থাম্বনেইলে চাপলে বড় ছবি বদলে যাবে, বড় ছবিতে চাপলে পূর্ণ পর্দায় দেখা যাবে।</p>
      )}

      {lightbox && current && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} ছবির বড় দৃশ্য`}
          onClick={() => setLightbox(false)}
        >
          <button type="button" onClick={() => setLightbox(false)} aria-label="ছবি বন্ধ করুন" className="absolute right-3 top-3 z-10 rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
            <X size={22} />
          </button>
          {count > 1 && (
            <button type="button" onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="আগের ছবি" className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 sm:left-6">
              <ChevronLeft size={24} />
            </button>
          )}
          <figure className="max-h-full w-full max-w-5xl overflow-y-auto rounded-xl bg-white dark:bg-[#102017]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.caption ? `${name} — ${current.caption}` : name}
              className="max-h-[72vh] w-full bg-black object-contain"
              referrerPolicy="no-referrer"
            />
            <figcaption className="p-3">
              <p className="text-xs font-semibold text-forest-900 dark:text-white">
                {name} <span className="font-normal text-black/45">· ছবি {toBn(active + 1)}/{toBn(count)}</span>
              </p>
              <Attribution item={current} />
            </figcaption>
          </figure>
          {count > 1 && (
            <button type="button" onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="পরের ছবি" className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 sm:right-6">
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
