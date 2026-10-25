import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { uid } from '@/lib/utils'
import { guard as rateGuard, tooManyRequests, RULES } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json(await getRepo().listComments(id))
}

/**
 * মন্তব্য — সাধারণ মতামত এবং (ঐচ্ছিক) প্রজাতি শনাক্তকরণের প্রস্তাব।
 * গুরুত্ব: সম্প্রদায়ের প্রস্তাব কখনোই স্বয়ংক্রিয়ভাবে “যাচাইকৃত” হয় না (§16)।
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({} as any))
  const _rl = await rateGuard(req, RULES.write, 'comments')
  if (!_rl.ok) return tooManyRequests(_rl)

  const text = String(body.body || '').trim()
  const name = String(body.name || '').trim()
  if (!text || text.length > 1000) return NextResponse.json({ error: 'মন্তব্য লিখুন' }, { status: 400 })
  if (name.length > 60) return NextResponse.json({ error: 'নাম খুব বড়' }, { status: 400 })

  const session = await getSession()
  const repo = getRepo()
  let finalName = name || 'অতিথি'
  if (session) {
    const u = await repo.getUserById(session.id)
    if (u) finalName = u.name
  }

  // শনাক্তকরণের প্রস্তাব (ঐচ্ছিক)
  let suggestedSpecies = String(body.suggestedSpecies || '').trim()
  let suggestedName = String(body.suggestedName || '').trim()
  let idSource: 'ai' | 'community' | undefined = undefined

  if (suggestedSpecies || suggestedName) {
    // প্রস্তাবিত নামটি সত্যিই আমাদের জ্ঞানভান্ডারে আছে কি না যাচাই
    if (suggestedSpecies) {
      const sp = await repo.getSpecies(suggestedSpecies)
      if (!sp) suggestedSpecies = ''
      else suggestedName = suggestedName || sp.nameBn
    } else if (suggestedName) {
      const found = await repo.listSpecies({ q: suggestedName, limit: 1 })
      if (found[0]) {
        suggestedSpecies = found[0].slug
        suggestedName = found[0].nameBn
      }
    }
    idSource = body.idSource === 'ai' ? 'ai' : 'community'
  }

  const comment = {
    id: uid('cm'),
    postId: id,
    name: finalName,
    userId: session?.id ?? null,
    body: text,
    suggestedSpecies: suggestedSpecies || '',
    suggestedName: suggestedName || '',
    idSource: suggestedSpecies ? idSource : undefined,
    idVerified: false,
    verifiedBy: null,
    verifiedAt: null,
    createdAt: new Date().toISOString(),
  }
  await repo.addComment(comment)

  // পোস্টের লেখককে বিজ্ঞপ্তি (অ্যাকাউন্ট থাকলে)
  try {
    const post = await repo.getPost(id)
    if (post?.authorId && post.authorId !== session?.id) {
      await repo.addNotification?.({
        id: uid('ntf'),
        userKey: `u:${post.authorId}`,
        type: 'comment',
        title: 'নতুন মন্তব্য',
        body: `${finalName}: ${text.slice(0, 80)}`,
        url: `/post/${id}#comments`,
        read: false,
        createdAt: new Date().toISOString(),
      })
    }
  } catch {}

  return NextResponse.json({ ok: true, comment })
}
