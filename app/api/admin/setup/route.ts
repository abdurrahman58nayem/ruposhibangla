import { NextResponse } from 'next/server'
import { getSql, SCHEMA_SQL, hasDb } from '@/lib/db/client'
import { getRepo } from '@/lib/repo'
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
  const users = await getRepo().listUsers().catch(() => [])
  const needsBootstrap = users.length === 0
  if (!needsBootstrap && (!session || session.role !== 'admin')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const sql = getSql()
    for (const stmt of SCHEMA_SQL.split(';')) {
      const s = stmt.trim()
      if (s) await sql(s)
    }
    if (mode === 'schema') return NextResponse.json({ ok: true, message: 'টেবিল তৈরি হয়েছে' })
    await getRepo().reseed()
    return NextResponse.json({ ok: true, message: 'ডেটাবেজ প্রস্তুত — প্রজাতি, চ্যানেল, পোস্ট ও খবর বসানো হয়েছে' })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message || 'সেটআপ ব্যর্থ' }, { status: 500 })
  }
}
