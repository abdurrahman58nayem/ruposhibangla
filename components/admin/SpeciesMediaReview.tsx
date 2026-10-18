'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, ExternalLink, Image as ImageIcon, Loader2, RefreshCw, Search, ShieldCheck, Trash2, Video } from 'lucide-react'
import type { SpeciesMedia, SpeciesMediaVerification } from '@/lib/types'

type SpeciesHit = { slug: string; type: string; nameBn: string; nameEn: string; scientificName: string }
type Candidate = SpeciesMedia & { token: string; eligibleLicense: boolean }
type QueueItem = { species: SpeciesHit; media: SpeciesMedia }
const SOURCES = [
  { id: 'commons', label: 'Wikimedia Commons' }, { id: 'inaturalist', label: 'iNaturalist' },
  { id: 'pexels', label: 'Pexels' }, { id: 'youtube', label: 'YouTube' },
] as const
const STATUS_LABEL: Record<SpeciesMediaVerification, string> = {
  verified: 'যাচাইকৃত', needs_review: 'পর্যালোচনা বাকি', restricted: 'সীমাবদ্ধ', unavailable: 'অপ্রাপ্য',
}
const STATUS_STYLE: Record<SpeciesMediaVerification, string> = {
  verified: 'bg-emerald-50 text-emerald-800', needs_review: 'bg-amber-50 text-amber-900',
  restricted: 'bg-rose-50 text-rose-800', unavailable: 'bg-stone-100 text-stone-600',
}
function identityLabel(media: SpeciesMedia) {
  if (media.identificationBasis === 'research_grade') return 'iNaturalist Research Grade — ছবির মিল হাতে যাচাই হয়নি'
  if (media.identificationBasis === 'exact_taxon') return 'exact taxon search — ছবির মিল হাতে যাচাই হয়নি'
  if (media.identificationBasis === 'manual_confirmed') return 'অ্যাডমিন হাতে নিশ্চিত করেছেন'
  return 'প্রজাতি-পরিচয় যাচাই হয়নি'
}

