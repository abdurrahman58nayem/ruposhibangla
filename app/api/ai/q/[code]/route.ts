import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getGuestKey, getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/** গেস্ট ট্র্যাকিং কোড দিয়ে নিজের প্রশ্নের উত্তর দেখা */
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const q = await getRepo().getAiQuestionByCode?.(code)
  if (!q) return NextResponse.json({ error: 'প্রশ্নটি পাওয়া যায়নি' }, { status: 404 })
  return NextResponse.json({
    question: q.question,
    status: q.status,
    answer: q.answer || '',
    aiAnalysis: q.aiAnalysis || '',
    answeredAt: q.answeredAt || null,
    createdAt: q.createdAt,
  })
}
