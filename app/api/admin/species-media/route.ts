import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getReadyRepo } from '@/lib/repo'
import type { SpeciesMedia, SpeciesMediaVerification } from '@/lib/types'
import { discoverSpeciesMedia, getPexelsRateLimit, isSpeciesMediaLicenseAllowed, verifyDiscoveredCandidate } from '@/lib/species-media-discovery'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SOURCES = new Set(['commons', 'inaturalist', 'pexels', 'youtube'])
const STATUSES = new Set<SpeciesMediaVerification>(['verified', 'needs_review', 'restricted', 'unavailable'])
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } })

async function getActor() {
  const session = await getSession()
  if (!session || !['admin', 'super_admin', 'editor'].includes(session.role)) return null
  return session
}
function mediaKey(media: SpeciesMedia) { return media.mediaId || `${media.sourcePlatform || 'legacy'}:${media.sourceId || media.sourceUrl || media.url}` }
function audit(repo: Awaited<ReturnType<typeof getReadyRepo>>, actor: NonNullable<Awaited<ReturnType<typeof getActor>>>, action: string, slug: string, detail: string) {
  return repo.addAudit?.({
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, actorId: actor.id, actorName: actor.name,
    action: `species-media.${action}`, target: slug, detail: detail.slice(0, 400), createdAt: new Date().toISOString(),
  })
}

export async function GET(request: Request) {
  const actor = await getActor()
  if (!actor) return json({ error: 'unauthorized' }, 401)
  const params = new URL(request.url).searchParams
  const mode = params.get('mode') || 'search'
  const repo = await getReadyRepo()

  if (mode === 'species') {
    const q = (params.get('q') || '').trim().slice(0, 100)
    if (q.length < 2) return json({ items: [] })
    const rows = await repo.listSpecies({ q, limit: 15 })
    return json({ items: rows.map((s) => ({ slug: s.slug, type: s.type, nameBn: s.nameBn, nameEn: s.nameEn, scientificName: s.scientificName })) })
  }

  if (mode === 'queue') {
    const statusValue = params.get('status') || 'needs_review'
    if (!STATUSES.has(statusValue as SpeciesMediaVerification)) return json({ error: 'invalid status' }, 400)
    const species = await repo.listSpecies({ limit: 5000 })
    const items = species.flatMap((s) => (s.media || [])
      .filter((m) => m.verificationStatus === statusValue)
      .map((media) => ({ species: { slug: s.slug, nameBn: s.nameBn, nameEn: s.nameEn, scientificName: s.scientificName }, media })))
      .slice(0, 500)
    return json({ items, total: items.length })
  }

  const slug = (params.get('slug') || '').trim()
  const source = (params.get('source') || '').trim()
  if (!slug || !SOURCES.has(source)) return json({ error: 'প্রজাতি ও উৎস নির্বাচন করুন।' }, 400)
  const species = await repo.getSpecies(slug)
  if (!species) return json({ error: 'প্রজাতির রেকর্ড পাওয়া যায়নি।' }, 404)
  if (species.sensitive) return json({ items: [], warning: 'এই প্রজাতির অবস্থান/মিডিয়া সংবেদনশীল হিসেবে চিহ্নিত; গোপনীয়তা রক্ষায় স্বয়ংক্রিয় বাহ্যিক অনুসন্ধান বন্ধ রাখা হয়েছে।' })
  if (!species.scientificName || species.scientificName.trim() === '—') {
    return json({ items: [], warning: 'এই রেকর্ডে নির্ভরযোগ্য বৈজ্ঞানিক নাম নেই; ভুল-ম্যাচ এড়াতে বাহ্যিক অনুসন্ধান করা হয়নি।' })
  }
  try {
    const items = await discoverSpeciesMedia(species, source as any)
    return json({ items, total: items.length, query: species.scientificName, cachedForSeconds: 900, ...(source === 'pexels' ? { pexelsRateLimit: getPexelsRateLimit() } : {}) })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'বাহ্যিক উৎস থেকে মিডিয়া খোঁজা যায়নি।'
    return json({ error: message, items: [] }, 502)
  }
}

