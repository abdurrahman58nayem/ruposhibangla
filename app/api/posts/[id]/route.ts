import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getRepo().getPost(id)
  if (!post) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const patch = await req.json().catch(() => ({}))
  const updated = await getRepo().updatePost(id, patch)
  return NextResponse.json({ ok: true, post: updated })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const repo = getRepo()
  const post = await repo.getPost(id)
  if (!post) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (session.role !== 'admin' && post.authorId !== session.id) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  await repo.deletePost(id)
  return NextResponse.json({ ok: true })
}
