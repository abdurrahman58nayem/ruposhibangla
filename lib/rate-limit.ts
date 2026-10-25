/**
 * হালকা ইন-মেমোরি রেট লিমিটার (§20) — নির্দিষ্ট সময়-জানালায় নির্দিষ্ট সংখ্যক রিকোয়েস্ট।
 *
 * কেন: অতিথিরাও (অ্যাকাউন্ট ছাড়াই) পোস্ট, মন্তব্য, রিপোর্ট ও এআই প্রশ্ন পাঠাতে পারে —
 * তাই স্প্যাম/অপব্যবহার ঠেকাতে প্রতিটি সংবেদনশীল রুটে সার্ভার-পাশে সীমা বাঁধা দরকার।
 *
 * দুই স্তরের কাঠামো:
 *  ১) **কেন্দ্রীয় স্টোর (ঐচ্ছিক)** — `UPSTASH_REDIS_REST_URL` ও
 *     `UPSTASH_REDIS_REST_TOKEN` সেট থাকলে Upstash Redis REST-এ ফিক্সড-উইন্ডো
 *     কাউন্টার রাখা হয়। একাধিক ইনস্ট্যান্স/সার্ভারলেস ফাংশনেও একই সীমা কার্যকর।
 *  ২) **ইন-মেমোরি ফলব্যাক** — উপরের সেটিং নেই বা কেন্দ্রীয় স্টোর সাময়িকভাবে
 *     ব্যর্থ হলে প্রতিটি ইনস্ট্যান্স নিজে গোনে (কখনো রিকোয়েস্ট আটকে যায় না)।
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

/* ------------------------------------------------------------------ */
/* ঐচ্ছিক কেন্দ্রীয় স্টোর (Upstash Redis REST)                          */
/* ------------------------------------------------------------------ */

const UPSTASH_URL = (process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, '')
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

/** কেন্দ্রীয় স্টোর কনফিগার করা আছে কি না (ডকুমেন্টেশন/ডায়াগনস্টিকসের জন্য) */
export const sharedLimiterEnabled = Boolean(UPSTASH_URL && UPSTASH_TOKEN)

let warnedSharedFailure = false

type UpstashPipelineReply = { result?: number | string | null; error?: string }[]

/**
 * কেন্দ্রীয় স্টোরে এক ধাপ গোনা। কনফিগার না থাকলে/ব্যর্থ হলে `null` —
 * তখন ডাকনেকার ইন-মেমোরি ফলব্যাকে যায়।
 */
async function sharedLimit(key: string, rule: RateRule): Promise<RateResult | null> {
  if (!sharedLimiterEnabled) return null
  const now = Date.now()
  const bucket = Math.floor(now / rule.windowMs)
  const redisKey = `rl:${key}:${bucket}`
  const resetAt = (bucket + 1) * rule.windowMs
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'content-type': 'application/json',
      },
      // INCR আগে, তারপর TTL (NX — বিদ্যমান TTL বদলায় না)
      body: JSON.stringify([
        ['INCR', redisKey],
        ['PEXPIRE', redisKey, rule.windowMs + 1000, 'NX'],
      ]),
      signal: AbortSignal.timeout(1500),
    })
    if (!res.ok) throw new Error(`upstash ${res.status}`)
    const data = (await res.json()) as UpstashPipelineReply
    const count = Number(data?.[0]?.result)
    if (!Number.isFinite(count) || count <= 0) throw new Error('upstash bad reply')
    return {
      ok: count <= rule.max,
      remaining: Math.max(0, rule.max - count),
      retryAfterSec: Math.max(1, Math.ceil((resetAt - now) / 1000)),
      limit: rule.max,
    }
  } catch (e) {
    if (!warnedSharedFailure) {
      warnedSharedFailure = true
      console.warn('[rate-limit] কেন্দ্রীয় স্টোর অব্যবহারযোগ্য — ইন-মেমোরি ফলব্যাকে চলছে:', (e as Error)?.message || e)
    }
    return null
  }
}

/**
 * রুট হ্যান্ডলারে সহজে ব্যবহারের হেল্পার — কেন্দ্রীয় স্টোর থাকলে সেটি, নইলে মেমোরি।
 * (কেন্দ্রীয় স্টোর ব্যবহার করলে এটিকে `await` করতে হবে।)
 */
export async function guard(req: Request, rule: RateRule, scope: string, extra?: string): Promise<RateResult> {
  const key = clientKey(req, scope, extra)
  const shared = await sharedLimit(key, rule)
  return shared ?? rateLimit(key, rule)
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
