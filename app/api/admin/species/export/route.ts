import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/** CSV-এ রাখা হবে এমন কলামগুলো */
const COLUMNS = [
  'slug',
  'type',
  'group',
  'category',
  'nameBn',
  'nameEn',
  'scientificName',
  'otherNames',
  'conservation',
  'conservationBn',
  'habitat',
  'whereToSee',
  'sizeOrHeight',
  'diet',
  'behavior',
  'reproduction',
  'season',
  'identification',
  'summary',
  'description',
  'image',
  'dataStatus',
  'origin',
  'threats',
  'conservationActions',
  'conflictingInfo',
  'sensitive',
  'sources',
] as const

function csvEscape(v: unknown): string {
  const s = String(v ?? '')
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function toCsv(rows: Record<string, any>[]): string {
  const head = COLUMNS.join(',')
  const body = rows.map((r) => COLUMNS.map((c) => csvEscape(r[c])).join(',')).join('\n')
  return '\uFEFF' + head + '\n' + body // BOM — এক্সেলে বাংলা ঠিকভাবে খুলবে
}

/** জ্ঞানভান্ডার রপ্তানি — JSON বা CSV (§17) */
export async function GET(req: Request) {
  const session = await getSession()
  if (!session || !['admin', 'super_admin', 'editor'].includes(session.role)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const url = new URL(req.url)
  const format = url.searchParams.get('format') === 'csv' ? 'csv' : 'json'
  const type = url.searchParams.get('type') || undefined
  const group = url.searchParams.get('group') || undefined

  const rows = await getRepo().listSpecies({ type: type as any, group: group as any, limit: 2000 })
  const plain = rows.map((s) => ({
    ...s,
    otherNames: (s.otherNames || []).join('; '),
    sources: (s.sources || []).map((x: any) => `${x.title}|${x.url || ''}|${x.license || ''}`).join('; '),
  }))

  const stamp = new Date().toISOString().slice(0, 10)

  if (format === 'csv') {
    return new NextResponse(toCsv(plain as any), {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="ruposhibangla-species-${stamp}.csv"`,
      },
    })
  }

  return new NextResponse(JSON.stringify({ exportedAt: new Date().toISOString(), count: plain.length, rows: plain }, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': `attachment; filename="ruposhibangla-species-${stamp}.json"`,
    },
  })
}
