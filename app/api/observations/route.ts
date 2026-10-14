import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getGuestKey, getSession } from '@/lib/auth'
import { uid } from '@/lib/utils'
import type { Observation } from '@/lib/types'
import { guard as rateGuard, tooManyRequests, RULES } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const rows = (await getRepo().listObservations?.({
    status: url.searchParams.get('status') || undefined,
    speciesSlug: url.searchParams.get('speciesSlug') || undefined,
    limit: Math.min(Number(url.searchParams.get('limit') || 60), 200),
  })) || []
  return NextResponse.json({ items: rows })
}

/**
 * পর্যবেক্ষণ জমা — “আমি কী দেখলাম?”
 * অবস্থান শেয়ার না করলে location ফাঁকি দেওয়া হয়; বিপন্ন প্রজাতির ক্ষেত্রে
 * কেবল স্থূল এলাকা সংরক্ষিত হয়।
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<Observation> | null
  const _rl = rateGuard(req, RULES.write, 'observations')
  if (!_rl.ok) return tooManyRequests(_rl)

  if (!body?.name) return NextResponse.json({ error: 'আপনার নাম দিন' }, { status: 400 })
  if (!body.photoUrl && !body.notes && !body.speciesSlug) {
    return NextResponse.json({ error: 'ছবি অথবা বিবরণ দিন' }, { status: 400 })
  }
  const session = await getSession()
  const repo = getRepo()

  let sensitive = false
  if (body.speciesSlug) {
    const sp = await repo.getSpecies(body.speciesSlug)
    sensitive = !!sp?.sensitive
  }

  const obs: Observation = {
    id: uid('obs'),
    speciesSlug: body.speciesSlug || '',
    guessedName: body.guessedName || '',
    name: body.name,
    userId: session?.id || null,
    authorKey: session ? `u:${session.id}` : `g:${await getGuestKey()}`,
    photoUrl: body.photoUrl || '',
    location: body.locationShared && !sensitive ? body.location || '' : '',
    coarseLocation: body.coarseLocation || '',
    locationShared: !!body.locationShared,
    notes: body.notes || '',
    observedAt: body.observedAt || new Date().toISOString(),
    uncertain: body.uncertain ?? !body.speciesSlug,
    status: 'submitted',
    createdAt: new Date().toISOString(),
  }
  await repo.createObservation?.(obs)
  return NextResponse.json({ ok: true, observation: obs, sensitive })
}
