import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

export type StoredFile = { url: string; key: string }

/** R2-এর যে কীগুলো দরকার (অ্যাডমিন প্যানেল থেকে সেট করা যায়, ডেটাবেজে জমা হয়) */
export const R2_SECRET_KEYS = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL',
] as const

export type R2Config = {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  publicUrl: string
  /** কোথা থেকে এলো — env না ডেটাবেজ (অ্যাডমিন প্যানেল) */
  source: 'env' | 'db' | 'none'
}

const EMPTY: R2Config = { accountId: '', accessKeyId: '', secretAccessKey: '', bucket: '', publicUrl: '', source: 'none' }

/**
 * R2 কনফিগারেশন আনে — প্রথমে env (Vercel/`.env.local`), না থাকলে ডেটাবেজ
 * (অ্যাডমিন প্যানেল → মিডিয়া / R2 থেকে সেট করা)।
 *
 * নিরাপত্তা: এই ফাংশন কেবল সার্ভার-সাইডে চলে; ক্রেডেনশিয়াল কখনো
 * ক্লায়েন্টে পাঠানো হয় না (GET /api/settings থেকে `secret:` কী বাদ দেওয়া হয়)।
 */
export async function loadR2Config(): Promise<R2Config> {
  const e = process.env
  if (e.R2_ACCOUNT_ID && e.R2_ACCESS_KEY_ID && e.R2_SECRET_ACCESS_KEY && e.R2_BUCKET_NAME) {
    return {
      accountId: e.R2_ACCOUNT_ID,
      accessKeyId: e.R2_ACCESS_KEY_ID,
      secretAccessKey: e.R2_SECRET_ACCESS_KEY,
      bucket: e.R2_BUCKET_NAME,
      publicUrl: e.R2_PUBLIC_URL || '',
      source: 'env',
    }
  }
  try {
    const { getRepo } = await import('@/lib/repo')
    const g = getRepo().getSecret
    if (typeof g === 'function') {
      const [accountId, accessKeyId, secretAccessKey, bucket, publicUrl] = await Promise.all(
        R2_SECRET_KEYS.map((k) => getRepo().getSecret(k)),
      )
      if (accountId && accessKeyId && secretAccessKey && bucket) {
        return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl: publicUrl || '', source: 'db' }
      }
    }
  } catch {
    /* ডেটাবেজ পাওয়া যায়নি — লোকাল স্টোরেজেই থাকবে */
  }
  return EMPTY
}

/** env-ভিত্তিক সিঙ্ক যাচাই — শুধু UI তে "env থেকে সেট" দেখানোর জন্য */
export function storageKind(): 'r2' | 'local' {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env
  return R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME ? 'r2' : 'local'
}

/** পূর্ণ যাচাই — env + ডেটাবেজ দুটোই দেখে (সার্ভার কম্পোনেন্ট/রাউটে ব্যবহার) */
export async function storageKindAsync(): Promise<'r2' | 'local'> {
  return (await loadR2Config()).source === 'none' ? 'local' : 'r2'
}

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024 // 25MB — লগইন করা ব্যবহারকারী
/** বেনামি (অ্যাকাউন্ট ছাড়া) আপলোডের সীমা — খরচ ও অপব্যবহার কমাতে */
export const MAX_UPLOAD_BYTES_ANON = 8 * 1024 * 1024 // 8MB

/**
 * অনুমোদিত ফাইল-ধরন → এক্সটেনশন।
 *
 * **SVG ইচ্ছাকৃতভাবে বাদ** — আপলোড করা SVG-তে `<script>` থাকতে পারে এবং সেটি
 * একই অরিজিন থেকে সার্ভ হলে stored XSS হয়। ছবি হিসেবে শুধু রাস্টার ফরম্যাট।
 */
const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
}

/** সেভ করা যাবে এমন এক্সটেনশন — শুধু উপরের তালিকা থেকে */
const ALLOWED_EXT = new Set(Object.values(EXT_MAP))

/** কনটেন্ট-টাইপ অনুমোদিত কি না (svt/text/html ইত্যাদি নয়) */
export function isAllowedContentType(contentType: string): boolean {
  return Object.prototype.hasOwnProperty.call(EXT_MAP, (contentType || '').toLowerCase().split(';')[0].trim())
}

/**
 * ফাইলের এক্সটেনশন ঠিক করে।
 *
 * নিরাপত্তা: আগে ফাইলনেমের এক্সটেনশনকে (`.html`, `.svg`, `.php` …) অন্ধভাবে
 * বিশ্বাস করা হতো — `evil.html`-কে `image/png` বলে পাঠালে সেটি `….html` নামে
 * সেভ হয়ে যেত। এখন এক্সটেনশন **শুধু MIME থেকে** আসে (ফাইলনেম কেবল তখনই,
 * যখন MIME অজানা কিন্তু ফাইলনেমের এক্সটেনশন অনুমোদিত তালিকায় আছে)।
 */
export function extensionFor(contentType: string, filename = ''): string {
  const mime = (contentType || '').toLowerCase().split(';')[0].trim()
  const fromMime = EXT_MAP[mime]
  if (fromMime) return fromMime
  // MIME অজানা/সাধারণ — তখনই ফাইলনেম দেখি, তাও কেবল অনুমোদিত এক্সটেনশন হলে
  const fromName = filename.split('.').pop()?.toLowerCase() || ''
  if (ALLOWED_EXT.has(fromName)) return fromName
  return 'bin'
}

export async function storeFile(
  buffer: Buffer,
  contentType: string,
  filename = '',
  folder = 'uploads',
): Promise<StoredFile> {
  const ext = extensionFor(contentType, filename)
  const key = `${folder}/${new Date().toISOString().slice(0, 10)}/${crypto.randomBytes(8).toString('hex')}.${ext}`

  const cfg = await loadR2Config()
  if (cfg.source !== 'none') {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey,
      },
    })
    await client.send(
      new PutObjectCommand({
        Bucket: cfg.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    )
    const base = cfg.publicUrl.replace(/\/$/, '')
    // public ডোমেইন না থাকলে ফাইলটি `/api/media/...` দিয়ে সার্ভ হবে (একই রুট রিড করে)
    const url = base ? `${base}/${key}` : `/api/media/${key}`
    return { url, key }
  }

  // Local fallback (dev/preview): public/uploads
  const relDir = path.join('public', path.dirname(key))
  await fs.mkdir(relDir, { recursive: true })
  await fs.writeFile(path.join('public', key), buffer)
  // `next start`-এ build-এর পরে লেখা ফাইল `public/` থেকে সার্ভ হয় না,
  // তাই লোকাল ফলব্যাকে সবসময় `/api/media/...` রুট ব্যবহার করা হয়।
  return { url: `/api/media/${key}`, key }
}

/** লোকাল স্টোরেজে রাখা ফাইলের নিরাপদ পথ (path traversal বন্ধ) */
export function localUploadPath(key: string): string | null {
  const clean = key.replace(/\\/g, '/').replace(/^\.\//, '')
  if (!clean.startsWith('uploads/') || clean.includes('..')) return null
  const abs = path.resolve(process.cwd(), 'public', clean)
  const root = path.resolve(process.cwd(), 'public', 'uploads')
  if (!abs.startsWith(root + path.sep)) return null
  return abs
}

/** key থেকে নিরাপদ MIME — এক্সটেনশনই কর্তা (ক্লায়েন্টের দাবি নয়) */
export function contentTypeForKey(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase() || ''
  const found = Object.entries(EXT_MAP).find(([, e]) => e === ext)
  return found ? found[0] : 'application/octet-stream'
}
