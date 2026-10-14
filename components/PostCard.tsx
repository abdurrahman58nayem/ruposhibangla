'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Heart,
  MessageCircle,
  MapPin,
  Play,
  FileText,
  BadgeCheck,
  Share2,
  Flag,
  X,
} from 'lucide-react'
import type { Post } from '@/lib/types'
import { compactBn, timeAgoBn, cn } from '@/lib/utils'
import { categoryLabel } from '@/lib/categories'

export default function PostCard({ post, likedInitially = false, dense = false }: { post: Post; likedInitially?: boolean; dense?: boolean }) {
  const [likes, setLikes] = useState(post.likes)
  const [liked, setLiked] = useState(likedInitially)
  const [busy, setBusy] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('অপ্রাসঙ্গিক')
  const [reportDetails, setReportDetails] = useState('')
  const [reportDone, setReportDone] = useState(false)
  const [toast, setToast] = useState('')

  const author = post.author || { name: post.authorName, verified: false }
  const href = `/post/${post.id}`

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

  async function share(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}${href}`
    const text = post.title || post.body?.slice(0, 60) || 'রূপসী বাংলা'
    try {
      if (navigator.share) {
        await navigator.share({ title: text, text, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setToast('লিংক কপি করা হয়েছে')
      setTimeout(() => setToast(''), 2000)
    } catch {
      /* ব্যবহারকারী বাতিল করলে চুপচাপ থাকি */
    }
  }

  async function sendReport(e: React.FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        targetType: 'post',
        targetId: post.id,
        reason: reportReason,
        details: reportDetails,
      }),
    }).catch(() => {})
    setReportDone(true)
    setTimeout(() => {
      setReportOpen(false)
      setReportDone(false)
      setReportDetails('')
    }, 1800)
  }

  return (
    <article className="feed-item card overflow-hidden transition hover:shadow-lg">
      <Link href={href} className="block">
        {post.kind !== 'note' && (post.kind === 'reel' || post.mediaType === 'video') && post.mediaUrl ? (
          <div className="relative bg-black">
            <video
              src={post.mediaUrl}
              poster={post.thumbUrl}
              className={cn('h-auto w-full object-cover', post.kind === 'reel' ? 'max-h-[420px]' : 'max-h-[520px]')}
              muted
              loop
              playsInline
              preload="metadata"
            />
            <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white">
              <Play size={10} className="inline" /> {post.kind === 'reel' ? 'রিল' : 'ভিডিও'}
            </span>
          </div>
        ) : post.mediaUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.mediaUrl}
              alt={post.title || 'শেয়ার করা ছবি'}
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
        {/* লেখক: অবতার, প্রদর্শনী নাম, @username, নীল টিক, সময় */}
        <div className="mb-2 flex items-center gap-2">
          <Link
            href={author.username ? `/u/${author.username}` : post.authorId ? `/u/${post.authorId}` : '#'}
            className="flex min-w-0 items-center gap-2"
            onClick={(e) => !author.username && !post.authorId && e.preventDefault()}
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-forest-100 text-[11px] font-bold text-forest-800">
              {author.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={author.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                author.name.slice(0, 1)
              )}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 truncate text-[13px] font-semibold text-forest-900">
                <span className="truncate">{author.name}</span>
                {author.verified && (
                  <span title="যাচাইকৃত — প্রকৃতি ও দেশ নিয়ে কাজ করা অংশীদার">
                    <BadgeCheck size={14} className="shrink-0 fill-sky-500 text-white" />
                  </span>
                )}
              </span>
              <span className="block truncate text-[10px] text-black/45">
                {author.username ? `@${author.username} · ` : ''}
                {timeAgoBn(post.createdAt)}
              </span>
            </span>
          </Link>

          <span className="ml-auto shrink-0 rounded-full bg-forest-50 px-2 py-0.5 text-[10px] font-medium text-forest-800">
            {categoryLabel(post.group) || categoryLabel(post.category)}
          </span>
        </div>

        {post.title && (
          <Link href={href}>
            <h3 className="mb-1 text-[15px] font-bold leading-snug text-forest-900">{post.title}</h3>
          </Link>
        )}
        {post.body && <p className="line-clamp-3 text-[13px] leading-relaxed text-black/70">{post.body}</p>}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {post.needsIdentification && (
            <Link
              href={`${href}#comments`}
              className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800"
            >
              পরিচয় জানতে চাই — সাহায্য করুন
            </Link>
          )}
          {post.identifiedSpecies && (
            <Link
              href={post.speciesHref || `/prani/${post.identifiedSpecies}`}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800"
            >
              <BadgeCheck size={11} /> যাচাইকৃত পরিচয়
            </Link>
          )}
          {post.speciesSlug && (
            <Link
              href={post.speciesHref || `/prani/${post.speciesSlug}`}
              className="inline-flex rounded-full bg-forest-50 px-2 py-0.5 text-[11px] font-medium text-forest-800"
            >
              প্রজাতির পাতা
            </Link>
          )}
        </div>

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
            aria-label="পছন্দ"
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
          <button
            onClick={share}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-black/55 transition hover:bg-black/5"
            aria-label="শেয়ার"
          >
            <Share2 size={15} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setReportOpen(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-black/45 transition hover:bg-black/5"
            aria-label="রিপোর্ট"
          >
            <Flag size={14} />
          </button>
          <Link href={href} className="ml-auto text-xs font-medium text-forest-700 hover:underline">
            বিস্তারিত
          </Link>
        </div>

        {toast && <p className="mt-1 text-[11px] text-forest-700">{toast}</p>}

        {reportOpen && (
          <form onSubmit={sendReport} className="mt-2 rounded-xl border border-black/10 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-forest-900">রিপোর্ট করুন</p>
              <button type="button" onClick={() => setReportOpen(false)} aria-label="বন্ধ">
                <X size={14} className="text-black/40" />
              </button>
            </div>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="field mb-2 text-[13px]"
            >
              <option>অপ্রাসঙ্গিক</option>
              <option>রাজনৈতিক / বিভেদমূলক</option>
              <option>ভুল তথ্য</option>
              <option>বিপন্ন প্রজাতির অবস্থান ফাঁস</option>
              <option>কপিরাইট / অনুমতিহীন মিডিয়া</option>
              <option>অশালীন</option>
              <option>অন্যান্য</option>
            </select>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="বিস্তারিত (ঐচ্ছিক)"
              className="field mb-2 resize-none text-[13px]"
            />
            <button className="btn-primary w-full text-[13px]" disabled={reportDone}>
              {reportDone ? 'ধন্যবাদ — পাঠানো হয়েছে' : 'পাঠান'}
            </button>
          </form>
        )}
      </div>
    </article>
  )
}
