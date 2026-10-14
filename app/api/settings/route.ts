import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import type { SiteSettings } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(await getRepo().getSettings())
}

export async function PUT(req: Request) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = (await req.json().catch(() => null)) as Partial<SiteSettings> | null
  if (!body) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const current = await getRepo().getSettings()
  const merged = { ...current, ...body }
  await getRepo().saveSettings(merged)
  return NextResponse.json({ ok: true, settings: merged })
}