export async function POST(request: Request) {
  const actor = await getActor()
  if (!actor) return json({ error: 'unauthorized' }, 401)
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!body || typeof body.slug !== 'string' || body.slug.length > 180) return json({ error: 'invalid request' }, 400)
  const repo = await getReadyRepo()
  const species = await repo.getSpecies(body.slug)
  if (!species) return json({ error: 'প্রজাতির রেকর্ড পাওয়া যায়নি।' }, 404)
  const media = [...(species.media || [])]
  const action = String(body.action || '')

  if (action === 'queue') {
    const candidate = typeof body.token === 'string' ? verifyDiscoveredCandidate(body.token, species.slug) : null
    if (!candidate) return json({ error: 'অনুসন্ধানের ফলের স্বাক্ষর/মেয়াদ যাচাই হয়নি। আবার খুঁজুন।' }, 400)
    const key = mediaKey(candidate)
    const candidateUrl = candidate.directMediaUrl || candidate.url
    const existingIndex = media.findIndex((item) => mediaKey(item) === key || item.sourceUrl === candidate.sourceUrl || (item.directMediaUrl || item.url) === candidateUrl)
    const allowed = isSpeciesMediaLicenseAllowed(candidate).ok
    const next: SpeciesMedia = {
      ...candidate,
      verificationStatus: allowed ? 'needs_review' : 'restricted',
      lastVerifiedAt: undefined, lastReviewedAt: undefined, lastCheckedAt: undefined,
      identificationBasis: candidate.identificationBasis || 'unverified',
      verificationNote: allowed
        ? 'অ্যাডমিনের প্রজাতি-শনাক্তকরণ ও লাইসেন্স অনুমোদন প্রয়োজন।'
        : 'লাইসেন্স/ব্যবহারের অধিকার স্বয়ংক্রিয়ভাবে অনুমোদিত নয়; প্রকাশের আগে অধিকার যাচাই করুন।',
    }
    if (existingIndex >= 0) {
      const existing = media[existingIndex]
      const changed = existing.license !== next.license || existing.url !== next.url || existing.creator !== next.creator || existing.sourceUrl !== next.sourceUrl
      if (!changed) return json({ error: 'এই মিডিয়াটি আগে থেকেই সংরক্ষিত আছে।' }, 409)
      media[existingIndex] = { ...existing, ...next, verificationStatus: 'needs_review', lastVerifiedAt: undefined, lastReviewedAt: new Date().toISOString(), verificationNote: 'উৎস/লাইসেন্স metadata বদলেছে; পুনরায় যাচাই প্রয়োজন।' }
    } else media.push(next)
    await repo.setSpeciesMedia(species.slug, media)
    await audit(repo, actor, 'queue', species.slug, `${next.sourcePlatform} ${next.mediaId} (${next.verificationStatus})`)
    return json({ ok: true, status: next.verificationStatus, duplicateUpdated: existingIndex >= 0 })
  }

  const id = String(body.mediaId || '')
  const index = media.findIndex((item) => mediaKey(item) === id)
  if (!id || index < 0) return json({ error: 'মিডিয়া রেকর্ড পাওয়া যায়নি।' }, 404)
  const current = media[index]

  if (action === 'check') {
    if (!['admin', 'super_admin'].includes(actor.role)) return json({ error: 'উৎস পরীক্ষা করতে অ্যাডমিন অনুমতি প্রয়োজন।' }, 403)
    const hostAllowlist: Record<string, string[]> = {
      commons: ['upload.wikimedia.org'],
      inaturalist: ['inaturalist-open-data.s3.amazonaws.com'],
      pexels: ['images.pexels.com', 'videos.pexels.com'],
    }
    const allowedHosts = hostAllowlist[current.sourcePlatform || '']
    let mediaUrl: URL
    try { mediaUrl = new URL(current.directMediaUrl || current.url) } catch { return json({ error: 'উৎস URL অকার্যকর।' }, 400) }
    if (!allowedHosts || mediaUrl.protocol !== 'https:' || !allowedHosts.includes(mediaUrl.hostname.toLowerCase())) {
      return json({ error: 'এই source-এর নিরাপদ HEAD পরীক্ষা নেই। YouTube-এর জন্য Data API দিয়ে পুনরায় খুঁজুন।' }, 400)
    }
    try {
      const response = await fetch(mediaUrl, { method: 'HEAD', redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(8000) })
      if (response.status >= 200 && response.status < 300) {
        media[index] = { ...current, verificationStatus: current.verificationStatus === 'unavailable' ? 'needs_review' : current.verificationStatus, lastCheckedAt: new Date().toISOString(), verificationNote: `${current.verificationStatus === 'unavailable' ? 'উৎস আবার সাড়া দিয়েছে; লাইসেন্স ও পরিচয় পুনরায় অনুমোদন প্রয়োজন। ' : ''}সর্বশেষ HEAD পরীক্ষা: HTTP ${response.status}; এটি license পুনরায় যাচাই নয়.`.trim() }
      } else if (response.status === 404 || response.status === 410) {
        media[index] = { ...current, verificationStatus: 'unavailable', lastVerifiedAt: undefined, lastCheckedAt: new Date().toISOString(), verificationNote: `উৎসের HEAD পরীক্ষায় HTTP ${response.status}; মিডিয়া অপ্রাপ্য হিসেবে চিহ্নিত।` }
      } else {
        return json({ ok: false, inconclusive: true, error: `HTTP ${response.status}; উৎস HEAD অনুরোধ সমর্থন না করতে পারে। status পরিবর্তন হয়নি।` }, 202)
      }
    } catch {
      return json({ ok: false, inconclusive: true, error: 'উৎস পরীক্ষা timeout/network failure; নিশ্চিত 404 না হওয়ায় status পরিবর্তন হয়নি।' }, 202)
    }
    await repo.setSpeciesMedia(species.slug, media)
    await audit(repo, actor, 'check', species.slug, `${current.sourcePlatform || 'legacy'} ${id}`)
    return json({ ok: true, status: media[index].verificationStatus, message: media[index].verificationStatus === 'unavailable' ? 'মিডিয়া অপ্রাপ্য হিসেবে চিহ্নিত।' : 'URL সাড়া দিয়েছে; license পুনরায় যাচাই হয়নি.' })
  }

  if (action === 'verify') {
    if (!['admin', 'super_admin'].includes(actor.role)) return json({ error: 'লাইসেন্স অনুমোদনে অ্যাডমিন অনুমতি প্রয়োজন।' }, 403)
    if (body.confirmSpecies !== true || body.confirmLicense !== true) return json({ error: 'প্রজাতি ও লাইসেন্স—দুটিই নিশ্চিত করতে হবে।' }, 400)
    if (current.verificationStatus === 'restricted' || current.verificationStatus === 'unavailable') return json({ error: 'Restricted/Unavailable মিডিয়া পুনরায় খুঁজে Needs review-তে আনুন।' }, 409)
    const license = isSpeciesMediaLicenseAllowed(current)
    if (!license.ok) return json({ error: license.note || 'এই মিডিয়ার লাইসেন্স স্বয়ংক্রিয় প্রকাশের অনুমোদিত তালিকায় নেই।' }, 400)
    media[index] = {
      ...current,
      verificationStatus: 'verified',
      verificationNote: current.sourcePlatform === 'youtube'
        ? 'অ্যাডমিন প্রজাতি ও embed-যোগ্যতা যাচাই করেছেন; YouTube Standard License কেবল platform embed-এর জন্য, download/reuse অনুমতি নয়।'
        : 'অ্যাডমিন প্রজাতি-পরিচয়, উৎস, লাইসেন্স এবং attribution যাচাই করেছেন।',
      identificationBasis: 'manual_confirmed', identificationConfidence: undefined,
      scientificName: species.scientificName, lastVerifiedAt: new Date().toISOString(), lastReviewedAt: new Date().toISOString(),
    }
  } else if (action === 'restrict' || action === 'unavailable') {
    if (!['admin', 'super_admin'].includes(actor.role)) return json({ error: 'এই স্ট্যাটাস পরিবর্তনে অ্যাডমিন অনুমতি প্রয়োজন।' }, 403)
    media[index] = {
      ...current, verificationStatus: (action === 'restrict' ? 'restricted' : 'unavailable') as SpeciesMediaVerification,
      verificationNote: String(body.note || (action === 'unavailable' ? 'মূল উৎস থেকে আর পাওয়া যাচ্ছে না।' : 'অ্যাডমিন সীমাবদ্ধ করেছেন।')).slice(0, 400),
      lastVerifiedAt: undefined, lastReviewedAt: new Date().toISOString(),
    }
  } else if (action === 'recheck') {
    if (!['admin', 'super_admin'].includes(actor.role)) return json({ error: 'এই স্ট্যাটাস পরিবর্তনে অ্যাডমিন অনুমতি প্রয়োজন।' }, 403)
    media[index] = { ...current, verificationStatus: 'needs_review', lastVerifiedAt: undefined, lastReviewedAt: new Date().toISOString(), verificationNote: 'লাইসেন্স/উৎস পুনরায় যাচাইয়ের জন্য প্রকাশ থেকে সরানো হয়েছে।' }
  } else if (action === 'remove') {
    if (!['admin', 'super_admin'].includes(actor.role)) return json({ error: 'মিডিয়া বাদ দিতে অ্যাডমিন অনুমতি প্রয়োজন।' }, 403)
    media.splice(index, 1)
  } else return json({ error: 'invalid action' }, 400)

  await repo.setSpeciesMedia(species.slug, media)
  await audit(repo, actor, action, species.slug, `${current.sourcePlatform || 'legacy'} ${id}`)
  return json({ ok: true, action })
}