export default function SpeciesMediaReview() {
  const [query, setQuery] = useState('')
  const [speciesHits, setSpeciesHits] = useState<SpeciesHit[]>([])
  const [species, setSpecies] = useState<SpeciesHit | null>(null)
  const [source, setSource] = useState<(typeof SOURCES)[number]['id']>('commons')
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [searchNote, setSearchNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [queueStatus, setQueueStatus] = useState<SpeciesMediaVerification>('needs_review')
  const [actionBusy, setActionBusy] = useState('')

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) { setSpeciesHits([]); return }
    const timer = window.setTimeout(async () => {
      const res = await fetch(`/api/admin/species-media?mode=species&q=${encodeURIComponent(query.trim())}`)
      const data = await res.json().catch(() => ({}))
      setSpeciesHits(res.ok ? data.items || [] : [])
    }, 250)
    return () => window.clearTimeout(timer)
  }, [query])

  const loadQueue = useCallback(async (status = queueStatus) => {
    const res = await fetch(`/api/admin/species-media?mode=queue&status=${status}`, { cache: 'no-store' })
    const data = await res.json().catch(() => ({}))
    setQueue(res.ok ? data.items || [] : [])
  }, [queueStatus])
  useEffect(() => { void loadQueue(queueStatus) }, [loadQueue, queueStatus])

  async function searchSource() {
    if (!species) return
    setBusy(true); setSearchNote(''); setCandidates([])
    try {
      const res = await fetch(`/api/admin/species-media?slug=${encodeURIComponent(species.slug)}&source=${source}`, { cache: 'no-store' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'অনুসন্ধান করা যায়নি।')
      setCandidates(data.items || [])
      const quota = data.pexelsRateLimit?.remaining ? ` · Pexels remaining: ${data.pexelsRateLimit.remaining}/${data.pexelsRateLimit.limit || '—'} requests` : ''
      setSearchNote(data.warning || `${data.total || 0}টি ফল · অনুসন্ধান: ${data.query || species.scientificName} · metadata সর্বোচ্চ ১৫ মিনিট cache হয়${quota}।`)
    } catch (error) {
      setSearchNote(error instanceof Error ? error.message : 'অনুসন্ধান ব্যর্থ।')
    } finally { setBusy(false) }
  }

  async function mutate(body: Record<string, unknown>, busyKey: string) {
    setActionBusy(busyKey)
    try {
      const res = await fetch('/api/admin/species-media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.ok === false) throw new Error(data.error || 'পরিবর্তন সংরক্ষণ করা যায়নি।')
      await loadQueue(queueStatus)
      return data
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'অনুরোধ ব্যর্থ।')
      return null
    } finally { setActionBusy('') }
  }

  function chooseSpecies(item: SpeciesHit) {
    setSpecies(item); setQuery(`${item.nameBn} — ${item.scientificName}`); setSpeciesHits([]); setCandidates([]); setSearchNote('')
  }
  function labelFor(id: string) { return SOURCES.find((item) => item.id === id)?.label || id }
  function identityOf(media: SpeciesMedia) { return media.mediaId || media.sourceId || media.sourceUrl || media.url }
  function videoPreview(media: SpeciesMedia) {
    if (media.poster) return media.poster
    const youtube = media.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
    return youtube ? `https://i.ytimg.com/vi/${youtube[1]}/mqdefault.jpg` : ''
  }
  return <div className="space-y-5">
    <header>
      <h2 className="text-lg font-bold text-forest-900">প্রজাতির মিডিয়া ও লাইসেন্স ব্যবস্থাপনা</h2>
      <p className="mt-1 max-w-3xl text-xs leading-relaxed text-black/55">বৈজ্ঞানিক নাম দিয়ে বাহ্যিক উৎসে খুঁজুন। API ফল কখনো সরাসরি প্রকাশ হয় না—প্রজাতি, লাইসেন্স ও attribution হাতে যাচাই করে অনুমোদন করতে হবে। কোনো ছবি/ভিডিও নিজস্ব storage-এ কপি করা হয় না।</p>
    </header>

    <section className="card p-4 sm:p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest-900"><Search size={16}/> উৎসে মিডিয়া খুঁজুন</h3>
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_12rem_auto]">
        <div className="relative">
          <input value={query} onChange={(event) => { setQuery(event.target.value); setSpecies(null); setCandidates([]); setSearchNote('') }} placeholder="বাংলা নাম বা বৈজ্ঞানিক নাম লিখুন…" className="field" aria-label="প্রজাতির নাম দিয়ে খুঁজুন" />
          {!!speciesHits.length && <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-xl">
            {speciesHits.map((item) => <button type="button" key={item.slug} onClick={() => chooseSpecies(item)} className="block w-full border-b border-black/5 px-3 py-2 text-left hover:bg-forest-50">
              <span className="block text-sm font-semibold text-forest-900">{item.nameBn} <span className="text-[10px] text-black/40">{item.type}</span></span>
              <span className="block text-xs italic text-black/55">{item.scientificName} · {item.nameEn}</span>
            </button>)}
          </div>}
        </div>
        <select value={source} onChange={(event) => setSource(event.target.value as typeof source)} className="field" aria-label="মিডিয়ার উৎস">
          {SOURCES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <button type="button" disabled={!species || busy} onClick={searchSource} className="btn-primary justify-center disabled:opacity-50">
          {busy ? <Loader2 size={15} className="animate-spin"/> : <Search size={15}/>} খুঁজুন
        </button>
      </div>
      {species && <p className="mt-2 text-[11px] text-forest-800">বৈজ্ঞানিক নামকে অগ্রাধিকার: <i>{species.scientificName}</i> · ফল: {species.nameBn}</p>}
      {searchNote && <p className="mt-3 rounded-lg bg-stone-50 p-2.5 text-xs text-black/65">{searchNote}</p>}
      {(source === 'pexels' || source === 'youtube') && <p className="mt-2 text-[10px] text-black/45">{source === 'pexels' ? 'Pexels অনুসন্ধানের জন্য সার্ভারে PEXELS_API_KEY প্রয়োজন। Pexels API ব্যবহৃত হলে Pexels-এর prominent link ও photographer credit দেখানো হবে।' : 'YouTube অনুসন্ধানের জন্য সার্ভারে YOUTUBE_API_KEY প্রয়োজন। শুধু public ও embeddable ভিডিও দেখানো হয়; embed অনুমতি পুনঃব্যবহারের লাইসেন্স নয়।'}</p>}
    </section>

    {!!candidates.length && <section>
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2"><div><h3 className="text-sm font-bold text-forest-900">অনুসন্ধানের ফল ({candidates.length})</h3><p className="text-[10px] text-black/45">সব ফল আগে Needs review/Restricted-এ যায়; অনুমোদনের আগে public species page-এ দেখাবে না।</p></div>
        {source === 'pexels' && <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-forest-700 underline">Photos and videos provided by Pexels ↗</a>}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
        {candidates.map((media) => <article key={media.mediaId} className="overflow-hidden rounded-xl border border-black/10 bg-white">
          <div className="relative aspect-[4/3] bg-stone-100">
            {media.kind === 'image' ? <img src={media.directMediaUrl || media.url} alt={media.title || media.caption || species?.nameBn || 'মিডিয়া preview'} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
              : videoPreview(media) ? <img src={videoPreview(media)} alt={`${media.title || 'ভিডিও'} preview`} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                : <div className="grid h-full place-items-center text-forest-700"><Video size={28}/></div>}
            <span className={`absolute left-1.5 top-1.5 rounded-full px-2 py-1 text-[9px] font-bold ${STATUS_STYLE[media.verificationStatus || 'needs_review']}`}>{media.eligibleLicense ? 'Needs review' : 'Restricted'}</span>
            <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/65 px-1.5 py-1 text-[9px] text-white">{media.kind === 'image' ? 'ছবি' : 'ভিডিও'}</span>
          </div>
          <div className="space-y-1.5 p-2.5">
            <p className="line-clamp-2 min-h-8 text-[11px] font-semibold text-black/80">{media.title || media.caption}</p>
            <p className="truncate text-[10px] text-black/55">{media.creator || media.credit || 'নির্মাতা অজানা'}</p>
            <p className="line-clamp-2 min-h-7 text-[10px] text-black/45">লাইসেন্স: {media.license || 'উল্লেখ নেই'}</p>
            <p className="text-[9px] text-black/45">বাণিজ্যিক ব্যবহার: {media.commercialUse === null || media.commercialUse === undefined ? 'অনির্দিষ্ট' : media.commercialUse ? 'অনুমোদিত' : 'নিষিদ্ধ'} · {identityLabel(media)}</p>
            <div className="flex items-center justify-between gap-1 text-[10px]">
              <a href={media.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-w-0 items-center gap-1 truncate font-semibold text-forest-700 hover:underline"><ExternalLink size={11}/>মূল উৎস</a>
              <span className="shrink-0 text-black/40">{labelFor(media.sourcePlatform || source)}</span>
            </div>
            <button type="button" disabled={actionBusy === `queue:${media.mediaId}`} onClick={() => void mutate({ action: 'queue', slug: species?.slug, token: media.token }, `queue:${media.mediaId}`)} className="btn-soft w-full justify-center px-2 py-1.5 text-[10px] disabled:opacity-50">
              {actionBusy === `queue:${media.mediaId}` ? <Loader2 size={12} className="animate-spin"/> : <Check size={12}/>} পর্যালোচনায় যোগ
            </button>
          </div>
        </article>)}
      </div>
    </section>}

    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 p-4">
        <div><h3 className="text-sm font-bold text-forest-900">লাইসেন্স ও পরিচয় যাচাই-সারি</h3><p className="mt-0.5 text-[10px] text-black/45">শুধু Verified মিডিয়া public gallery-তে যায়; প্রত্যেক অনুমোদনে দুইটি স্পষ্ট মানব-নিশ্চিতকরণ লাগে।</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={queueStatus} onChange={(event) => setQueueStatus(event.target.value as SpeciesMediaVerification)} className="field w-auto py-1.5 text-xs">
            {(['needs_review', 'verified', 'restricted', 'unavailable'] as SpeciesMediaVerification[]).map((status) => <option key={status} value={status}>{STATUS_LABEL[status]}</option>)}
          </select>
          <button type="button" onClick={() => void loadQueue(queueStatus)} className="btn-outline px-2.5 py-1.5 text-xs"><RefreshCw size={13}/> রিফ্রেশ</button>
        </div>
      </div>
      {!queue.length ? <p className="p-8 text-center text-xs text-black/45">এই অবস্থায় কোনো প্রজাতির মিডিয়া নেই।</p> : <div className="divide-y divide-black/5">
        {queue.map(({ species: sp, media }) => <ReviewRow key={`${sp.slug}:${identityOf(media)}`} species={sp} media={media} busyKey={actionBusy} onAction={mutate} />)}
      </div>}
    </section>

    <footer className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-[11px] leading-relaxed text-amber-950">
      <b>লাইসেন্স সতর্কতা:</b> CC BY-SA হলে attribution-এর পাশাপাশি share-alike শর্ত মানতে হবে। CC BY-NC এই অনুমোদন তালিকায় নেই; বাণিজ্যিক অধিকার নিশ্চিত নয়। YouTube Standard License কেবল player-এ embed দেখানোর অনুমতি, পুনঃপ্রকাশ/ডাউনলোড নয়। API key কেবল server environment-এ থাকবে।
      {' '}<a href="/admin/species-media#source-docs" className="font-semibold underline">উৎস ও নীতিমালা</a>
      <span id="source-docs" className="mt-2 block">মাধ্যমের নথি: <a className="underline" href="https://commons.wikimedia.org/wiki/Commons:API/MediaWiki" target="_blank" rel="noopener noreferrer">Commons API</a> · <a className="underline" href="https://api.inaturalist.org/v1/docs/" target="_blank" rel="noopener noreferrer">iNaturalist API</a> · <a className="underline" href="https://www.pexels.com/api/documentation/" target="_blank" rel="noopener noreferrer">Pexels API</a> · <a className="underline" href="https://developers.google.com/youtube/data/reference/rest/v3/search/list" target="_blank" rel="noopener noreferrer">YouTube Data API</a> · <a className="underline" href="https://developers.google.com/youtube/iframe_api_reference" target="_blank" rel="noopener noreferrer">YouTube embeds</a></span>
    </footer>
  </div>
}

function ReviewRow({ species, media, busyKey, onAction }: {
  species: SpeciesHit; media: SpeciesMedia; busyKey: string; onAction: (body: Record<string, unknown>, key: string) => Promise<any>
}) {
  const [confirmSpecies, setConfirmSpecies] = useState(false)
  const [confirmLicense, setConfirmLicense] = useState(false)
  const [note, setNote] = useState('')
  const id = media.mediaId || `${media.sourcePlatform || 'legacy'}:${media.sourceId || media.sourceUrl || media.url}`
  const busy = busyKey === `${media.verificationStatus}:${id}` || busyKey === `verify:${id}` || busyKey === `remove:${id}` || busyKey === `restrict:${id}` || busyKey === `unavailable:${id}` || busyKey === `recheck:${id}` || busyKey === `check:${id}`
  const thumbnail = media.kind === 'image' ? media.directMediaUrl || media.url : media.poster
  return <article className="grid gap-3 p-3 sm:grid-cols-[96px_minmax(0,1fr)_minmax(250px,0.85fr)] sm:items-start sm:p-4">
    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-stone-100 sm:w-24">
      {thumbnail ? <img src={thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center text-forest-700">{media.kind === 'image' ? <ImageIcon/> : <Video/>}</div>}
    </div>
    <div className="min-w-0">
      <div className="mb-1 flex flex-wrap items-center gap-2"><a href={`${species.type === 'udbhid' ? '/udbhid' : species.type === 'prani' ? '/prani' : '/sthan'}/${species.slug}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-forest-900 hover:underline">{species.nameBn}</a><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${STATUS_STYLE[media.verificationStatus || 'needs_review']}`}>{STATUS_LABEL[media.verificationStatus || 'needs_review']}</span></div>
      <p className="text-[10px] italic text-black/50">{species.scientificName}</p>
      <p className="mt-1 line-clamp-2 text-xs font-semibold text-black/75">{media.title || media.caption}</p>
      <p className="mt-1 text-[10px] text-black/55">নির্মাতা: {media.creator || media.credit || 'অজানা'} · উৎস: {media.sourcePlatform || 'legacy'}</p>
      <p className="text-[10px] text-black/55">লাইসেন্স: {media.license || 'উল্লেখ নেই'} · commercial-use: {media.commercialUse === null || media.commercialUse === undefined ? 'অনির্দিষ্ট' : media.commercialUse ? 'হ্যাঁ' : 'না'} · modification: {media.modificationPermission === null || media.modificationPermission === undefined ? 'অনির্দিষ্ট' : media.modificationPermission ? 'হ্যাঁ' : 'না'}</p>
      <p className="text-[10px] text-black/45">পরিচয় অবস্থা: {identityLabel(media)}{media.identificationConfidence !== undefined ? ` · confidence ${media.identificationConfidence}%` : ''}</p>
      {media.verificationNote && <p className="mt-1 text-[10px] text-amber-800">{media.verificationNote}</p>}
      <div className="mt-1 flex flex-wrap gap-2 text-[10px]">
        {media.creatorUrl && <a href={media.creatorUrl} target="_blank" rel="noopener noreferrer" className="text-forest-700 underline">নির্মাতার পাতা</a>}
        {media.licenseUrl && <a href={media.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-forest-700 underline">লাইসেন্স</a>}
        {media.sourceUrl && <a href={media.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-forest-700 underline">মূল উৎস</a>}
        {media.lastVerifiedAt && <span className="text-black/40">Verified: {new Date(media.lastVerifiedAt).toLocaleDateString('bn-BD')}</span>}
        {media.lastReviewedAt && <span className="text-black/40">পর্যালোচনা: {new Date(media.lastReviewedAt).toLocaleDateString('bn-BD')}</span>}
        {media.lastCheckedAt && <span className="text-black/40">URL পরীক্ষা: {new Date(media.lastCheckedAt).toLocaleDateString('bn-BD')}</span>}
      </div>
    </div>
    <div className="space-y-2 rounded-lg bg-stone-50 p-2.5">
      {media.verificationStatus === 'needs_review' && <>
        <label className="flex items-start gap-2 text-[10px] leading-relaxed text-black/70"><input type="checkbox" className="mt-0.5" checked={confirmSpecies} onChange={(event) => setConfirmSpecies(event.target.checked)}/>আমি ছবি/ভিডিওর দৃশ্য দেখে নিশ্চিত—এটি <i>{species.scientificName}</i> প্রজাতিই।</label>
        <label className="flex items-start gap-2 text-[10px] leading-relaxed text-black/70"><input type="checkbox" className="mt-0.5" checked={confirmLicense} onChange={(event) => setConfirmLicense(event.target.checked)}/>মূল উৎস ও license terms যাচাই করেছি; এই ব্যবহারে প্রকাশের অনুমতি আছে।</label>
        <button type="button" disabled={!confirmSpecies || !confirmLicense || busy} onClick={() => void onAction({ action: 'verify', slug: species.slug, mediaId: id, confirmSpecies, confirmLicense }, `verify:${id}`)} className="btn-primary w-full justify-center px-2 py-1.5 text-[10px] disabled:opacity-40"><ShieldCheck size={12}/> যাচাই করে প্রকাশ</button>
      </>}
      {media.sourcePlatform !== 'youtube' && <button type="button" disabled={busy} onClick={() => void onAction({ action: 'check', slug: species.slug, mediaId: id }, `check:${id}`)} className="btn-outline w-full justify-center px-2 py-1.5 text-[10px] disabled:opacity-40">URL/404 পরীক্ষা</button>}
      {(media.verificationStatus === 'needs_review' || media.verificationStatus === 'verified') && <button type="button" disabled={busy} onClick={() => void onAction({ action: 'recheck', slug: species.slug, mediaId: id }, `recheck:${id}`)} className="btn-outline w-full justify-center px-2 py-1.5 text-[10px] disabled:opacity-40"><RefreshCw size={12}/> লাইসেন্স পুনরায় যাচাই</button>}
      {media.verificationStatus !== 'unavailable' && <button type="button" disabled={busy} onClick={() => void onAction({ action: 'unavailable', slug: species.slug, mediaId: id, note: note || 'উৎসটি সরিয়ে ফেলা হয়েছে বা আর লোড হয় না।' }, `unavailable:${id}`)} className="btn-outline w-full justify-center px-2 py-1.5 text-[10px] disabled:opacity-40">অপ্রাপ্য চিহ্নিত</button>}
      {media.verificationStatus !== 'restricted' && <button type="button" disabled={busy} onClick={() => void onAction({ action: 'restrict', slug: species.slug, mediaId: id, note: note || 'অধিকার/প্রজাতি-পরিচয় যথেষ্ট নিশ্চিত নয়।' }, `restrict:${id}`)} className="btn-outline w-full justify-center px-2 py-1.5 text-[10px] disabled:opacity-40">সীমাবদ্ধ করুন</button>}
      <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="কারণ (ঐচ্ছিক)" className="field py-1 text-[10px]" />
      <button type="button" disabled={busy} onClick={() => { if (window.confirm('এই media record species data থেকে সরাবেন?')) void onAction({ action: 'remove', slug: species.slug, mediaId: id }, `remove:${id}`) }} className="btn-outline w-full justify-center px-2 py-1.5 text-[10px] text-red-700 disabled:opacity-40"><Trash2 size={12}/> বাদ দিন</button>
    </div>
  </article>
}
