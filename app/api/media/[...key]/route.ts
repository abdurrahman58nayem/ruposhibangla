import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import { contentTypeForKey, localUploadPath } from '@/lib/storage'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * আপলোড করা ফাইল সার্ভ করা — `/api/media/uploads/...`।
 *
 * কেন দরকার:
 *  - Vercel-এ `public/` বিল্ডের পরে লেখা যায় না, তাই আপলোড সবসময় রিমোট স্টোরেজে
 *    যাওয়া উচিত; কিন্তু লোকাল/সেলফ-হোস্টে `next start` চালালে `public/uploads`-এ
 *    নতুন লেখা ফাইল **সার্ভ হয় না** (বিল্ডের সময়ের তালিকাই স্থির)। আগে আপলোডের
 *    URL সরাসরি `/uploads/…` হতো → আপলোড সফল হলেও ছবি ভাঙা দেখাত।
 *  - R2-তে কাস্টম পাবলিক ডোমেইন না থাকলে কোড `/api/media/…` URL বানায় — সেই
 *    রুটটাই আগে ছিল না।
 *
 * নিরাপত্তা: পথ যাচাই (`..` নিষিদ্ধ), `Content-Type` এক্সটেনশন থেকেই নির্ধারিত
 * (ক্লায়েন্টের দাবি নয়), `nosniff` + `Content-Disposition: inline`।
 */
export async function GET(_req: Request, ctx: { params: Promise<{ key: string[] }> }) {
  const { key } = await ctx.params
  const parts = Array.isArray(key) ? key : []
  if (!parts.length) return NextResponse.json({ error: 'ফাইল পাওয়া যায়নি' }, { status: 404 })

  const fileKey = parts.join('/')
  const abs = localUploadPath(fileKey)

  // ১) লোকাল স্টোরেজ (ডেভ/সেলফ-হোস্ট)
  if (abs) {
    try {
      const data = await fs.readFile(abs)
      return new Response(new Uint8Array(data), {
        headers: {
          'content-type': contentTypeForKey(abs),
          'content-length': String(data.byteLength),
          'cache-control': 'public, max-age=31536000, immutable',
          'x-content-type-options': 'nosniff',
          'content-disposition': 'inline',
        },
      })
    } catch {
      /* লোকালে নেই — নিচে R2 দেখি */
    }
  }

  // ২) R2 (পাবলিক ডোমেইন না থাকলে) — সার্ভার-সাইডে এনে পাস করা হয়
  try {
    const { loadR2Config } = await import('@/lib/storage')
    const cfg = await loadR2Config()
    if (cfg.source !== 'none' && !cfg.publicUrl) {
      const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3')
      const client = new S3Client({
        region: 'auto',
        endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
      })
      const obj = await client.send(new GetObjectCommand({ Bucket: cfg.bucket, Key: fileKey }))
      const bytes = obj.Body ? await obj.Body.transformToByteArray() : new Uint8Array()
      return new Response(new Uint8Array(bytes), {
        headers: {
          'content-type': obj.ContentType || contentTypeForKey(fileKey),
          'cache-control': 'public, max-age=31536000, immutable',
          'x-content-type-options': 'nosniff',
          'content-disposition': 'inline',
        },
      })
    }
  } catch {
    /* R2-ও নেই */
  }

  return NextResponse.json({ error: 'ফাইল পাওয়া যায়নি' }, { status: 404 })
}
