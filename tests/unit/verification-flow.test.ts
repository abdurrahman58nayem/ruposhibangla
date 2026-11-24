import { describe, expect, it } from 'vitest'
import {
  RETRY_COOLDOWN_DAYS,
  approvePatch,
  decidedVerifications,
  isValidEvidence,
  pendingVerifications,
  rejectPatch,
  requestStatusLabel,
  retryDaysLeft,
  revokePatch,
} from '@/lib/verification'
import type { UserRecord, VerificationRequest } from '@/lib/types'

const reviewer = { id: 'u-admin', name: 'অ্যাডমিন' }

function user(partial: Partial<UserRecord> = {}): UserRecord {
  return {
    id: partial.id || 'u1',
    username: partial.username || 'ratul',
    name: partial.name || 'রাতুল',
    role: partial.role || 'user',
    verified: partial.verified ?? false,
    createdAt: partial.createdAt || '2025-01-01T00:00:00.000Z',
    followers: 0,
    following: 0,
    passwordHash: '',
    verificationRequest: partial.verificationRequest,
    ...partial,
  } as UserRecord
}

function request(status: VerificationRequest['status'], at = '2026-01-01T00:00:00.000Z'): VerificationRequest {
  return { status, note: 'সুন্দরবনে দীর্ঘদিন কাজ করছি', requestedAt: at }
}

describe('নীল টিক — আবেদনের অবস্থা', () => {
  it('অপেক্ষমাণ আবেদন পুরোনো আগে দেখানো হয়', () => {
    const old = user({ id: 'a', verificationRequest: request('pending', '2026-01-01T00:00:00Z') })
    const fresh = user({ id: 'b', verificationRequest: request('pending', '2026-03-01T00:00:00Z') })
    const none = user({ id: 'c' })
    const already = user({ id: 'd', verified: true, verificationRequest: request('pending') })

    const queue = pendingVerifications([fresh, old, none, already])
    expect(queue.map((u) => u.id)).toEqual(['a', 'b'])
  })

  it('সিদ্ধান্ত হয়ে গেলে কিউ থেকে সরে যায়, ইতিহাসে থাকে', () => {
    const decided = user({
      id: 'e',
      verificationRequest: { ...request('approved'), reviewedAt: '2026-02-01T00:00:00Z' },
    })
    expect(pendingVerifications([decided])).toHaveLength(0)
    expect(decidedVerifications([decided]).map((u) => u.id)).toEqual(['e'])
  })

  it('অবস্থার লেবেল ব্যবহারকারীর ভাষায়', () => {
    expect(requestStatusLabel(undefined)).toBe('আবেদন করেননি')
    expect(requestStatusLabel(request('pending'))).toBe('পর্যালোচনাধীন')
    expect(requestStatusLabel(request('approved'), true)).toBe('যাচাইকৃত ✔')
    expect(requestStatusLabel(request('rejected'))).toBe('প্রত্যাখ্যাত')
  })
})

describe('নীল টিক — অনুমোদন', () => {
  it('যাচাইকৃত হয়, সাধারণ ব্যবহারকারী পার্টনার হন', () => {
    const patch = approvePatch(user(), reviewer, new Date('2026-05-01T10:00:00Z'))
    expect(patch.verified).toBe(true)
    expect(patch.role).toBe('partner')
    expect(patch.verificationRequest?.status).toBe('approved')
    expect(patch.verificationRequest?.reviewedBy).toBe('u-admin')
    expect(patch.verificationRequest?.reviewedAt).toBe('2026-05-01T10:00:00.000Z')
  })

  it('অ্যাডমিন/এডিটরের ভূমিকা নামানো হয় না', () => {
    for (const role of ['admin', 'super_admin', 'editor'] as const) {
      const patch = approvePatch(user({ role }), reviewer)
      expect(patch.role, role).toBeUndefined()
      expect(patch.verified).toBe(true)
    }
  })

  it('আগের আবেদনের লেখা ও তারিখ অটুট থাকে', () => {
    const u = user({ verificationRequest: request('pending', '2026-04-02T00:00:00Z') })
    const patch = approvePatch(u, reviewer)
    expect(patch.verificationRequest?.note).toBe(u.verificationRequest!.note)
    expect(patch.verificationRequest?.requestedAt).toBe('2026-04-02T00:00:00Z')
  })
})

describe('নীল টিক — প্রত্যাখ্যান ও প্রত্যাহার', () => {
  it('প্রত্যাখ্যানে কারণ সংরক্ষিত হয়, টিক দেওয়া হয় না', () => {
    const patch = rejectPatch(user(), reviewer, '  প্রমাণসূত্রটি   কাজ করছে না  ')
    expect(patch.verified).toBeUndefined()
    expect(patch.verificationRequest?.status).toBe('rejected')
    // অতিরিক্ত ফাঁক সরু হয়
    expect(patch.verificationRequest?.reason).toBe('প্রমাণসূত্রটি কাজ করছে না')
  })

  it('কারণ ফাঁকা হলে তবুও কিছু লেখা থাকে (GUI যেন ফাঁকা না দেখায়)', () => {
    const patch = rejectPatch(user(), reviewer, '   ')
    expect(patch.verificationRequest?.reason).toBe('কারণ লেখা হয়নি')
  })

  it('কারণ ২০০ অক্ষরে সীমিত', () => {
    const patch = rejectPatch(user(), reviewer, 'ক'.repeat(500))
    expect(patch.verificationRequest?.reason?.length).toBe(200)
  })

  it('প্রত্যাহারে টিক যায়, পার্টনার আবার সাধারণ ব্যবহারকারী', () => {
    const patch = revokePatch(user({ role: 'partner', verified: true }), reviewer, 'ভুলে দেওয়া হয়েছিল')
    expect(patch.verified).toBe(false)
    expect(patch.role).toBe('user')
    expect(patch.verificationRequest?.status).toBe('rejected')
  })
})

describe('নীল টিক — পুনরায় আবেদন', () => {
  it('প্রত্যাখ্যানের পর ১৪ দিন অপেক্ষা', () => {
    const now = new Date('2026-06-10T00:00:00Z')
    const req = { ...request('rejected'), reviewedAt: '2026-06-05T00:00:00Z' }
    expect(retryDaysLeft(req, now)).toBe(RETRY_COOLDOWN_DAYS - 5)
    expect(retryDaysLeft({ ...request('rejected'), reviewedAt: '2026-05-01T00:00:00Z' }, now)).toBe(0)
    expect(retryDaysLeft(request('pending'), now)).toBe(0)
    expect(retryDaysLeft(undefined, now)).toBe(0)
  })
})

describe('নীল টিক — প্রমাণসূত্রের যাচাই', () => {
  it('শুধু পূর্ণ http(s) লিংক গ্রহণযোগ্য', () => {
    expect(isValidEvidence('')).toBe(true) // ঐচ্ছিক
    expect(isValidEvidence('https://example.org/me')).toBe(true)
    expect(isValidEvidence('http://example.org')).toBe(true)
    expect(isValidEvidence('example.org')).toBe(false)
    expect(isValidEvidence('javascript:alert(1)')).toBe(false)
    expect(isValidEvidence('https://ok.example/' + 'a'.repeat(400))).toBe(false)
  })
})
