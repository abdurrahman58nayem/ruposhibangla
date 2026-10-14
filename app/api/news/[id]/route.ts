import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import type { News } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const body = (await req.json().catch(() => null)) as Partial<News> | null
  if (!body) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const repo = getRepo()
  const all = await repo.listNews({ publishedOnly: false })
  const existing = all.find((n) => n.id === id || n.slug === id)
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const merged: News = { ...existing, ...body, id: existing.id }
  await repo.upsertNews(merged)
  return NextResponse.json({ ok: true, news: merged })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  await getRepo().deleteNews(id)
  return NextResponse.json({ ok: true })
}
