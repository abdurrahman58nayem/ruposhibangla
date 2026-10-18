import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { Species, SpeciesMedia, SpeciesMediaPlatform } from '@/lib/types'

export type DiscoveredMedia = SpeciesMedia & { token: string; eligibleLicense: boolean }
type CandidatePayload = { speciesSlug: string; media: SpeciesMedia; exp: number }
type CacheEntry = { expiresAt: number; media: SpeciesMedia[] }
type ExtValue = { value?: string }
type CommonsFile = {
  title?: string
  imageinfo?: Array<{
    url?: string; thumburl?: string; descriptionurl?: string; mime?: string; width?: number; extmetadata?: Record<string, ExtValue>
  }>
}

const TTL_MS = 15 * 60 * 1000
const TOKEN_TTL_MS = 20 * 60 * 1000
const cacheHost = globalThis as typeof globalThis & {
  __pbSpeciesMediaCache?: Map<string, CacheEntry>
  __pbPexelsLimit?: { limit?: string; remaining?: string; reset?: string }
}
const resultCache = cacheHost.__pbSpeciesMediaCache ||= new Map<string, CacheEntry>()
let commonsActive = 0
const commonsWaiters: Array<() => void> = []
async function withCommonsSlot<T>(run: () => Promise<T>): Promise<T> {
  if (commonsActive >= 3) await new Promise<void>((resolve) => commonsWaiters.push(resolve))
  commonsActive += 1
  try { return await run() }
  finally { commonsActive -= 1; commonsWaiters.shift()?.() }
}
export function getPexelsRateLimit() { return cacheHost.__pbPexelsLimit || null }
const LICENSES = new Set([
  'cc0', 'public domain',
  'cc by 1.0', 'cc by 2.0', 'cc by 2.5', 'cc by 3.0', 'cc by 4.0',
  'cc by-sa 1.0', 'cc by-sa 2.0', 'cc by-sa 2.5', 'cc by-sa 3.0', 'cc by-sa 4.0',
])

