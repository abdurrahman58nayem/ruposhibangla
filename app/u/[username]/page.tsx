import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Feed from '@/components/Feed'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { toBn } from '@/lib/utils'
import { BadgeCheck, CalendarDays, Camera, MapPin } from 'lucide-react'
import ProfileControls, { ProfileAvatarButton } from '@/components/ProfileControls'
import { buildFeedPage } from '@/lib/feed'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  const repo = getRepo()
  const user = (await repo.getUserById(username)) || (await repo.getUserByUsername(username))
  if (!user) return { title: 'প্রোফাইল পাওয়া যায়নি' }
  return {
    title: `${user.name} (@${user.username})`,
    description: user.bio || `${user.name} — ${'রূপসী বাংলায়'} শেয়ার করা ছবি ও ভিডিও`,
  }
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const repo = getRepo()
  const user = (await repo.getUserById(username)) || (await repo.getUserByUsername(username))
  if (!user) notFound()
  const session = await getSession()
  const feed = await buildFeedPage({ authorId: user.id, limit: 12, withSpecies: false })
  const following = session ? await repo.isFollowing(session.id, user.id) : false
  const FollowBtn = (await import('@/components/FollowButton')).default

  return (
    <div className="container-pb py-6">
      <div className="card overflow-hidden">
        <div className="relative h-24 overflow-hidden bg-gradient-to-r from-forest-600 via-forest-700 to-forest-900 sm:h-32">
          {user.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.cover} alt="" className="h-full w-full object-cover" />
          ) : null}
          <ProfileControls isOwn={session?.id === user.id} cover={user.cover} />
        </div>
        <div className="px-5 pb-5">
          <div className="-mt-10 mb-3 flex items-end gap-4">
            <div className="relative">
            <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-forest-100 text-2xl font-bold text-forest-800">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                user.name.slice(0, 1)
              )}
            </span>
              <ProfileAvatarButton isOwn={session?.id === user.id} />
            </div>
            <div className="mb-1 min-w-0 flex-1">
              <h1 className="flex items-center gap-1.5 text-xl font-bold text-forest-900">
                <span className="truncate">{user.name}</span>
                {user.verified && <BadgeCheck size={18} className="shrink-0 text-sky-500" />}
              </h1>
              <p className="text-xs text-black/50">@{user.username}</p>
            </div>
            {session?.id !== user.id && (
              <FollowBtn userId={user.id} initial={following} loggedIn={!!session} className="mb-1 shrink-0" />
            )}
            {session?.id === user.id && (
              <Link href="/share" className="btn-primary mb-1 shrink-0">
                <Camera size={15} /> নতুন পোস্ট
              </Link>
            )}
          </div>

          {user.bio && <p className="max-w-2xl text-sm leading-relaxed text-black/70">{user.bio}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-black/50">
            <span>
              <b className="text-forest-900">{toBn(user.followers)}</b> অনুসারী
            </span>
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {user.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <CalendarDays size={12} /> যোগ দিয়েছেন {new Date(user.createdAt).getFullYear()} সালে
            </span>
            {user.role === 'partner' && (
              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                যাচাইকৃত পার্টনার
              </span>
            )}
            {user.role === 'admin' && (
              <span className="rounded-full bg-forest-50 px-2 py-0.5 text-[11px] font-semibold text-forest-700">অ্যাডমিন</span>
            )}
          </div>
        </div>
      </div>

      <h2 className="mb-3 mt-6 section-title">{user.name} এর শেয়ার</h2>
      <Feed
        initialItems={feed.items as any}
        initialCursor={feed.nextCursor}
        query={{ author: user.id, speciesMix: '0' }}
        emptyMessage="এই চ্যানেলে এখনো কোনো পোস্ট নেই।"
      />

      <p className="mt-6 text-center text-xs text-black/40">
        <Link href="/share" className="text-forest-700 hover:underline">
          নিজের ছবি শেয়ার করতে চান?
        </Link>
      </p>
    </div>
  )
}
