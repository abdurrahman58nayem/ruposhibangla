import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getReadyRepo } from '@/lib/repo'
import { loadR2Config, R2_SECRET_KEYS } from '@/lib/storage'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function mask(v: string) {
  if (!v) return ''
  if (v.length <= 8) return '••••••••'
  return `${v.slice(0, 4)}••••••••${v.slice(-4)}`
}

async function requireAdmin() {
  const session = await getSession()
  if (!session || !['admin', 'super_admin'].includes(session.role)) return null
  return session
}

/** বর্তমান R2 অবস্থা — ক্রেডেনশিয়াল মাস্ক করা হয়, কখনো পুরোটা পাঠানো হয় না */
export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const cfg = await loadR2Config()
  const hasEnv = !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  )

  return NextResponse.json({
    ok: true,
    configured: cfg.source !== 'none',
    source: cfg.source, // 'env' | 'db' | 'none'
    envOverride: hasEnv, // env থাকলে ডেটাবেজের মান উপেক্ষিত হয়
    masked: {
      accountId: mask(cfg.accountId),
      accessKeyId: mask(cfg.accessKeyId),
      secretAccessKey: mask(cfg.secretAccessKey),
      bucket: cfg.bucket, // বাকেটের নাম গোপন নয়
      publicUrl: cfg.publicUrl,
    },
  })
}

/** R2 ক্রেডেনশিয়াল সংরক্ষণ (ডেটাবেজে, সার্ভার-সাইড) */
export async function PUT(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await req.json().catch(() => null)) as Record<string, string> | null
  if (!body) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  const map: Record<string, string> = {
    R2_ACCOUNT_ID: String(body.accountId || '').trim(),
    R2_ACCESS_KEY_ID: String(body.accessKeyId || '').trim(),
    R2_SECRET_ACCESS_KEY: String(body.secretAccessKey || '').trim(),
    R2_BUCKET_NAME: String(body.bucket || '').trim(),
    R2_PUBLIC_URL: String(body.publicUrl || '').trim().replace(/\/$/, ''),
  }

  // ফাঁকা মান মানে "বদলাবেন না" — যাতে শুধু publicUrl বদলাতে গিয়ে কী মুছে না যায়
  for (const [k, v] of Object.entries(map)) {
    if (v) await (await getReadyRepo()).setSecret(k, v)
  }

  // অডিট লগ
  await (await getReadyRepo()).addAudit?.({
    id: `aud-${Date.now()}`,
    actorId: session.id,
    actorName: session.name,
    action: 'storage.update',
    target: 'R2',
    detail: `সংরক্ষিত ক্ষেত্র: ${Object.entries(map).filter(([, v]) => v).map(([k]) => k).join(', ') || 'কিছুই না'}`,
    createdAt: new Date().toISOString(),
  })

  const cfg = await loadR2Config()
  return NextResponse.json({
    ok: true,
    configured: cfg.source !== 'none',
    source: cfg.source,
    message: cfg.source === 'env' ? 'সংরক্ষিত হয়েছে — তবে env-এর মানই কার্যকর থাকবে।' : 'R2 সংরক্ষিত হয়েছে।',
  })
}

/** সব R2 ক্রেডেনশিয়াল মুছে ফেলা */
export async function DELETE() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  for (const k of R2_SECRET_KEYS) await (await getReadyRepo()).setSecret(k, '')
  await (await getReadyRepo()).addAudit?.({
    id: `aud-${Date.now()}`,
    actorId: session.id,
    actorName: session.name,
    action: 'storage.delete',
    target: 'R2',
    detail: 'R2 ক্রেডেনশিয়াল মুছে ফেলা হয়েছে',
    createdAt: new Date().toISOString(),
  })
  return NextResponse.json({ ok: true, message: 'R2 সংযোগ মুছে ফেলা হয়েছে — এখন লোকাল স্টোরেজ ব্যবহৃত হবে।' })
}

/** সংযোগ পরীক্ষা — বাকেটে HeadBucket পাঠিয়ে */
export async function POST() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const cfg = await loadR2Config()
  if (cfg.source === 'none') {
    return NextResponse.json({ ok: false, error: 'R2 কনফিগার করা নেই।' }, { status: 400 })
  }

  try {
    const { S3Client, HeadBucketCommand } = await import('@aws-sdk/client-s3')
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
    })
    await client.send(new HeadBucketCommand({ Bucket: cfg.bucket }))
    return NextResponse.json({
      ok: true,
      message: `সংযোগ সফল — বাকেট "${cfg.bucket}" পাওয়া গেছে (উৎস: ${cfg.source === 'env' ? 'env' : 'অ্যাডমিন প্যানেল'})।`,
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || 'সংযোগ ব্যর্থ — Account ID, কী ও বাকেটের নাম ঠিক আছে কিনা দেখুন।' },
      { status: 400 },
    )
  }
}