function secret() {
  return process.env.MEDIA_REVIEW_SECRET || process.env.AUTH_SECRET || 'prakriti-bangla-dev-secret-change-me'
}
function normalizeLicense(v = '') { return v.replace(/\s+/g, ' ').trim().toLowerCase() }
function isOpenLicense(v = '') { return LICENSES.has(normalizeLicense(v)) }
function safeHttps(value: unknown, hosts: string[]): string | undefined {
  if (typeof value !== 'string' || value.length > 2500) return
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || !hosts.includes(url.hostname.toLowerCase())) return
    return url.toString()
  } catch { return }
}
function stripHtml(value = '') {
  return value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/\s+/g, ' ').trim().slice(0, 500)
}
function licenseUrlFor(license: string, supplied?: string) {
  const commons = safeHttps(supplied, ['creativecommons.org', 'www.creativecommons.org', 'commons.wikimedia.org'])
  if (commons) return commons
  const code = normalizeLicense(license)
  if (code === 'cc0') return 'https://creativecommons.org/publicdomain/zero/1.0/'
  if (code === 'public domain') return 'https://commons.wikimedia.org/wiki/Commons:Public_domain'
  const match = code.match(/cc by(-sa)? (1\.0|2\.0|2\.5|3\.0|4\.0)/)
  if (match) return `https://creativecommons.org/licenses/by${match[1] || ''}/${match[2]}/`
  return undefined
}
function hashId(platform: SpeciesMediaPlatform, sourceId: string) {
  return `${platform}:${createHash('sha256').update(sourceId).digest('hex').slice(0, 28)}`
}
function buildMedia(platform: SpeciesMediaPlatform, slug: string, sci: string, sourceId: string, kind: 'image' | 'video', url: string, sourceUrl: string, title: string, creator: string, creatorUrl: string | undefined, license: string, licenseUrl: string | undefined, extras: Partial<SpeciesMedia> = {}): SpeciesMedia {
  const accepted = isOpenLicense(license) || (platform === 'pexels' && license === 'Pexels License')
  const byNc = /by-nc|non.?commercial/i.test(license)
  const noDerivatives = /by-nd|no.?derivatives/i.test(license)
  const author = creator || 'নির্মাতার নাম উৎসে দেওয়া নেই'
  return {
    mediaId: hashId(platform, sourceId), sourceId, sourcePlatform: platform,
    url, directMediaUrl: url, kind, title, caption: title, credit: author, creator: author,
    creatorUrl, sourceUrl, license, licenseUrl: licenseUrl || licenseUrlFor(license),
    attributionText: `${author} · ${license} · ${sourceUrl}`,
    commercialUse: accepted ? !byNc : null,
    modificationPermission: accepted ? !noDerivatives : null,
    scientificName: sci, identificationConfidence: undefined,
    identificationBasis: platform === 'inaturalist' ? 'research_grade' : 'unverified',
    verificationStatus: accepted ? 'needs_review' : 'restricted',
    verificationNote: accepted
      ? 'উৎসের লাইসেন্স গ্রহণযোগ্য; প্রজাতির ছবি/ভিডিও ম্যানুয়ালি মিলিয়ে অনুমোদন প্রয়োজন।'
      : 'লাইসেন্স বা পুনঃব্যবহারের অধিকার এই সাইটের স্বয়ংক্রিয় প্রকাশের জন্য যাচাই হয়নি।',
    ...extras,
  }
}
export function isSpeciesMediaLicenseAllowed(media: SpeciesMedia) {
  const accepted = isOpenLicense(media.license || '') || (media.sourcePlatform === 'pexels' && media.license === 'Pexels License')
  if (media.sourcePlatform === 'youtube') return { ok: true, note: 'শুধু উৎসের embed; ভিডিও ডাউনলোড/পুনঃপ্রকাশের অনুমতি নয়।' }
  return { ok: accepted, note: accepted ? '' : 'লাইসেন্স অনুমোদিত তালিকায় নেই বা অনুপস্থিত।' }
}
function signCandidate(speciesSlug: string, media: SpeciesMedia) {
  const payload: CandidatePayload = { speciesSlug, media, exp: Date.now() + TOKEN_TTL_MS }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', secret()).update(encoded).digest('base64url')
  return `${encoded}.${signature}`
}
export function verifyDiscoveredCandidate(token: string, expectedSlug: string): SpeciesMedia | null {
  if (typeof token !== 'string' || token.length > 12000) return null
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null
  const expected = createHmac('sha256', secret()).update(encoded).digest()
  let received: Buffer
  try { received = Buffer.from(signature, 'base64url') } catch { return null }
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as CandidatePayload
    if (payload.speciesSlug !== expectedSlug || payload.exp < Date.now() || !payload.media?.mediaId) return null
    const m = payload.media
    const rules: Record<string, { media: string[]; page: string[]; poster?: string[] }> = {
      commons: { media: ['upload.wikimedia.org'], page: ['commons.wikimedia.org'], poster: [] },
      inaturalist: { media: ['inaturalist-open-data.s3.amazonaws.com'], page: ['www.inaturalist.org'], poster: [] },
      pexels: { media: ['images.pexels.com', 'videos.pexels.com'], page: ['www.pexels.com'], poster: ['images.pexels.com'] },
      youtube: { media: ['www.youtube.com', 'youtube.com', 'youtu.be'], page: ['www.youtube.com', 'youtube.com', 'youtu.be'], poster: ['i.ytimg.com'] },
    }
    const policy = rules[m.sourcePlatform || '']
    if (!policy || !safeHttps(m.url, policy.media) || !safeHttps(m.sourceUrl, policy.page)) return null
    if (m.directMediaUrl && !safeHttps(m.directMediaUrl, policy.media)) return null
    if (m.poster && !safeHttps(m.poster, policy.poster || [])) return null
    if (m.creatorUrl && !safeHttps(m.creatorUrl, policy.page)) return null
    if (m.licenseUrl && !safeHttps(m.licenseUrl, ['creativecommons.org', 'www.creativecommons.org', 'commons.wikimedia.org', 'www.pexels.com', 'help.pexels.com', 'www.inaturalist.org', 'www.youtube.com'])) return null
    return m
  } catch { return null }
}

async function requestJson(url: URL, headers: Record<string, string> = {}) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(12000), cache: 'no-store', redirect: 'error' })
  if (response.status === 429) throw new Error('উৎসের API rate limit দিয়েছে; কিছুক্ষণ পর আবার চেষ্টা করুন।')
  if (!response.ok) throw new Error(`উৎসের API অনুরোধ ব্যর্থ হয়েছে (${response.status})।`)
  if (url.hostname === 'api.pexels.com') {
    cacheHost.__pbPexelsLimit = {
      limit: response.headers.get('x-ratelimit-limit') || undefined,
      remaining: response.headers.get('x-ratelimit-remaining') || undefined,
      reset: response.headers.get('x-ratelimit-reset') || undefined,
    }
  }
  return response.json()
}

