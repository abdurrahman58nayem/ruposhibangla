'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Heart, MessageCircle, MapPin, Play, FileText, BadgeCheck } from 'lucide-react'
import type { Post } from '@/lib/types'
import { compactBn, timeAgoBn } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function PostCard({ post, likedInitially = false, dense = false }: { post: Post; likedInitially?: boolean; dense?: boolean }) {
  const [likes, setLikes] = useState(post.likes)
  const [liked, setLiked] = useState(likedInitially)
  const [busy, setBusy] = useState(false)

  async function toggleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (busy) return
    setBusy(true)
    setLiked((v) => !v)
    setLikes((n) => (liked ? Math.max(0, n - 1) : n + 1))
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
      const data = await res.json()
      if (typeof data.likes === 'number') setLikes(data.likes)
      if (typeof data.liked === 'boolean') setLiked(data.liked)
      // অতিথি ব্যবহারকারীর লাইক মনে রাখা
      try {
        const ids = new Set(JSON.parse(localStorage.getItem('pb_liked') || '[]'))
        if (data.liked) ids.add(post.id)
        else ids.delete(post.id)
        localStorage.setItem('pb_liked', JSON.stringify([...ids].slice(-300)))
      } catch {}
    } catch {
      setLiked((v) => !v)
    } finally {
      setBusy(false)
    }
  }

  const href = `/post/${post.id}`

  return (
    <article className="feed-item card overflow-hidden transition hover:shadow-lg">
      <Link href={href} className="block">
        {post.kind === 'video' && post.mediaUrl ? (
          <div className="relative bg-black">
            <video
              src={post.mediaUrl}
              poster={post.thumbUrl}
              className="h-auto max-h-[520px] w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
            <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white">
              <Play size={10} className="inline" /> ভিডিও
            </span>
          </div>
        ) : post.mediaUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.mediaUrl}
              alt={post.title || 'ছবি'}
              loading="lazy"
              className={cn('w-full object-cover', dense ? 'max-h-80' : 'max-h-[520px]')}
            />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-forest-50 to-earth-50 p-5">
            <FileText className="mb-2 text-forest-600" size={20} />
          </div>
        )}
      </Link>

      <div className="p-3.5">
        <div className="mb-2 flex items-center gap-2">
          <Link
            href={post.authorId ? `/u/${post.authorId}` : '#'}
            className="flex min-w-0 items-center gap-2"
            onClick={(e) => !post.authorId && e.preventDefault()}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-forest-100 text-[11px] font-bold text-forest-800">
              {post.authorName.slice(0, 1)}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 truncate text-[13px] font-semibold text-forest-900">
                <span className="truncate">{post.authorName}</span>
                <BadgeCheck size={13} className="shrink-0 text-sky-500" />
              </span>
              <span className="block text-[10px] text-black/45">{timeAgoBn(post.createdAt)}</span>
            </span>
          </Link>
        </div>

        {post.title && (
          <Link href={href}>
            <h3 className="mb-1 text-[15px] font-bold leading-snug text-forest-900">{post.title}</h3>
          </Link>
        )}
        {post.body && <p className="line-clamp-3 text-[13px] leading-relaxed text-black/70">{post.body}</p>}

        {post.speciesSlug && (
          <Link
            href={`/prani/${post.speciesSlug}`}
            className="mt-2 inline-flex rounded-full bg-forest-50 px-2 py-0.5 text-[11px] font-medium text-forest-800"
          >
            প্রজাতির পাতা
          </Link>
        )}
        {post.location && (
          <p className="mt-2 flex items-center gap-1 text-[11px] text-black/45">
            <MapPin size={11} /> {post.location}
          </p>
        )}

        <div className="mt-3 flex items-center gap-1 border-t border-black/5 pt-2">
          <button
            onClick={toggleLike}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition',
              liked ? 'bg-rose-50 text-rose-600' : 'text-black/55 hover:bg-black/5',
            )}
            aria-pressed={liked}
          >
            <Heart size={15} className={liked ? 'fill-rose-500 text-rose-500' : ''} />
            {compactBn(likes)}
          </button>
          <Link
            href={`${href}#comments`}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-black/55 transition hover:bg-black/5"
          >
            <MessageCircle size={15} /> {compactBn(post.comments)}
          </Link>
          <Link href={href} className="ml-auto text-xs font-medium text-forest-700 hover:underline">
            বিস্তারিত
          </Link>
        </div>
      </div>
    </article>
  )
}
