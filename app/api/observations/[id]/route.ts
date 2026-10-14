import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import type { Observation } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function requireAdminOrEditor() {
  const s = await getSession()
  return !!s && ['admin', 'super_admin', 'editor'].includes(s.role)
}

/** যাচাইকরণ — অ্যাডমিন/এডিটর শনাক্তকরণ নিশ্চিত করতে পারবে */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminOrEditor())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const body = (await req.json().catch(() => null)) as Partial<Observation> | null
  if (!body) return NextResponse.json({ error: 'তথ্য নেই' }, { status: 400 })
  const session = await getSession()
  const updated = await getRepo().updateObservation?.(id, {
    ...(body.status ? { status: body.status } : {}),
    ...(body.speciesSlug ? { speciesSlug: body.speciesSlug } : {}),
    ...(body.identifiedBy ? { identifiedBy: body.identifiedBy } : { identifiedBy: session?.name }),
    ...(body.uncertain !== undefined ? { uncertain: body.uncertain } : {}),
  })
  if (!updated) return NextResponse.json({ error: 'পাওয়া যায়নি' }, { status: 404 })
  return NextResponse.json({ ok: true, observation: updated })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminOrEditor())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  await getRepo().updateObservation?.(id, { status: 'rejected' })
  return NextResponse.json({ ok: true })
}