async function searchCommons(species: Species): Promise<SpeciesMedia[]> {
  const query = species.scientificName.trim()
  if (!query || query === '—') return []
  const url = new URL('https://commons.wikimedia.org/w/api.php')
  url.search = new URLSearchParams({
    action: 'query', generator: 'search', gsrsearch: `"${query}"`, gsrnamespace: '6', gsrlimit: '16',
    prop: 'imageinfo', iiprop: 'url|mime|size|extmetadata', iiurlwidth: '720', format: 'json', formatversion: '2',
  }).toString()
  const data = await withCommonsSlot(() => requestJson(url, { 'User-Agent': process.env.COMMONS_USER_AGENT || 'RuposhiBanglaSpeciesMedia/1.0 (https://ruposhibangla.vercel.app)' }))
  const pages = (data?.query?.pages || []) as CommonsFile[]
  const out: SpeciesMedia[] = []
  for (const file of pages) {
    const info = file.imageinfo?.[0]
    const ext = info?.extmetadata || {}
    if (!file.title || !info?.url || !info.mime) continue
    const kind = info.mime.startsWith('image/') ? 'image' : info.mime.startsWith('video/') ? 'video' : null
    if (!kind || (kind === 'image' && !info.thumburl) || (kind === 'video' && !/\.(webm|mp4|ogv|ogg)(?:$|\?)/i.test(info.url))) continue
    const direct = safeHttps(kind === 'image' ? info.thumburl : info.url, ['upload.wikimedia.org'])
    if (!direct || (kind === 'image' && (info.width || 0) < 320)) continue
    const source = safeHttps(info.descriptionurl, ['commons.wikimedia.org']) || `https://commons.wikimedia.org/wiki/${encodeURIComponent(file.title.replace(/ /g, '_'))}`
    const artistHtml = ext.Artist?.value || ext.Credit?.value || ''
    const artistHref = artistHtml.match(/href=["']([^"']+)["']/i)?.[1]
    let creatorUrl = safeHttps(artistHref, ['commons.wikimedia.org'])
    if (artistHref?.startsWith('/')) creatorUrl = safeHttps(`https://commons.wikimedia.org${artistHref}`, ['commons.wikimedia.org'])
    const license = stripHtml(ext.LicenseShortName?.value || '')
    const title = stripHtml(ext.ObjectName?.value || file.title.replace(/^File:/, '').replace(/[_]+/g, ' '))
    const creator = stripHtml(artistHtml) || 'উৎসে নাম দেওয়া নেই'
    const licensed = isSpeciesMediaLicenseAllowed({ sourcePlatform: 'commons', license } as SpeciesMedia)
    out.push(buildMedia('commons', species.slug, query, file.title, kind, direct, source, title, creator, creatorUrl,
      license || 'License not specified', licenseUrlFor(license, ext.LicenseUrl?.value), {
        identificationBasis: 'unverified', identificationConfidence: undefined,
        verificationNote: licensed.ok ? 'Commons-এর নাম/সার্চ মিলে যেতে পারে; সঠিক প্রজাতি ও ফাইলের লাইসেন্স অ্যাডমিন যাচাই করবেন।' : licensed.note,
      }))
  }
  return out
}

