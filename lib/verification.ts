import type { VerificationRequest, UserRecord } from '@/lib/types'

/**
 * নীল টিকের আবেদন — অ্যাডমিন সিদ্ধান্তের নিয়ম।
 *
 * এখানে আলাদা রাখা হয়েছে যেন (ক) UI ও API একই নিয়ম মানে, (খ) ফাংশনগুলো
 * ইউনিট-পরীক্ষায় সরাসরি যাচাই করা যায়।
 */

export const REASON_MAX = 200
export const NOTE_MAX = 400
export const EVIDENCE_MAX = 300
/** প্রত্যাখ্যানের পর আবার আবেদনের অপেক্ষা */
export const RETRY_COOLDOWN_DAYS = 14

/** যে ব্যবহারকারীদের সিদ্ধান্তের অপেক্ষা আছে — পুরোনো আবেদন আগে */
export function pendingVerifications(users: UserRecord[]): UserRecord[] {
  return users
    .filter((u) => u.verificationRequest?.status === 'pending' && !u.verified)
    .sort(
      (a, b) =>
        +new Date(a.verificationRequest!.requestedAt) - +new Date(b.verificationRequest!.requestedAt),
    )
}

/** সিদ্ধান্ত হয়ে গেছে — সাম্প্রতিক আগে (অ্যাডমিনের হিসাব/নজরের জন্য) */
export function decidedVerifications(users: UserRecord[], limit = 20): UserRecord[] {
  return users
    .filter((u) => u.verificationRequest && u.verificationRequest.status !== 'pending')
    .sort(
      (a, b) =>
        +new Date(b.verificationRequest!.reviewedAt || b.verificationRequest!.requestedAt) -
        +new Date(a.verificationRequest!.reviewedAt || a.verificationRequest!.requestedAt),
    )
    .slice(0, limit)
}

function clean(value: unknown, max: number): string {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, max)
}

/** অনুমোদন — যাচাইকৃত + পার্টনার ভূমিকা (আগে থেকেই অ্যাডমিন হলে ভূমিকা বদলায় না) */
export function approvePatch(
  user: Pick<UserRecord, 'role' | 'verificationRequest'>,
  by: { id: string; name: string },
  now = new Date(),
): Partial<UserRecord> {
  const request: VerificationRequest = {
    ...(user.verificationRequest || { note: '', requestedAt: now.toISOString() }),
    status: 'approved',
    note: user.verificationRequest?.note || '',
    requestedAt: user.verificationRequest?.requestedAt || now.toISOString(),
    reviewedAt: now.toISOString(),
    reviewedBy: by.id,
    reviewedByName: by.name,
    reason: undefined,
  }
  const patch: Partial<UserRecord> = { verified: true, verificationRequest: request }
  // অ্যাডমিন/এডিটরকে পার্টনারে নামানো হয় না — তাঁদের ক্ষমতা অটুট থাকে
  if (user.role === 'user') patch.role = 'partner'
  return patch
}

/**
 * প্রত্যাখ্যান — কারণ বাধ্যতামূলক, যাতে ব্যবহারকারী জানতে পারেন কী উন্নত
 * করতে হবে। যাচাইকৃত ব্যবহারকারীর টিক কেড়ে নেওয়ার জন্যও এটিই পথ।
 */
export function rejectPatch(
  user: Pick<UserRecord, 'role' | 'verificationRequest'>,
  by: { id: string; name: string },
  reason: string,
  now = new Date(),
): Partial<UserRecord> {
  const request: VerificationRequest = {
    ...(user.verificationRequest || { note: '', requestedAt: now.toISOString() }),
    status: 'rejected',
    note: user.verificationRequest?.note || '',
    requestedAt: user.verificationRequest?.requestedAt || now.toISOString(),
    reviewedAt: now.toISOString(),
    reviewedBy: by.id,
    reviewedByName: by.name,
    reason: clean(reason, REASON_MAX) || 'কারণ লেখা হয়নি',
  }
  return { verificationRequest: request }
}

/** টিক প্রত্যাহার — আবেদন ছাড়াই অ্যাডমিনের সিদ্ধান্ত */
export function revokePatch(
  user: Pick<UserRecord, 'role' | 'verificationRequest'>,
  by: { id: string; name: string },
  reason: string,
  now = new Date(),
): Partial<UserRecord> {
  const patch = rejectPatch(user, by, reason, now)
  return { ...patch, verified: false, ...(user.role === 'partner' ? { role: 'user' as const } : {}) }
}

/** ব্যবহারকারীকে কী দেখানো হবে — সহজ ভাষায় */
export function requestStatusLabel(request?: VerificationRequest | null, verified?: boolean): string {
  if (verified && request?.status !== 'pending') return 'যাচাইকৃত ✔'
  if (!request) return 'আবেদন করেননি'
  if (request.status === 'pending') return 'পর্যালোচনাধীন'
  if (request.status === 'approved') return 'অনুমোদিত'
  return 'প্রত্যাখ্যাত'
}

/** আবার আবেদনের আগে কত দিন বাকি (না থাকলে ০) */
export function retryDaysLeft(request?: VerificationRequest | null, now = new Date()): number {
  if (request?.status !== 'rejected' || !request.reviewedAt) return 0
  const days = (now.getTime() - +new Date(request.reviewedAt)) / 86_400_000
  return days < RETRY_COOLDOWN_DAYS ? Math.ceil(RETRY_COOLDOWN_DAYS - days) : 0
}

/** প্রমাণসূত্র বৈধ কি না — কেবল পূর্ণ http(s) লিংক */
export function isValidEvidence(url: string): boolean {
  if (!url) return true
  return /^https?:\/\/\S+$/i.test(url.trim()) && url.trim().length <= EVIDENCE_MAX
}
