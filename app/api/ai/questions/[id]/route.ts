import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import type { AiQuestion } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function requireStaff() {
  const s = await getSession()
  return !!s && ['admin', 'super_admin', 'editor'].includes(s.role)
}

/** অ্যাডমিন/এডিটর উত্তর লিখে প্রকাশ করবে */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireStaff())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const body = (await req.json().catch(() => null)) as Partial<AiQuestion> | null
  if (!body) return NextResponse.json({ error: 'তথ্য নেই' }, { status: 400 })
  const session = await getSession()

  const patch: Partial<AiQuestion> = {}
  if (body.status) patch.status = body.status
  if (body.answer !== undefined) {
    patch.answer = body.answer
    patch.answeredBy = session?.name || 'অ্যাডমিন'
    if (body.answer) patch.status = 'answered'
  }
  if (body.suggestToKnowledgeBase !== undefined) patch.suggestToKnowledgeBase = !!body.suggestToKnowledgeBase
  if (body.speciesSlug) patch.speciesSlug = body.speciesSlug

  const updated = await getRepo().updateAiQuestion?.(id, patch)
  if (!updated) return NextResponse.json({ error: 'পাওয়া যায়নি' }, { status: 404 })
  return NextResponse.json({ ok: true, question: updated })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireStaff())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  await getRepo().updateAiQuestion?.(id, { status: 'resolved' })
  return NextResponse.json({ ok: true })
}
