import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { slugify } from '@/lib/utils'
import type { Species } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const rows = await getRepo().listSpecies({
    type: (url.searchParams.get('type') as any) || undefined,
    group: (url.searchParams.get('group') as any) || undefined,
    conservation: (url.searchParams.get('conservation') as any) || undefined,
    dataStatus: (url.searchParams.get('dataStatus') as any) || undefined,
    category: url.searchParams.get('category') || undefined,
    q: url.searchParams.get('q') || undefined,
    limit: Math.min(Number(url.searchParams.get('limit') || 60), 300),
  })
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = (await req.json().catch(() => null)) as Partial<Species> | null
  if (!body?.nameBn) return NextResponse.json({ error: 'নাম দিন' }, { status: 400 })
  const slug = slugify(body.slug || body.nameBn)
  const type: Species['type'] = (['prani', 'udbhid', 'sthan', 'sahitto'] as const).includes(body.type as any)
    ? (body.type as Species['type'])
    : 'prani'
  const species: Species = {
    slug,
    type,
    group: body.group || (type === 'udbhid' ? 'udbhidful' : type === 'sthan' ? 'nadi' : type === 'sahitto' ? 'sahitto' : 'pranijogot'),
    category: body.category || (type === 'udbhid' ? 'বন গাছ' : type === 'sthan' ? 'নদী' : type === 'sahitto' ? 'কবিতা' : 'পাখি'),
    nameBn: body.nameBn,
    nameEn: body.nameEn || '',
    scientificName: body.scientificName || '',
    otherNames: body.otherNames || [],
    summary: body.summary || '',
    description: body.description || '',
    habitat: body.habitat || '',
    diet: body.diet || '',
    sizeOrHeight: body.sizeOrHeight || '',
    season: body.season || '',
    whereToSee: body.whereToSee || '',
    reproduction: body.reproduction || '',
    conservation: body.conservation || 'NE',
    conservationBn: body.conservationBn || '',
    colorTags: body.colorTags || [],
    image: body.image || '',
    gallery: body.gallery || [],
    poetViews: body.poetViews || [],
    sources: body.sources || [],
    synonyms: body.synonyms || [],
    taxonomy: body.taxonomy,
    physical: body.physical,
    identification: body.identification,
    behavior: body.behavior,
    distribution: body.distribution,
    ecologicalRole: body.ecologicalRole,
    origin: body.origin,
    threats: body.threats,
    conservationActions: body.conservationActions,
    media: body.media,
    dataStatus: body.dataStatus || 'partial',
    // অ্যাডমিনের দেওয়া অবস্থা রিড-টাইম ভেরিফিকেশনে বদলে যাবে না
    statusLockedAt: new Date().toISOString(),
    lastVerifiedAt: body.lastVerifiedAt,
    conflictingInfo: body.conflictingInfo,
    sensitive: body.sensitive,
    featured: !!body.featured,
    views: 0,
    createdAt: new Date().toISOString(),
  }
  await getRepo().upsertSpecies(species)
  return NextResponse.json({ ok: true, species })
}
