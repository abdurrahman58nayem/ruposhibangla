import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const patch = await req.json().catch(() => ({}))
  const updated = await getRepo().updateJeno(id, patch)
  return NextResponse.json({ ok: true, item: updated })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  await getRepo().deleteJeno(id)
  return NextResponse.json({ ok: true })
}
