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
  const species: Species = {
    slug,
    type: body.type === 'udbhid' ? 'udbhid' : 'prani',
    category: body.category || (body.type === 'udbhid' ? 'বন গাছ' : 'পাখি'),
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
    featured: !!body.featured,
    views: 0,
    createdAt: new Date().toISOString(),
  }
  await getRepo().upsertSpecies(species)
  return NextResponse.json({ ok: true, species })
}
