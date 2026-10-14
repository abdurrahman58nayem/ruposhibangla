/**
 * হালকা ইন-মেমোরি রেট লিমিটার (§20) — নির্দিষ্ট সময়-জানালায় নির্দিষ্ট সংখ্যক রিকোয়েস্ট।
 *
 * কেন: অতিথিরাও (অ্যাকাউন্ট ছাড়াই) পোস্ট, মন্তব্য, রিপোর্ট ও এআই প্রশ্ন পাঠাতে পারে —
 * তাই স্প্যাম/অপব্যবহার ঠেকাতে প্রতিটি সংবেদনশীল রুটে সার্ভার-পাশে সীমা বাঁধা দরকার।
 *
 * সীমাবদ্ধতা: এটি প্রতি ইনস্ট্যান্সে (মেমোরিতে) কাজ করে। সার্ভারলেস/একাধিক ইনস্ট্যান্সে
 * চালালে হিসাব ভাগ হয়ে যায় — তখন Neon/Upstash-এর মতো কেন্দ্রীয় স্টোর ব্যবহার করতে হবে।
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()
const MAX_KEYS = 20_000

export type RateRule = {
  /** জানালা — মিলিসেকেন্ডে */
  windowMs: number
  /** জানালায় সর্বোচ্চ কতটি রিকোয়েস্ট */
  max: number
}

export const RULES = {
  /** পোস্ট/মন্তব্য/রিপোর্ট/পর্যবেক্ষণ — একই আইপি থেকে */
  write: { windowMs: 60_000, max: 20 },
  /** এআই প্রশ্ন — মডেল খরচের কারণে কড়া */
  ai: { windowMs: 60_000, max: 12 },
  /** লগইন/রেজিস্ট্রেশন — ব্রুট-ফোর্স প্রতিরোধ */
  auth: { windowMs: 5 * 60_000, max: 10 },
  /** আপলোড */
  upload: { windowMs: 60_000, max: 15 },
  /** সাধারণ GET */
  read: { windowMs: 60_000, max: 180 },
} satisfies Record<string, RateRule>

function sweep(now: number) {
  if (buckets.size < MAX_KEYS) return
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
  // তবুও বড় থাকলে পুরোনো অর্ধেক ফেলে দেওয়া
  if (buckets.size >= MAX_KEYS) {
    const keys = [...buckets.keys()].slice(0, Math.floor(MAX_KEYS / 2))
    keys.forEach((k) => buckets.delete(k))
  }
}

export type RateResult = { ok: boolean; remaining: number; retryAfterSec: number; limit: number }

export function rateLimit(key: string, rule: RateRule): RateResult {
  const now = Date.now()
  sweep(now)
  const cur = buckets.get(key)
  if (!cur || cur.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + rule.windowMs })
    return { ok: true, remaining: rule.max - 1, retryAfterSec: 0, limit: rule.max }
  }
  cur.count += 1
  const retryAfterSec = Math.max(1, Math.ceil((cur.resetAt - now) / 1000))
  return {
    ok: cur.count <= rule.max,
    remaining: Math.max(0, rule.max - cur.count),
    retryAfterSec,
    limit: rule.max,
  }
}

/** রিকোয়েস্ট হেডার থেকে ক্লায়েন্ট-আইডি বের করে — প্রক্সির পেছনে থাকলে x-forwarded-for */
export function clientKey(req: Request, scope: string, extra?: string): string {
  const h = (req as any).headers as Headers
  const fwd = h.get('x-forwarded-for') || ''
  const ip = fwd.split(',')[0].trim() || h.get('x-real-ip') || 'unknown'
  return `${scope}:${ip}${extra ? `:${extra}` : ''}`
}

/** রুট হ্যান্ডলারে সহজে ব্যবহারের হেল্পার */
export function guard(req: Request, rule: RateRule, scope: string, extra?: string): RateResult {
  return rateLimit(clientKey(req, scope, extra), rule)
}

export function tooManyRequests(res: RateResult) {
  return new Response(
    JSON.stringify({
      error: `খুব বেশি রিকোয়েস্ট পাঠানো হয়েছে। ${res.retryAfterSec} সেকেন্ড পর আবার চেষ্টা করুন।`,
    }),
    {
      status: 429,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'retry-after': String(res.retryAfterSec),
        'x-ratelimit-limit': String(res.limit),
        'x-ratelimit-remaining': String(res.remaining),
      },
    },
  )
}
