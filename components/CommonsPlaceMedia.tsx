'use client'

import { useEffect, useState } from 'react'
import { PLACE_COMMONS_CATEGORIES } from '@/data/seed/hills-forests'
import SpeciesVideoEmbed, { type VideoEmbed } from '@/components/SpeciesVideoEmbed'

type CommonsFile = {
  title: string
  imageinfo?: Array<{
    url?: string; thumburl?: string; mime?: string; width?: number; height?: number
    extmetadata?: Record<string, { value?: string }>
  }>
}
type PlacePhoto = { url: string; source: string; title: string; credit: string; license: string; licenseUrl: string }
type GalleryState = { photos: PlacePhoto[]; videos: VideoEmbed[]; loading: boolean }

function plain(value?: string) {
  return (value || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' ').replace(/\s+/g, ' ').trim()
}

async function filesFromCommons(category: string, signal: AbortSignal): Promise<CommonsFile[]> {
  const params = new URLSearchParams({
    action: 'query', generator: 'categorymembers', gcmtitle: `Category:${category}`,
    gcmtype: 'file', gcmlimit: '35', prop: 'imageinfo',
    iiprop: 'url|mime|size|extmetadata', iiurlwidth: '900', format: 'json', formatversion: '2', origin: '*',
  })
  try {
    const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
      signal, credentials: 'omit',
    })
    if (!response.ok) return []
    const json = await response.json()
    return (json?.query?.pages || []) as CommonsFile[]
  } catch {
    return []
  }
}

/** Live, attributed Commons gallery: the browser loads directly from Wikimedia; no copy is made. */
export default function CommonsPlaceMedia({ slug, name, existingVideoUrls = [] }: { slug: string; name: string; existingVideoUrls?: string[] }) {
  const categories = PLACE_COMMONS_CATEGORIES[slug]
  const [state, setState] = useState<GalleryState>({ photos: [], videos: [], loading: !!categories?.length })

  useEffect(() => {
    if (!categories?.length) return
    const controller = new AbortController()
    void Promise.all(categories.map((category) => filesFromCommons(category, controller.signal))).then((results) => {
      const files = results.flat()
      const photos: PlacePhoto[] = []
      const videos: VideoEmbed[] = []
      const used = new Set<string>()
      for (const file of files) {
        const info = file.imageinfo?.[0]
        if (!info?.url || used.has(info.url)) continue
        used.add(info.url)
        const metadata = info.extmetadata || {}
        const baseTitle = file.title.replace(/^File:/, '').replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ')
        const title = plain(metadata.ObjectName?.value) || baseTitle || name
        const credit = plain(metadata.Artist?.value || metadata.Credit?.value) || 'অজানা (Wikimedia Commons)'
        const license = plain(metadata.LicenseShortName?.value) || 'Commons মুক্ত লাইসেন্স'
        const licenseUrl = metadata.LicenseUrl?.value || 'https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia'
        const source = `https://commons.wikimedia.org/wiki/${encodeURIComponent(file.title.replace(/ /g, '_'))}`
        if (info.mime?.startsWith('image/') && info.thumburl && !/svg|djvu/i.test(info.mime) && (info.width || 0) >= 500) {
          photos.push({ url: info.thumburl, source, title, credit, license, licenseUrl })
        } else if (/video\//i.test(info.mime || '') && /\.(webm|mp4|ogv|ogg)(?:$|\?)/i.test(info.url) && videos.length < 3 && !existingVideoUrls.includes(info.url)) {
          videos.push({ url: info.url, title: `${name} — ${title}`, credit, license, licenseUrl, sourceUrl: source })
        }
        if (photos.length >= 6 && videos.length >= 3) break
      }
      setState({ photos: photos.slice(0, 6), videos, loading: false })
    }).catch(() => setState({ photos: [], videos: [], loading: false }))
    return () => controller.abort()
  }, [categories, name, existingVideoUrls])

  if (!categories?.length) return null
  const fallback = <aside className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-black/60">
    {state.loading ? 'Wikimedia Commons থেকে ছবির উৎস খোঁজা হচ্ছে… ' : 'এই মুহূর্তে গ্যালারি লোড হয়নি।'}
    {categories.map((category, i) => <span key={category}>{i > 0 && ' · '}<a className="font-semibold text-forest-700 hover:underline" target="_blank" rel="noopener noreferrer" href={`https://commons.wikimedia.org/wiki/Category:${encodeURIComponent(category)}`}>Commons-এ {name}-এর ছবি দেখুন</a></span>)}
  </aside>

  return <>
    {!!state.photos.length ? <section className="card mt-4 overflow-hidden" aria-label={`${name} — Wikimedia Commons-এর ছবি`}>
      <div className="border-b border-black/5 px-5 py-3">
        <h2 className="font-display text-base font-bold text-forest-900">আরও ছবি <span className="text-xs font-normal text-black/45">· Wikimedia Commons</span></h2>
        <p className="mt-1 text-[11px] text-black/50">ছবিগুলো মুক্ত-লাইসেন্স উৎস থেকে সরাসরি দেখানো হচ্ছে; প্রতিটি ছবির সঙ্গে আলাদা লেখক, লাইসেন্স ও মূল উৎস যুক্ত আছে।</p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
        {state.photos.map((photo) => <figure key={photo.source} className="overflow-hidden rounded-xl border border-black/5 bg-white">
          <a href={photo.source} target="_blank" rel="noopener noreferrer" className="block" aria-label={`${photo.title} — Commons-এ দেখুন`}>
            <img src={photo.url} alt={`${name} — ${photo.title}`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </a>
          <figcaption className="p-2 text-[10px] leading-relaxed text-black/55">
            <span className="block truncate font-semibold text-black/75">{photo.title}</span>
            <span className="block truncate">ছবি: {photo.credit}</span>
            <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-forest-700 hover:underline">লাইসেন্স: {photo.license}</a>
            {' · '}<a href={photo.source} target="_blank" rel="noopener noreferrer" className="text-forest-700 hover:underline">উৎস</a>
          </figcaption>
        </figure>)}
      </div>
    </section> : fallback}
    {!!state.videos.length && <SpeciesVideoEmbed videos={state.videos} />}
  </>
}
