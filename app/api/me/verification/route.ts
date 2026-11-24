import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import type { VerificationRequest } from '@/lib/types'
import {
  EVIDENCE_MAX, NOTE_MAX, RETRY_COOLDOWN_DAYS, isValidEvidence, retryDaysLeft,
} from '@/lib/verification'
import { uid } from '@/lib/utils'

export const dynamic = 'force-dynamic'

/** বর্তমান আবেদনের অবস্থা */
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 })
  const user = await getRepo().getUserById(session.id)
  if (!user) return NextResponse.json({ error: 'ব্যবহারকারী পাওয়া যায়নি' }, { status: 404 })
  return NextResponse.json({
    verified: !!user.verified,
    request: user.verificationRequest || null,
    cooldownDays: RETRY_COOLDOWN_DAYS,
  })
}

/**
 * নীল টিকের আবেদন জমা দেওয়া।
 *  • আগেই যাচাইকৃত হলে বা অনুরোধ ঝুলে থাকলে নতুন আবেদন নেওয়া হয় না
 *  • প্রত্যাখ্যানের পর ১৪ দিন অপেক্ষা
 */
export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 })

  const body = (await req.json().catch(() => null)) as { note?: string; evidence?: string } | null
  if (!body) return NextResponse.json({ error: 'তথ্য নেই' }, { status: 400 })

  const note = String(body.note || '').trim().replace(/\s+/g, ' ')
  const evidence = String(body.evidence || '').trim().replace(/\s+/g, ' ')
  if (note.length < 20) {
    return NextResponse.json({ error: 'কেন যাচাই দরকার — অন্তত ২০ অক্ষরে লিখুন' }, { status: 400 })
  }
  if (note.length > NOTE_MAX || evidence.length > EVIDENCE_MAX) {
    return NextResponse.json({ error: 'লেখা বেশি লম্বা হয়েছে' }, { status: 400 })
  }
  // প্রমাণসূত্র দিলে লিংক হতে হবে — মুক্ত লেখা নয়
  if (!isValidEvidence(evidence)) {
    return NextResponse.json({ error: 'প্রমাণসূত্র একটি পূর্ণ লিংক হতে হবে (https://…)' }, { status: 400 })
  }

  const repo = getRepo()
  const user = await repo.getUserById(session.id)
  if (!user) return NextResponse.json({ error: 'ব্যবহারকারী পাওয়া যায়নি' }, { status: 404 })
  if (user.verified) return NextResponse.json({ error: 'আপনি ইতিমধ্যেই যাচাইকৃত' }, { status: 400 })

  const prev = user.verificationRequest
  if (prev?.status === 'pending') {
    return NextResponse.json({ error: 'আপনার আগের আবেদন এখনো পর্যালোচনাধীন' }, { status: 400 })
  }
  const daysLeft = retryDaysLeft(prev)
  if (daysLeft > 0) {
    return NextResponse.json(
      { error: `আবার আবেদন করতে ${daysLeft} দিন বাকি`, daysLeft },
      { status: 429 },
    )
  }

  const request: VerificationRequest = {
    status: 'pending',
    note: note.slice(0, NOTE_MAX),
    evidence: evidence ? evidence.slice(0, EVIDENCE_MAX) : undefined,
    requestedAt: new Date().toISOString(),
  }
  const updated = await repo.updateUser(session.id, { verificationRequest: request })
  if (!updated) return NextResponse.json({ error: 'সংরক্ষণ করা যায়নি' }, { status: 400 })

  // অ্যাডমিনদের জানানো হয় যেন কেউ চোখে না পড়ে থেকে না যায়
  // অ্যাডমিন অ্যাকাউন্টগুলোতে নোটিফিকেশন — কেউ চোখে না পড়ে থেকে না যায়
  try {
    const admins = (await repo.listUsers()).filter((u) => u.role === 'admin' || u.role === 'super_admin')
    await Promise.all(
      admins.map((admin) =>
        repo.addNotification?.({
          id: uid('ntf'),
          userKey: `u:${admin.id}`,
          type: 'system',
          title: 'নীল টিকের নতুন আবেদন',
          body: `${updated.name} (@${updated.username}) যাচাইয়ের আবেদন করেছেন`,
          url: '/admin/users',
          read: false,
          createdAt: new Date().toISOString(),
        }),
      ),
    )
  } catch {
    /* নোটিফিকেশন ব্যর্থ হলেও আবেদন জমা থাকবে */
  }

  return NextResponse.json({ ok: true, request })
}

/** আবেদন প্রত্যাহার — কেবল পর্যালোচনার আগে */
export async function DELETE() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 })
  const user = await getRepo().getUserById(session.id)
  if (!user) return NextResponse.json({ error: 'ব্যবহারকারী পাওয়া যায়নি' }, { status: 404 })
  if (user.verificationRequest?.status !== 'pending') {
    return NextResponse.json({ error: 'প্রত্যাহার করার মতো আবেদন নেই' }, { status: 400 })
  }
  const updated = await getRepo().updateUser(session.id, { verificationRequest: undefined })
  return NextResponse.json({ ok: true, user: updated ? { verified: !!updated.verified } : null })
}
