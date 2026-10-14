import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { uid } from '@/lib/utils'

export const dynamic = 'force-dynamic'

/**
 * শনাক্তকরণ যাচাই — কেবল সম্পাদক/অ্যাডমিন (বিশেষজ্ঞ পর্যালোচনা)।
 * সম্প্রদায়ের কোনো প্রস্তাব স্বয়ংক্রিয়ভাবে যাচাইকৃত হয় না (§16)।
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || !['admin', 'super_admin', 'editor'].includes(session.role)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = (await req.json().catch(() => ({}))) as {
    verify?: boolean
    suggestedSpecies?: string
    suggestedName?: string
    body?: string
  }
  const repo = getRepo()

  const patch: any = {}
  if (typeof body.body === 'string') patch.body = body.body.slice(0, 1000)
  if (body.suggestedSpecies) {
    const sp = await repo.getSpecies(body.suggestedSpecies)
    if (!sp) return NextResponse.json({ error: 'প্রজাতি পাওয়া যায়নি' }, { status: 404 })
    patch.suggestedSpecies = sp.slug
    patch.suggestedName = body.suggestedName || sp.nameBn
  }

  if (body.verify) {
    patch.idSource = 'expert'
    patch.idVerified = true
    patch.verifiedBy = session.name
    patch.verifiedAt = new Date().toISOString()
  }

  const updated = await repo.updateComment?.(id, patch)
  if (!updated) return NextResponse.json({ error: 'পাওয়া যায়নি' }, { status: 404 })

  // যাচাইকৃত হলে পোস্টে নির্ধারিত প্রজাতি বসানো + লেখককে বিজ্ঞপ্তি
  if (patch.idVerified && updated.suggestedSpecies) {
    const post = await repo.getPost(updated.postId)
    if (post) {
      await repo.updatePost(post.id, {
        identifiedSpecies: updated.suggestedSpecies,
        needsIdentification: false,
      } as any)
      if (post.authorId) {
        await repo.addNotification?.({
          id: uid('ntf'),
          userKey: `u:${post.authorId}`,
          type: 'system',
          title: 'পরিচয় যাচাই হয়েছে',
          body: `বিশেষজ্ঞ পর্যালোচনায় নিশ্চিত: ${updated.suggestedName || updated.suggestedSpecies}`,
          url: `/post/${post.id}#comments`,
          read: false,
          createdAt: new Date().toISOString(),
        })
      }
    }
  }

  return NextResponse.json({ ok: true, comment: updated })
}

/** মুছে ফেলা — অ্যাডমিন/এডিটর */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || !['admin', 'super_admin', 'editor'].includes(session.role)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await getRepo().deleteComment(id)
  return NextResponse.json({ ok: true })
}
