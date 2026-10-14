import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { uid } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json(await getRepo().listComments(id))
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const text = String(body.body || '').trim()
  const name = String(body.name || '').trim()
  if (!text || text.length > 1000) return NextResponse.json({ error: 'মন্তব্য লিখুন' }, { status: 400 })
  if (name.length > 60) return NextResponse.json({ error: 'নাম খুব বড়' }, { status: 400 })

  const session = await getSession()
  let finalName = name || 'অতিথি'
  if (session) {
    const u = await getRepo().getUserById(session.id)
    if (u) finalName = u.name
  }

  const comment = {
    id: uid('cm'),
    postId: id,
    name: finalName,
    userId: session?.id ?? null,
    body: text,
    createdAt: new Date().toISOString(),
  }
  await getRepo().addComment(comment)
  return NextResponse.json({ ok: true, comment })
}
