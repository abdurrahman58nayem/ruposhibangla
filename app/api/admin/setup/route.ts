import { NextResponse } from 'next/server'
import { getSql, schemaStatements, getSchemaSql, hasDb } from '@/lib/db/client'
import { getReadyRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/** Neon ডেটাবেজে টেবিল তৈরি + বাংলাদেশের প্রজাতির তথ্য বসানো */
export async function POST(req: Request) {
  const mode = new URL(req.url).searchParams.get('mode') || 'seed'
  if (!hasDb()) {
    return NextResponse.json({ error: 'DATABASE_URL সেট করা নেই — এখন লোকাল JSON স্টোর ব্যবহৃত হচ্ছে' }, { status: 400 })
  }
  const session = await getSession()
  const users = await (await getReadyRepo()).listUsers().catch(() => [])
  const needsBootstrap = users.length === 0
  if (!needsBootstrap && (!session || session.role !== 'admin')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
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
    await (await getReadyRepo()).reseed()
    return NextResponse.json({ ok: true, message: 'ডেটাবেজ প্রস্তুত — প্রজাতি, চ্যানেল, পোস্ট ও খবর বসানো হয়েছে' })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message || 'সেটআপ ব্যর্থ' }, { status: 500 })
  }
}
