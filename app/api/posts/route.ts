import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession, getGuestKey } from '@/lib/auth'
import { uid } from '@/lib/utils'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const CreateSchema = z.object({
  kind: z.enum(['photo', 'video', 'note']),
  category: z.enum(['prani', 'udbhid', 'grambangla', 'manush', 'other']),
  title: z.string().max(140).optional().default(''),
  body: z.string().max(4000).optional().default(''),
  mediaUrl: z.string().max(600).optional().default(''),
  mediaType: z.enum(['image', 'video']).optional(),
  thumbUrl: z.string().max(600).optional().default(''),
  location: z.string().max(120).optional().default(''),
  speciesSlug: z.string().max(120).optional().default(''),
  tags: z.array(z.string().max(40)).max(12).optional().default([]),
  authorName: z.string().min(2).max(60),
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = await getRepo().listPosts({
    status: (url.searchParams.get('status') as any) || 'approved',
    category: (url.searchParams.get('category') as any) || undefined,
    kind: (url.searchParams.get('kind') as any) || undefined,
    speciesSlug: url.searchParams.get('species') || undefined,
    authorId: url.searchParams.get('author') || undefined,
    q: url.searchParams.get('q') || undefined,
    cursor: url.searchParams.get('cursor') || null,
    limit: Math.min(Number(url.searchParams.get('limit') || 12), 48),
  })
  return NextResponse.json(page)
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'তথ্য সঠিকভাবে পূরণ হয়নি', details: parsed.error.flatten() }, { status: 400 })
  }
  const data = parsed.data
  if (data.kind !== 'note' && !data.mediaUrl) {
    return NextResponse.json({ error: 'ছবি বা ভিডিও দিন' }, { status: 400 })
  }

  const session = await getSession()
  const guest = await getGuestKey()
  const repo = getRepo()
  let authorId: string | null = session?.id ?? null
  let authorName = data.authorName.trim()

  if (session) {
    const u = await repo.getUserById(session.id)
    if (u) authorName = u.name
  }

  const post = {
    id: uid('post'),
    kind: data.kind,
    category: data.category,
    title: data.title,
    body: data.body,
    mediaUrl: data.mediaUrl,
    mediaType: data.mediaType,
    thumbUrl: data.thumbUrl,
    location: data.location,
    speciesSlug: data.speciesSlug,
    tags: data.tags,
    authorName,
    authorId,
    authorKey: guest,
    status: 'approved' as const,
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
  }

  await repo.createPost(post)
  return NextResponse.json({ ok: true, post })
}
