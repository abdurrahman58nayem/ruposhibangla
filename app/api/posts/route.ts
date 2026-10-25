import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession, getGuestKey } from '@/lib/auth'
import { uid } from '@/lib/utils'
import { z } from 'zod'
import { CATEGORIES } from '@/lib/categories'
import { guard as rateGuard, tooManyRequests, RULES } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const GROUP_IDS = CATEGORIES.map((c) => c.id) as [string, ...string[]]

const CreateSchema = z.object({
  kind: z.enum(['photo', 'video', 'note', 'reel']),
  /** ১৭টি প্রধান ক্যাটাগরির একটি (§2) */
  group: z.enum(GROUP_IDS),
  /** পুরোনো/সাধারণ বিভাগ — না দিলে group থেকে বসানো হয় */
  category: z.string().max(40).optional().default(''),
  title: z.string().max(140).optional().default(''),
  body: z.string().max(4000).optional().default(''),
  mediaUrl: z.string().max(600).optional().default(''),
  mediaType: z.enum(['image', 'video']).optional(),
  thumbUrl: z.string().max(600).optional().default(''),
  location: z.string().max(120).optional().default(''),
  speciesSlug: z.string().max(120).optional().default(''),
  tags: z.array(z.string().max(40)).max(12).optional().default([]),
  authorName: z.string().min(2).max(60),
  /** লেখক জানতে চেয়েছেন — “এটি কোন প্রজাতি?” (§16) */
  needsIdentification: z.boolean().optional().default(false),
})

/** group → legacy category (পুরোনো ফিল্টার যাতে কাজ করে) */
function legacyCategory(group: string): string {
  if (['pakhi', 'machh', 'stonyopayi', 'sorisorip', 'ubhochor', 'kitpotongo', 'ameruddondi'].includes(group)) return 'prani'
  if (['ful', 'gachbon', 'chhatrashaibal', 'onujib'].includes(group)) return 'udbhid'
  if (['nodi', 'pahar', 'grambangla'].includes(group)) return 'grambangla'
  if (group === 'songrokkhon') return 'songrokkhon'
  if (group === 'sahitto') return 'other'
  return 'other'
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = await getRepo().listPosts({
    status: (url.searchParams.get('status') as any) || 'approved',
    category: (url.searchParams.get('category') as any) || undefined,
    kind: (url.searchParams.get('kind') as any) || undefined,
    group: (url.searchParams.get('group') as any) || undefined,
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
  const _rl = await rateGuard(req, RULES.write, 'posts')
  if (!_rl.ok) return tooManyRequests(_rl)

  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'তথ্য সঠিকভাবে পূরণ হয়নি', details: parsed.error.flatten() }, { status: 400 })
  }
  const data = parsed.data
  if (data.kind !== 'note' && !data.mediaUrl) {
    return NextResponse.json({ error: 'ছবি বা ভিডিও দিন' }, { status: 400 })
  }
  if (data.kind === 'reel' && data.mediaType !== 'video') {
    return NextResponse.json({ error: 'রিলস হিসেবে শুধু ভিডিও প্রকাশ করা যায়' }, { status: 400 })
  }

  const session = await getSession()
  const guest = await getGuestKey()
  const repo = getRepo()
  let authorId: string | null = session?.id ?? null
  let authorName = data.authorName.trim()
  let verified = false

  if (session) {
    const u = await repo.getUserById(session.id)
    if (u) {
      authorName = u.name
      verified = !!u.verified
    }
  }

  /**
   * নীতি: অ্যাকাউন্টবিহীন (অতিথি) পোস্ট পর্যালোচনার পর প্রকাশিত হয়;
   * অ্যাকাউন্টধারী ও যাচাইকৃত অংশীদারের পোস্ট সাথে সাথে প্রকাশিত হয়
   * (রিপোর্ট এলে অ্যাডমিন যেকোনো পোস্ট সরাতে পারবেন)।
   */
  const autoApprove = !!session && (verified || ['admin', 'super_admin', 'editor'].includes(session.role))

  const post = {
    id: uid('post'),
    kind: data.kind,
    group: data.group as any,
    category: (data.category || legacyCategory(data.group)) as any,
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
    status: (autoApprove ? 'approved' : 'pending') as 'approved' | 'pending',
    likes: 0,
    comments: 0,
    needsIdentification: !!data.needsIdentification,
    identifiedSpecies: '',
    createdAt: new Date().toISOString(),
  }

  await repo.createPost(post)
  return NextResponse.json({ ok: true, post, pending: post.status === 'pending' })
}
