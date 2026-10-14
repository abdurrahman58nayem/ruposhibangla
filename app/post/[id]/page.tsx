import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PostCard from '@/components/PostCard'
import CommentSection from '@/components/CommentSection'
import FollowButton from '@/components/FollowButton'
import { getRepo } from '@/lib/repo'
import { getSession, getGuestKey } from '@/lib/auth'
import { excerpt, toBn } from '@/lib/utils'
import { BadgeCheck, MapPin, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const p = await getRepo().getPost(id)
  if (!p) return { title: 'পোস্ট পাওয়া যায়নি' }
  return {
    title: p.title || excerpt(p.body || 'পোস্ট', 60),
    description: excerpt(p.body || p.title || '', 160),
    openGraph: { images: p.mediaUrl && p.mediaType === 'image' ? [p.mediaUrl] : undefined },
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const repo = getRepo()
  const post = await repo.getPost(id)
  if (!post || post.status !== 'approved') notFound()

  const session = await getSession()
  const likeKey = session?.id || (await getGuestKey())
  const [comments, liked, related, author] = await Promise.all([
    repo.listComments(id),
    repo.hasLiked(id, likeKey),
    repo.listPosts({ status: 'approved', category: post.category, limit: 4 }),
    post.authorId ? repo.getUserById(post.authorId) : null,
  ])

  const following = session && author ? await repo.isFollowing(session.id, author.id) : false

  return (
    <div className="container-pb py-5">
      <Link href="/feed" className="mb-3 inline-flex items-center gap-1 text-sm text-forest-700 hover:underline">
        <ArrowLeft size={14} /> ফিডে ফিরুন
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PostCard post={post} likedInitially={!!liked} />

          {author && (
            <div className="card mt-3 flex items-center gap-3 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-forest-100 font-bold text-forest-800">
                {author.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={author.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  author.name.slice(0, 1)
                )}
              </span>
              <div className="min-w-0 flex-1">
                <Link href={`/u/${author.username}`} className="flex items-center gap-1 font-semibold text-forest-900 hover:underline">
                  {author.name}
                  {author.verified && <BadgeCheck size={15} className="text-sky-500" />}
                </Link>
                <p className="truncate text-[11px] text-black/50">
                  @{author.username} · {toBn(author.followers)} অনুসারী
                </p>
              </div>
              {session?.id !== author.id && (
                <FollowButton userId={author.id} initial={following} loggedIn={!!session} className="px-3 py-1.5 text-xs" />
              )}
            </div>
          )}

          <div className="card mt-3 p-4">
            <CommentSection
              postId={post.id}
              initial={comments}
              userName={session?.name}
              isAdmin={session?.role === 'admin'}
            />
          </div>
        </div>

        <aside>
          <h2 className="mb-3 text-base font-bold text-forest-900">একই ধরনের আরও</h2>
          <div className="space-y-3">
            {related.items.filter((p) => p.id !== post.id).map((p) => (
              <PostCard key={p.id} post={p} dense />
            ))}
          </div>
          {post.speciesSlug && (
            <Link
              href={`/prani/${post.speciesSlug}`}
              className="card mt-3 block p-4 text-sm font-medium text-forest-800 hover:bg-forest-50"
            >
              এই প্রজাতি সম্পর্কে বিস্তারিত জানুন →
            </Link>
          )}
          {post.location && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-black/45">
              <MapPin size={12} /> {post.location}
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}
