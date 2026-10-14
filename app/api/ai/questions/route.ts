import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getGuestKey, getSession } from '@/lib/auth'
import { uid } from '@/lib/utils'
import type { AiQuestion } from '@/lib/types'

export const dynamic = 'force-dynamic'

/**
 * এআই যখন নির্ভরযোগ্য উত্তর দিতে পারে না, প্রশ্নটি এখানে জমা হয়
 * এবং অ্যাডমিন প্যানেলের “এআই প্রশ্ন পর্যালোচনা” বিভাগে দেখা যায়।
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<AiQuestion> | null
  const question = (body?.question || '').trim()
  if (!question) return NextResponse.json({ error: 'প্রশ্ন লিখুন' }, { status: 400 })

  const session = await getSession()
  const q: AiQuestion = {
    id: uid('aiq'),
    question: question.slice(0, 1000),
    userId: session?.id || null,
    userName: session?.name || body?.userName || '',
    userKey: session ? `u:${session.id}` : `g:${await getGuestKey()}`,
    trackCode: uid('q').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() + Math.random().toString(36).slice(2, 6),
    imageUrl: body?.imageUrl || '',
    aiAnalysis: body?.aiAnalysis || '',
    missingInfo: body?.missingInfo || '',
    searchResults: body?.searchResults || [],
    status: 'new',
    speciesSlug: body?.speciesSlug || '',
    createdAt: new Date().toISOString(),
  }
  await getRepo().createAiQuestion?.(q)
  return NextResponse.json({ ok: true, trackCode: q.trackCode, id: q.id })
}

export async function GET() {
  const session = await getSession()
  const key = session ? `u:${session.id}` : `g:${await getGuestKey()}`
  const all = (await getRepo().listAiQuestions?.()) || []
  const items = all.filter((q) => q.userKey === key)
  return NextResponse.json({ items })
}
