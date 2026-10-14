import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

export type StoredFile = { url: string; key: string }

export function storageKind(): 'r2' | 'local' {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env
  return R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME ? 'r2' : 'local'
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

  if (storageKind() === 'r2') {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
      },
    })
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME as string,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    )
    const base = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')
    const url = base ? `${base}/${key}` : `/api/media/${key}`
    return { url, key }
  }

  // Local fallback (dev/preview): public/uploads
  const relDir = path.join('public', path.dirname(key))
  await fs.mkdir(relDir, { recursive: true })
  await fs.writeFile(path.join('public', key), buffer)
  return { url: `/${key.replace(/^uploads\//, 'uploads/')}`, key }
}