const INAT_LICENSES: Record<string, { name: string; url: string }> = {
  cc0: { name: 'CC0', url: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  'cc-by': { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
  'cc-by-sa': { name: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
}
async function searchINaturalist(species: Species): Promise<SpeciesMedia[]> {
  const sci = species.scientificName.trim()
  if (!sci || sci === '—') return []
  const taxaUrl = new URL('https://api.inaturalist.org/v1/taxa')
  taxaUrl.search = new URLSearchParams({ q: sci, rank: 'species', per_page: '5' }).toString()
  const taxa = await requestJson(taxaUrl)
  const taxon = (taxa?.results || []).find((item: any) => String(item.name || '').toLowerCase() === sci.toLowerCase())
  if (!taxon?.id) return []
  const obsUrl = new URL('https://api.inaturalist.org/v1/observations')
  obsUrl.search = new URLSearchParams({
    taxon_id: String(taxon.id), quality_grade: 'research', photos: 'true',
    photo_license: 'cc0,cc-by,cc-by-sa', per_page: '24', order_by: 'votes', order: 'desc',
  }).toString()
  const observations = await requestJson(obsUrl)
  const out: SpeciesMedia[] = []
  const used = new Set<string>()
  for (const observation of observations?.results || []) {
    const observedTaxon = observation.taxon?.name
    if (String(observedTaxon || '').toLowerCase() !== sci.toLowerCase()) continue
    for (const photo of observation.photos || []) {
      const license = INAT_LICENSES[String(photo.license_code || '').toLowerCase()]
      if (!license || !photo.url || !photo.id) continue
      const imageUrl = String(photo.url).replace('/square.', '/medium.').replace('/small.', '/medium.')
      const direct = safeHttps(imageUrl, ['inaturalist-open-data.s3.amazonaws.com'])
      if (!direct || used.has(direct)) continue
      used.add(direct)
      const source = `https://www.inaturalist.org/observations/${encodeURIComponent(String(observation.id))}`
      const login = String(observation.user?.login || '')
      const creatorUrl = /^[A-Za-z0-9_-]{1,80}$/.test(login) ? `https://www.inaturalist.org/people/${login}` : undefined
      const creator = stripHtml(photo.attribution || `${observation.user?.name || login || 'iNaturalist observer'}`)
      out.push(buildMedia('inaturalist', species.slug, sci, `${observation.id}:${photo.id}`, 'image', direct, source,
        `${sci} — iNaturalist Research Grade observation`, creator, creatorUrl, license.name, license.url, {
          identificationBasis: 'research_grade', identificationConfidence: undefined,
          verificationNote: 'Research Grade observation + open image license; this is not a numeric identity score and the specific photo still needs visual review.',
        }))
    }
    if (out.length >= 16) break
  }
  return out
}

async function searchPexels(species: Species): Promise<SpeciesMedia[]> {
  const key = process.env.PEXELS_API_KEY
  if (!key) throw new Error('PEXELS_API_KEY সার্ভার environment-এ সেট করা নেই।')
  const query = species.scientificName.trim()
  if (!query || query === '—') return []
  const headers = { Authorization: key }
  const photosUrl = new URL('https://api.pexels.com/v1/search')
  photosUrl.search = new URLSearchParams({ query, per_page: '10', locale: 'en-US' }).toString()
  const videosUrl = new URL('https://api.pexels.com/v1/videos/search')
  videosUrl.search = new URLSearchParams({ query, per_page: '5', locale: 'en-US' }).toString()
  const [photos, videos] = await Promise.all([requestJson(photosUrl, headers), requestJson(videosUrl, headers)])
  const out: SpeciesMedia[] = []
  for (const photo of photos?.photos || []) {
    const direct = safeHttps(photo.src?.large || photo.src?.medium, ['images.pexels.com'])
    const source = safeHttps(photo.url, ['www.pexels.com'])
    if (!direct || !source || !photo.id) continue
    const creator = String(photo.photographer || 'Pexels photographer').slice(0, 180)
    const creatorUrl = safeHttps(photo.photographer_url, ['www.pexels.com'])
    out.push(buildMedia('pexels', species.slug, query, String(photo.id), 'image', direct, source,
      String(photo.alt || `${query} — Pexels photo`).slice(0, 240), creator, creatorUrl, 'Pexels License', 'https://www.pexels.com/license/', {
        identificationBasis: 'unverified', identificationConfidence: undefined,
        verificationNote: 'Pexels-এর keyword result প্রজাতি শনাক্ত করে না; ছবির পরিচয় ও পরিবেশ ম্যানুয়ালি নিশ্চিত করুন।',
      }))
  }
  for (const video of videos?.videos || []) {
    const source = safeHttps(video.url, ['www.pexels.com'])
    const file = (video.video_files || []).filter((f: any) => /mp4/i.test(String(f.file_type || '')) && f.link).sort((a: any, b: any) => (b.width || 0) - (a.width || 0))[0]
    const direct = safeHttps(file?.link, ['videos.pexels.com'])
    if (!source || !direct || !video.id) continue
    const pictures = (video.video_pictures || []).find((p: any) => p.picture)
    const poster = safeHttps(pictures?.picture, ['images.pexels.com'])
    const creator = String(video.user?.name || 'Pexels videographer').slice(0, 180)
    const creatorUrl = safeHttps(video.user?.url, ['www.pexels.com'])
    out.push(buildMedia('pexels', species.slug, query, String(video.id), 'video', direct, source,
      `${query} — Pexels video`, creator, creatorUrl, 'Pexels License', 'https://www.pexels.com/license/', {
        identificationBasis: 'unverified', identificationConfidence: undefined, ...(poster ? { poster } : {}),
        verificationNote: 'Pexels-এর keyword result প্রজাতি শনাক্ত করে না; ভিডিওর পরিচয় ম্যানুয়ালি নিশ্চিত করুন.',
      }))
  }
  return out
}

async function searchYouTube(species: Species): Promise<SpeciesMedia[]> {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) throw new Error('YOUTUBE_API_KEY সার্ভার environment-এ সেট করা নেই।')
  const query = species.scientificName.trim()
  if (!query || query === '—') return []
  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
  searchUrl.search = new URLSearchParams({ part: 'snippet', type: 'video', videoEmbeddable: 'true', q: query, maxResults: '5', safeSearch: 'strict', key }).toString()
  const search = await requestJson(searchUrl)
  const ids = (search?.items || []).map((item: any) => item.id?.videoId).filter((id: any) => typeof id === 'string' && /^[A-Za-z0-9_-]{11}$/.test(id))
  if (!ids.length) return []
  const detailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
  detailsUrl.search = new URLSearchParams({ part: 'snippet,status', id: ids.join(','), key }).toString()
  const details = await requestJson(detailsUrl)
  const out: SpeciesMedia[] = []
  for (const item of details?.items || []) {
    if (!item.status?.embeddable || item.status?.privacyStatus !== 'public') continue
    const id = String(item.id)
    const source = `https://www.youtube.com/watch?v=${id}`
    const cc = item.status.license === 'creativeCommon'
    const channelId = item.snippet?.channelId
    const creatorUrl = typeof channelId === 'string' ? `https://www.youtube.com/channel/${channelId}` : undefined
    const license = cc ? 'Creative Commons Attribution (YouTube)' : 'YouTube Standard License (embed only)'
    const media = buildMedia('youtube', species.slug, query, id, 'video', source, source,
      String(item.snippet?.title || `${query} — YouTube video`).slice(0, 240),
      String(item.snippet?.channelTitle || 'YouTube channel').slice(0, 180), creatorUrl,
      license, cc ? 'https://creativecommons.org/licenses/by/4.0/' : 'https://www.youtube.com/t/terms', {
        directMediaUrl: undefined, poster: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`, identificationBasis: 'unverified', identificationConfidence: undefined,
        commercialUse: null, modificationPermission: cc ? true : false,
        verificationStatus: 'needs_review',
        verificationNote: 'শুধু YouTube embed; standard license ভিডিও পুনঃব্যবহার/ডাউনলোডের অনুমতি নয়। প্রজাতির পরিচয় অ্যাডমিন যাচাই করবেন।',
      })
    out.push(media)
  }
  return out
}

async function discoverUncached(species: Species, platform: SpeciesMediaPlatform) {
  if (platform === 'commons') return searchCommons(species)
  if (platform === 'inaturalist') return searchINaturalist(species)
  if (platform === 'pexels') return searchPexels(species)
  if (platform === 'youtube') return searchYouTube(species)
  return []
}
export async function discoverSpeciesMedia(species: Species, platform: SpeciesMediaPlatform): Promise<DiscoveredMedia[]> {
  const key = `${platform}:${species.slug}:${species.scientificName}`
  const current = resultCache.get(key)
  let media: SpeciesMedia[]
  if (current && current.expiresAt > Date.now()) media = current.media
  else {
    media = await discoverUncached(species, platform)
    resultCache.set(key, { expiresAt: Date.now() + TTL_MS, media })
    if (resultCache.size > 200) {
      for (const [k, entry] of resultCache) if (entry.expiresAt <= Date.now()) resultCache.delete(k)
      if (resultCache.size > 200) resultCache.delete(resultCache.keys().next().value!)
    }
  }
  return media.map((item) => ({ ...item, token: signCandidate(species.slug, item), eligibleLicense: isSpeciesMediaLicenseAllowed(item).ok }))
}
