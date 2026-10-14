'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Heart, MessageCircle, Share2, Volume2, VolumeX, Play, Pause, Flag, BadgeCheck, ArrowLeft,
} from 'lucide-react'
import type { Post } from '@/lib/types'
import { useApp } from '@/components/Providers'
import { compactBn, timeAgoBn } from '@/lib/utils'

/** রিলস — পূর্ণ স্ক্রিন উল্লম্ব ভিডিও; সোয়াইপ/স্ক্রলে পরের ভিডিও */
export default function ReelsFeed({ items }: { items: Post[] }) {
  const { autoplay, videoSound, dataSaver, t } = useApp()
  const [playing, setPlaying] = useState<Record<string, boolean>>({})
  const [muted, setMuted] = useState(!videoSound)
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [likes, setLikes] = useState<Record<string, number>>({})
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  useEffect(() => {
    setMuted(!videoSound)
    Object.values(videoRefs.current).forEach((v) => {
      if (v) v.muted = !videoSound
    })
  }, [videoSound])

  // ভিউপোর্টে থাকা ভিডিওটিই চালু হবে
  useEffect(() => {
    if (!items.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLVideoElement
          const id = el.dataset.id || ''
          const v = videoRefs.current[id]
          if (!v) return
          if (e.isIntersecting) {
            if (autoplay && !dataSaver) v.play().catch(() => {})
            setPlaying((p) => ({ ...p, [id]: true }))
          } else {
            v.pause()
            setPlaying((p) => ({ ...p, [id]: false }))
          }
        })
      },
      { threshold: 0.6 },
    )
    Object.values(videoRefs.current).forEach((v) => v && io.observe(v))
    return () => io.disconnect()
  }, [items, autoplay, dataSaver])

  async function toggleLike(id: string) {
    const res = await fetch(`/api/posts/${id}/like`, { method: 'POST' })
    const data = await res.json()
    if (typeof data.liked === 'boolean') setLiked((p) => ({ ...p, [id]: data.liked }))
    if (typeof data.likes === 'number') setLikes((p) => ({ ...p, [id]: data.likes }))
  }

  function toggle(id: string) {
    const v = videoRefs.current[id]
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
      setPlaying((p) => ({ ...p, [id]: true }))
    } else {
      v.pause()
      setPlaying((p) => ({ ...p, [id]: false }))
    }
  }

  if (!items.length) {
    return (
      <div className="container-pb py-16 text-center">
        <h1 className="text-xl font-bold text-forest-900">রিলস</h1>
        <p className="mt-2 text-sm text-black/55">
          এখনো কোনো রিলস প্রকাশিত হয়নি। প্রকৃতির ছোট ভিডিও আপলোড করেই প্রথম রিলসটি শেয়ার করুন।
        </p>
        <Link href="/share?kind=reel" className="btn-primary mt-5">
          রিলস আপলোড করুন
        </Link>
      </div>
    )
  }

  return (
    <div className="relative bg-black">
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center gap-2 bg-gradient-to-b from-black/70 to-transparent p-3">
        <Link href="/" className="pointer-events-auto rounded-full bg-white/10 p-2 text-white backdrop-blur">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-sm font-bold text-white">রিলস</span>
        <Link href="/share?kind=reel" className="pointer-events-auto ml-auto rounded-full bg-forest-700 px-3 py-1.5 text-xs font-semibold text-white">
          রিলস যোগ করুন
        </Link>
      </div>

      <div className="h-[calc(100dvh-3.25rem)] snap-y snap-mandatory overflow-y-scroll md:h-screen">
        {items.map((p) => {
          const isPlaying = playing[p.id] ?? false
          return (
            <section key={p.id} className="relative h-full w-full snap-start">
              <video
                ref={(el) => {
                  videoRefs.current[p.id] = el
                }}
                data-id={p.id}
                src={p.mediaUrl}
                poster={p.thumbUrl || undefined}
                loop
                playsInline
                muted={muted}
                preload={dataSaver ? 'none' : 'metadata'}
                onClick={() => toggle(p.id)}
                className="h-full w-full bg-black object-contain"
              />

              {/* নিচের তথ্য — ভিডিও ঢাকে না */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 pb-24">
                <div className="pointer-events-auto max-w-[78%]">
                  <Link href={`/u/${p.authorId || 'guest'}`} className="mb-1 flex items-center gap-2 text-white">
                    <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-white/20 text-xs font-bold">
                      {(p.authorName || 'অ').slice(0, 1)}
                    </span>
                    <span className="text-sm font-semibold">{p.authorName}</span>
                  </Link>
                  {p.title && <p className="text-[13px] font-semibold text-white">{p.title}</p>}
                  {p.body && <p className="mt-0.5 line-clamp-2 text-xs text-white/80">{p.body}</p>}
                  <p className="mt-1 text-[10px] text-white/55">
                    {timeAgoBn(p.createdAt)}
                    {p.location ? ` · ${p.location}` : ''}
                  </p>
                  {p.speciesSlug && (
                    <Link
                      href={`/search?q=${encodeURIComponent(p.speciesSlug)}`}
                      className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur"
                    >
                      <BadgeCheck size={11} /> প্রজাতির তথ্য দেখুন
                    </Link>
                  )}
                </div>
              </div>

              {/* ডান পাশের অ্যাকশন */}
              <div className="absolute bottom-24 right-3 z-10 flex flex-col items-center gap-4">
                <button
                  onClick={() => toggleLike(p.id)}
                  className="flex flex-col items-center text-white"
                  aria-label="লাইক"
                >
                  <Heart size={26} className={liked[p.id] ? 'fill-red-500 text-red-500' : ''} />
                  <span className="text-[11px]">{compactBn(likes[p.id] ?? p.likes)}</span>
                </button>
                <Link href={`/post/${p.id}`} className="flex flex-col items-center text-white" aria-label="মন্তব্য">
                  <MessageCircle size={24} />
                  <span className="text-[11px]">{compactBn(p.comments)}</span>
                </Link>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/post/${p.id}`
                    if (navigator.share) navigator.share({ title: p.title || 'রূপসী বাংলা', url })
                    else navigator.clipboard?.writeText(url)
                  }}
                  className="flex flex-col items-center text-white"
                  aria-label="শেয়ার"
                >
                  <Share2 size={24} />
                </button>
                <Link href={`/post/${p.id}?report=1`} className="text-white/70" aria-label="রিপোর্ট">
                  <Flag size={18} />
                </Link>
              </div>

              {/* নিয়ন্ত্রণ */}
              <div className="absolute right-3 top-16 z-10 flex flex-col gap-2">
                <button
                  onClick={() => setMuted((m) => !m)}
                  className="rounded-full bg-black/40 p-2 text-white backdrop-blur"
                  aria-label="শব্দ"
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  onClick={() => toggle(p.id)}
                  className="rounded-full bg-black/40 p-2 text-white backdrop-blur"
                  aria-label="চালু/বন্ধ"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
