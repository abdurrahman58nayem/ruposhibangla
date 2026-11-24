import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { isAdminRole } from '@/lib/roles'
import { approvePatch, rejectPatch, revokePatch, REASON_MAX } from '@/lib/verification'
import type { UserRecord } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || !isAdminRole(session.role)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = (await req.json().catch(() => null)) as
    | (Partial<UserRecord> & { verificationAction?: 'approve' | 'reject' | 'revoke'; reason?: string })
    | null
  if (!body) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  const repo = getRepo()
  const target = await repo.getUserById(id)
  if (!target) return NextResponse.json({ error: 'ব্যবহারকারী পাওয়া যায়নি' }, { status: 404 })

  const reviewer = { id: session.id, name: session.name || session.username }

  // --- নীল টিকের সিদ্ধান্ত ---
  if (body.verificationAction) {
    const reason = String(body.reason || '').slice(0, REASON_MAX)
    if (body.verificationAction === 'reject' && !reason.trim()) {
      return NextResponse.json({ error: 'প্রত্যাখ্যানের কারণ লিখুন — ব্যবহারকারী এটা দেখতে পাবেন' }, { status: 400 })
    }
    const patch =
      body.verificationAction === 'approve'
        ? approvePatch(target, reviewer)
        : body.verificationAction === 'revoke'
          ? revokePatch(target, reviewer, reason)
          : rejectPatch(target, reviewer, reason)

    const updated = await repo.updateUser(id, patch)
    if (!updated) return NextResponse.json({ error: 'হালনাগাদ করা যায়নি' }, { status: 400 })

    // সিদ্ধান্তের কথা ব্যবহারকারীকে জানানো হয়
    try {
      const approved = body.verificationAction === 'approve'
      await repo.addNotification?.({
        id: `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        userKey: `u:${id}`,
        type: 'system',
        title: approved ? 'নীল টিক পাওয়া গেছে ✔' : 'যাচাইয়ের সিদ্ধান্ত',
        body: approved
          ? 'আপনার প্রোফাইল যাচাইকৃত হিসেবে দেখানো হবে — ধন্যবাদ!'
          : `আবেদনটি অনুমোদিত হয়নি${reason ? `: ${reason}` : ''}`,
        url: '/settings',
        read: false,
        createdAt: new Date().toISOString(),
      })
    } catch {
      /* নোটিফিকেশন ব্যর্থ হলেও সিদ্ধান্ত সংরক্ষিত থাকবে */
    }

    const { passwordHash: _p, ...rest } = updated
    return NextResponse.json({ ok: true, user: rest })
  }

  // --- সাধারণ সম্পাদনা ---
  const allowed: Partial<UserRecord> = {}
  if (typeof body.verified === 'boolean') allowed.verified = body.verified
  if (body.role) allowed.role = body.role
  if (typeof body.bio === 'string') allowed.bio = body.bio
  if (typeof body.name === 'string') allowed.name = body.name
  if (typeof body.avatar === 'string') allowed.avatar = body.avatar
  if (typeof body.location === 'string') allowed.location = body.location
  // মুছে ফেলার অনুরোধ অ্যাডমিন চাইলে বাতিলও করতে পারেন
  if (body.deletionRequested === false) allowed.deletionRequested = false

  // টিক সরাসরি খুলে দিলে আবেদনটিও "অনুমোদিত" হিসেবে লিখে রাখি — নইলে
  // পরে কে দিল, কখন দিল তার হিসাব থাকে না
  if (allowed.verified === true && !target.verificationRequest?.reviewedAt) {
    allowed.verificationRequest = approvePatch(target, reviewer).verificationRequest
  }

  const updated = await repo.updateUser(id, allowed)
  if (!updated) return NextResponse.json({ error: 'হালনাগাদ করা যায়নি' }, { status: 400 })
  const { passwordHash: _p, ...rest } = updated
  return NextResponse.json({ ok: true, user: rest })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || !isAdminRole(session.role)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { id } = await params
  if (id === session.id) return NextResponse.json({ error: 'নিজেকে মুছতে পারবেন না' }, { status: 400 })
  await getRepo().deleteUser(id)
  return NextResponse.json({ ok: true })
}
