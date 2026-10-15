import { NextResponse } from 'next/server'
import { getSql, schemaStatements, getSchemaSql, hasDb } from '@/lib/db/client'
import { getReadyRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { syncSummary } from '@/lib/repo/seed-sync'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/**
 * ডেটাবেজ সেটআপ / সিঙ্ক।
 *
 *   mode=schema → কেবল টেবিল তৈরি (Neon)
 *   mode=info   → শুধু হিসাব: কোডে কত / ডেটাবেজে কত / বাকি কত (কোনো পরিবর্তন নয়)
 *   mode=sync   → সিড থেকে কেবল অনুপস্থিত প্রজাতি যোগ (নিরাপদ — কিছু মুছে না)
 *   mode=seed   → সব মুছে নতুন করে সিড বসানো (ধ্বংসাত্মক — ইউজারের পোস্ট/অ্যাকাউন্ট যাবে)
 *
 * `info` ও `sync` Neon ও লোকাল JSON — দুটোতেই চলে।
 */
export async function POST(req: Request) {
  const mode = new URL(req.url).searchParams.get('mode') || 'seed'

  const session = await getSession()
  const repo = await getReadyRepo()
  const users = await repo.listUsers().catch(() => [])
  const needsBootstrap = users.length === 0
  if (!needsBootstrap && (!session || session.role !== 'admin')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // হিসাব ও সিঙ্ক — ডেটাবেজ না থাকলেও (লোকাল JSON) চলে
  if (mode === 'info' || mode === 'sync') {
    try {
      const dryRun = mode === 'info'
      const result = await repo.syncSpecies({ dryRun, overwrite: false })
      const message = syncSummary(result)

      if (!dryRun && result.added.length) {
        await repo
          .addAudit?.({
            id: `audit-${Date.now().toString(36)}`,
            actorId: session?.id || 'system',
            actorName: session?.name || session?.username || 'সিস্টেম',
            action: 'species.sync',
            target: 'species',
            detail: `${result.added.length}টি নতুন প্রজাতি যোগ (মোট ${result.after}টি)`,
            createdAt: new Date().toISOString(),
          })
          .catch(() => {})
      }

      return NextResponse.json({
        ok: result.ok,
        message,
        seedCount: result.seedCount,
        before: result.before,
        after: result.after,
        added: result.added.length,
        missing: result.missing,
        dryRun,
        addedSlugs: result.added.slice(0, 100),
      })
    } catch (e: any) {
      console.error(e)
      return NextResponse.json({ error: e?.message || 'সিঙ্ক ব্যর্থ' }, { status: 500 })
    }
  }

  if (!hasDb()) {
    return NextResponse.json(
      { error: 'DATABASE_URL সেট করা নেই — টেবিল তৈরি/রি-সিড কেবল Neon-এ চলে। সিঙ্ক করতে mode=sync ব্যবহার করুন।' },
      { status: 400 },
    )
  }

  try {
    if (!getSchemaSql()) {
      return NextResponse.json({ error: 'db/schema.sql পাওয়া যায়নি — সার্ভারে ফাইলটি আছে কিনা দেখুন' }, { status: 500 })
    }
    const sql = getSql()
    for (const stmt of schemaStatements()) {
      await sql(stmt)
    }
    if (mode === 'schema') return NextResponse.json({ ok: true, message: 'টেবিল তৈরি হয়েছে' })

    await repo.reseed()
    return NextResponse.json({ ok: true, message: 'ডেটাবেজ প্রস্তুত — প্রজাতি, চ্যানেল, পোস্ট ও খবর বসানো হয়েছে' })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message || 'সেটআপ ব্যর্থ' }, { status: 500 })
  }
}
