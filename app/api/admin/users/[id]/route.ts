import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import type { UserRecord } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const body = (await req.json().catch(() => null)) as Partial<UserRecord> | null
  if (!body) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const allowed: Partial<UserRecord> = {}
  if (typeof body.verified === 'boolean') allowed.verified = body.verified
  if (body.role) allowed.role = body.role
  if (typeof body.bio === 'string') allowed.bio = body.bio
  if (typeof body.name === 'string') allowed.name = body.name
  if (typeof body.avatar === 'string') allowed.avatar = body.avatar
  if (typeof body.location === 'string') allowed.location = body.location
  const updated = await getRepo().updateUser(id, allowed)
  return NextResponse.json({ ok: true, user: updated })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  if (id === session.id) return NextResponse.json({ error: 'নিজেকে মুছতে পারবেন না' }, { status: 400 })
  await getRepo().deleteUser(id)
  return NextResponse.json({ ok: true })
}
