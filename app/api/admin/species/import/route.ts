import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { slugify } from '@/lib/utils'
import { CATEGORIES } from '@/lib/categories'
import type { Species, SpeciesType, GroupId, DataStatus } from '@/lib/types'

export const dynamic = 'force-dynamic'

const GROUP_IDS = new Set(CATEGORIES.map((c) => c.id))
const DATA_STATUSES = new Set<DataStatus>(['verified', 'review', 'partial', 'identity_uncertain', 'needs_correction'])

/** বাংলা/ইংরেজি নামের সাধারণ বানান-ভেদ মেলানো */
function norm(v: string): string {
  return String(v || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[।,.;:()"'’‘]/g, '')
}

/** সাধারণ CSV পার্সার — উদ্ধৃতির ভেতরের কমা ও নতুন লাইন সামলায় */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let cell = ''
  let row: string[] = []
  let inQuote = false
  const src = text.replace(/^\uFEFF/, '')
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    if (inQuote) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"'
          i++
        } else inQuote = false
      } else cell += ch
    } else if (ch === '"') inQuote = true
    else if (ch === ',') {
      row.push(cell)
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += ch
  }
  if (cell.length || row.length) {
    row.push(cell)
    rows.push(row)
  }
  const [head, ...body] = rows.filter((r) => r.some((c) => c.trim() !== ''))
  if (!head) return []
  const cols = head.map((h) => h.trim())
  return body.map((r) => {
    const o: Record<string, string> = {}
    cols.forEach((c, i) => (o[c] = (r[i] ?? '').trim()))
    return o
  })
}

function toBool(v: unknown): boolean {
  return ['1', 'true', 'yes', 'হ্যাঁ', 'y'].includes(String(v || '').trim().toLowerCase())
}

function toSpecies(raw: Record<string, any>, existing?: Species | null): Species | null {
  const nameBn = String(raw.nameBn || raw['নাম'] || raw.name || '').trim()
  if (!nameBn) return null
  const slug = String(raw.slug || '').trim() || slugify(nameBn)
  const type: SpeciesType = (['prani', 'udbhid', 'sthan', 'sahitto'] as const).includes(raw.type)
    ? (raw.type as SpeciesType)
    : (existing?.type || 'prani')
  const group: GroupId = GROUP_IDS.has(raw.group) ? (raw.group as GroupId) : existing?.group || inferGroup(type, raw.category)
  const dataStatus: DataStatus = DATA_STATUSES.has(raw.dataStatus)
    ? (raw.dataStatus as DataStatus)
    : existing?.dataStatus || 'partial'

  const sources = String(raw.sources || '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [title, url, license] = s.split('|')
      return { title: (title || '').trim(), url: (url || '').trim() || undefined, license: (license || '').trim() || undefined }
    })

  return {
    slug,
    type,
    group,
    category: String(raw.category || existing?.category || '').trim(),
    nameBn,
    nameEn: String(raw.nameEn || '').trim(),
    scientificName: String(raw.scientificName || '').trim(),
    otherNames: String(raw.otherNames || '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean),
    conservation: (raw.conservation as any) || existing?.conservation || 'NE',
    conservationBn: String(raw.conservationBn || '').trim(),
    habitat: String(raw.habitat || '').trim(),
    whereToSee: String(raw.whereToSee || '').trim(),
    sizeOrHeight: String(raw.sizeOrHeight || '').trim(),
    diet: String(raw.diet || '').trim(),
    behavior: String(raw.behavior || '').trim(),
    reproduction: String(raw.reproduction || '').trim(),
    season: String(raw.season || '').trim(),
    identification: String(raw.identification || '').trim(),
    summary: String(raw.summary || '').trim(),
    description: String(raw.description || '').trim(),
    image: String(raw.image || '').trim(),
    gallery: existing?.gallery || [],
    sources,
    dataStatus,
    origin: (raw.origin as any) || existing?.origin,
    threats: String(raw.threats || '').trim(),
    conservationActions: String(raw.conservationActions || '').trim(),
    conflictingInfo: String(raw.conflictingInfo || '').trim(),
    sensitive: raw.sensitive !== undefined ? toBool(raw.sensitive) : !!existing?.sensitive,
    colorTags: String(raw.colorTags || '')
      .split(/[;,]/)
      .map((c) => c.trim())
      .filter(Boolean),
    featured: existing?.featured,
    views: existing?.views,
    createdAt: existing?.createdAt,
    updatedAt: new Date().toISOString(),
  }
}

function inferGroup(type: SpeciesType, category?: string): GroupId {
  if (type === 'udbhid') return 'udbhidful'
  if (type === 'sthan') return 'nadi'
  if (type === 'sahitto') return 'sahitto'
  return 'pranijogot'
}

/**
 * জ্ঞানভান্ডারে আমদানি (§17) — CSV বা JSON।
 * গুরুত্ব: কোনো রেকর্ড স্বয়ংক্রিয়ভাবে “যাচাইকৃত” হয় না; ডুপ্লিকেট ধরা পড়লে
 * অনুমতি না দিলে সেটি এড়িয়ে যায় এবং রিপোর্টে দেখায়।
 */
export async function POST(req: Request) {
  const session = await getSession()
  if (!session || !['admin', 'super_admin', 'editor'].includes(session.role)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const contentType = req.headers.get('content-type') || ''
  let rows: Record<string, any>[] = []

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'ফাইল দিন' }, { status: 400 })
    const text = await file.text()
    rows = file.name.toLowerCase().endsWith('.json') ? JSON.parse(text) : parseCsv(text)
    if (!Array.isArray(rows)) rows = (rows as any).rows || []
  } else {
    const body = (await req.json().catch(() => null)) as any
    if (typeof body?.csv === 'string') rows = parseCsv(body.csv)
    else if (Array.isArray(body?.rows)) rows = body.rows
    else if (Array.isArray(body)) rows = body
    else return NextResponse.json({ error: 'CSV বা JSON সারি পাওয়া যায়নি' }, { status: 400 })
  }

  const updateExisting = new URL(req.url).searchParams.get('update') === '1'
  const repo = getRepo()
  const existingAll = await repo.listSpecies({ limit: 5000 })
  const bySlug = new Map(existingAll.map((s) => [s.slug, s]))
  const byName = new Map(existingAll.map((s) => [norm(s.nameBn), s]))
  const bySci = new Map(existingAll.filter((s) => s.scientificName).map((s) => [norm(s.scientificName), s]))

  const result = { total: rows.length, created: 0, updated: 0, duplicates: [] as any[], skipped: [] as any[] }

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i]
    const nameBn = String(raw?.nameBn || raw?.['নাম'] || raw?.name || '').trim()
    if (!nameBn) {
      result.skipped.push({ row: i + 1, reason: 'নাম নেই' })
      continue
    }
    const existing = bySlug.get(String(raw.slug || '').trim()) || byName.get(norm(nameBn)) || bySci.get(norm(raw.scientificName || ''))
    if (existing && !updateExisting) {
      result.duplicates.push({ row: i + 1, name: nameBn, slug: existing.slug, reason: 'এই নাম/স্লাগ/বৈজ্ঞানিক নামে রেকর্ড আগে থেকেই আছে' })
      continue
    }
    const next = toSpecies(raw, existing)
    if (!next) {
      result.skipped.push({ row: i + 1, reason: 'তথ্য অপর্যাপ্ত' })
      continue
    }
    await repo.upsertSpecies(next)
    if (existing) result.updated += 1
    else result.created += 1
  }

  return NextResponse.json({ ok: true, ...result })
}
