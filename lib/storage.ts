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

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024 // 25MB

const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
}

export function extensionFor(contentType: string, filename = ''): string {
  const fromName = filename.split('.').pop()?.toLowerCase()
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName) && fromName !== 'blob') return fromName
  return EXT_MAP[contentType] || 'bin'
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
    const url = base ? `${base}/${key}` : `/api/media/${key}`
    return { url, key }
  }

  // Local fallback (dev/preview): public/uploads
  const relDir = path.join('public', path.dirname(key))
  await fs.mkdir(relDir, { recursive: true })
  await fs.writeFile(path.join('public', key), buffer)
  return { url: `/${key.replace(/^uploads\//, 'uploads/')}`, key }
}
