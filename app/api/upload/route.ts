import { NextResponse } from 'next/server'
import {
  storeFile,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_BYTES_ANON,
  storageKindAsync,
  isAllowedContentType,
  extensionFor,
} from '@/lib/storage'
import { getSession } from '@/lib/auth'
import { RULES, guard, tooManyRequests } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * ছবি/ভিডিও আপলোড।
 *
 * কঠোরতা (আগে ছিল না):
 *  ১) **কনটেন্ট-টাইপ হোয়াইটলিস্ট** — `image/*` পুরোটা নয়; SVG বাদ (stored XSS)।
 *     এক্সটেনশনও MIME থেকেই আসে, ফাইলনেম থেকে নয়।
 *  ২) **দিনে কোটা** — মিনিটে ১৫টি × ২৫MB মানে এক আইপি থেকে দিনে গিগাবাইট।
 *     বেনামি: দিনে ১০টি, অ্যাকাউন্ট: ৬০টি, অ্যাডমিন: ৩০০টি।
 *  ৩) **বেনামি বড় ফাইল কম** — ২৫MB নয়, ৮MB (ভিডিও শুধু অ্যাকাউন্টে)।
 *  ৪) **ম্যাজিক-বাইট যাচাই** — পাঠানো MIME আর ফাইলের আসল শুরু মিলছে কি না।
 */

/** দিনে কতটি আপলোড (ভূমিকা অনুযায়ী) */
const DAILY_MAX = { guest: 10, user: 60, admin: 300 } as const

/** ফাইলের প্রথম কয়েক বাইট দেখে ধরন মেলে কি না */
function sniffMatches(buffer: Buffer, contentType: string): boolean {
  const hex = buffer.subarray(0, 12).toString('hex').toLowerCase()
  const ascii = buffer.subarray(0, 12).toString('latin1')
  if (contentType === 'image/jpeg' || contentType === 'image/jpg') return hex.startsWith('ffd8ff')
  if (contentType === 'image/png') return hex.startsWith('89504e470d0a1a0a')
  if (contentType === 'image/gif') return ascii.startsWith('GIF8')
  if (contentType === 'image/webp') return ascii.startsWith('RIFF') && ascii.slice(8, 12) === 'WEBP'
  if (contentType === 'image/avif') return ascii.slice(4, 8) === 'ftyp' && /avi[fs]/.test(ascii.slice(8, 12))
  if (contentType === 'video/mp4' || contentType === 'video/quicktime') return ascii.slice(4, 8) === 'ftyp'
  if (contentType === 'video/webm') return hex.startsWith('1a45dfa3')
  return false
}

function tooManyDaily(retryAfterSec: number) {
  return NextResponse.json(
    { error: 'আজকের আপলোড-সীমা শেষ। আগামীকাল আবার চেষ্টা করুন।' },
    { status: 429, headers: { 'retry-after': String(retryAfterSec) } },
  )
}

export async function POST(req: Request) {
  const _rl = await guard(req, RULES.upload, 'upload')
  if (!_rl.ok) return tooManyRequests(_rl)

  const session = await getSession()
  const role = session?.role === 'admin' ? 'admin' : session ? 'user' : 'guest'

  // দিনে কতটি — কেন্দ্রীয় স্টোর থাকলে সেখানেই, নইলে ইন-মেমোরি
  const daily = await guard(req, RULES.uploadDaily, `upload-day-${role}`, session?.id)
  if (!daily.ok) return tooManyDaily(daily.retryAfterSec)

  const form = await req.formData().catch(() => null)
  const file = form?.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'ফাইল পাওয়া যায়নি' }, { status: 400 })

  const contentType = (file.type || '').toLowerCase().split(';')[0].trim()
  if (!isAllowedContentType(contentType)) {
    return NextResponse.json(
      { error: 'এই ধরনের ফাইল সমর্থিত নয়। ছবি: JPEG/PNG/WebP/GIF/AVIF · ভিডিও: MP4/WebM/MOV' },
      { status: 415 },
    )
  }
  const isVideo = contentType.startsWith('video/')
  if (isVideo && !session) {
    return NextResponse.json({ error: 'ভিডিও আপলোড করতে অ্যাকাউন্ট দরকার' }, { status: 401 })
  }

  const maxBytes = session ? MAX_UPLOAD_BYTES : MAX_UPLOAD_BYTES_ANON
  if (file.size > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024))
    return NextResponse.json({ error: `ফাইলটি অনেক বড় (সর্বোচ্চ ${mb} মেগাবাইট)` }, { status: 413 })
  }
  if (file.size < 64) return NextResponse.json({ error: 'ফাইলটি খালি বা নষ্ট' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  if (!sniffMatches(buffer, contentType)) {
    return NextResponse.json({ error: 'ফাইলের আসল ধরন ঘোষিত ধরনের সাথে মিলছে না' }, { status: 400 })
  }

  const folder = role === 'admin' ? 'uploads/admin' : 'uploads/community'
  const safeName = `${Date.now().toString(36)}.${extensionFor(contentType, file.name)}`
  const { url, key } = await storeFile(buffer, contentType, safeName, folder)
  return NextResponse.json({
    ok: true,
    url,
    key,
    mediaType: isVideo ? 'video' : 'image',
    storage: await storageKindAsync(),
    dailyRemaining: daily.remaining,
  })
}

/** ডায়াগনস্টিকস — কোন ধরনগুলো অনুমোদিত ও আজ কতটি বাকি */
export async function GET(req: Request) {
  const session = await getSession()
  const role = session?.role === 'admin' ? 'admin' : session ? 'user' : 'guest'
  return NextResponse.json({
    allowed: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'video/mp4', 'video/webm', 'video/quicktime'],
    maxBytes: session ? MAX_UPLOAD_BYTES : MAX_UPLOAD_BYTES_ANON,
    dailyMax: DAILY_MAX[role],
    role,
    storage: await storageKindAsync(),
  })
}
