import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { uid } from '@/lib/utils'
import type { Jeno } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(await getRepo().listJeno())
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<Jeno> | null
  const message = String(body?.message || '').trim()
  const name = String(body?.name || '').trim()
  if (message.length < 10) return NextResponse.json({ error: 'অন্তত ১০ অক্ষর লিখুন' }, { status: 400 })
  if (name.length < 2) return NextResponse.json({ error: 'নাম দিন' }, { status: 400 })
  if (message.length > 4000) return NextResponse.json({ error: 'লেখা অনেক বড়' }, { status: 400 })

  const item: Jeno = {
    id: uid('jeno'),
    name: name.slice(0, 60),
    contact: String(body?.contact || '').slice(0, 80),
    topic: String(body?.topic || '').slice(0, 120),
    message: message,
    speciesSlug: String(body?.speciesSlug || '').slice(0, 120),
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  await getRepo().createJeno(item)
  return NextResponse.json({ ok: true, item })
}
