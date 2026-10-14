import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import type { Species } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = await getRepo().getSpecies(slug)
  if (!s) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(s)
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { slug } = await params
  const body = (await req.json().catch(() => null)) as Partial<Species> | null
  if (!body) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const existing = await getRepo().getSpecies(slug)
  const merged: Species = { ...(existing || ({} as Species)), ...body, slug } as Species
  await getRepo().upsertSpecies(merged)
  return NextResponse.json({ ok: true, species: merged })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { slug } = await params
  await getRepo().deleteSpecies(slug)
  return NextResponse.json({ ok: true })
}
