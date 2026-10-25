import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getGuestKey, getSession } from '@/lib/auth'
import { uid } from '@/lib/utils'
import type { Report, UserRole } from '@/lib/types'
import { guard as rateGuard, tooManyRequests, RULES } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/** যেকেউ (অতিথিসহ) অনুপযুক্ত কনটেন্ট রিপোর্ট করতে পারবে */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<Report> | null
  const _rl = await rateGuard(req, RULES.write, 'reports')
  if (!_rl.ok) return tooManyRequests(_rl)

  if (!body?.targetType || !body?.targetId) {
    return NextResponse.json({ error: 'রিপোর্টের বিষয় দিন' }, { status: 400 })
  }
  const session = await getSession()
  const report: Report = {
    id: uid('rep'),
    targetType: body.targetType,
    targetId: String(body.targetId),
    reason: body.reason || 'অনির্দিষ্ট',
    details: body.details || '',
    reporterName: session?.name || body.reporterName || 'অতিথি',
    reporterKey: session ? `u:${session.id}` : `g:${await getGuestKey()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  await getRepo().createReport?.(report)
  return NextResponse.json({ ok: true })
}

/** রিপোর্টের অবস্থা পরিবর্তন — অ্যাডমিন/এডিটর */
export async function PATCH(req: Request) {
  const session = await getSession()
  if (!session || !['admin', 'super_admin', 'editor'].includes(session.role)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const body = (await req.json().catch(() => null)) as { id?: string; status?: Report['status'] } | null
  if (!body?.id) return NextResponse.json({ error: 'রিপোর্ট নির্বাচন করুন' }, { status: 400 })
  const updated = await getRepo().updateReport?.(body.id, { status: body.status })
  if (!updated) return NextResponse.json({ error: 'পাওয়া যায়নি' }, { status: 404 })
  return NextResponse.json({ ok: true, report: updated })
}
