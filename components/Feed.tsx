'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { Post, Species } from '@/lib/types'
import PostCard from './PostCard'
import SpeciesCard from './SpeciesCard'

export type ClientFeedItem =
  | { type: 'post'; key: string; data: Post }
  | { type: 'species'; key: string; data: Species }

export default function Feed({
  initialItems,
  initialCursor,
  query = {},
  emptyMessage = 'এখনো কিছু শেয়ার করা হয়নি। প্রথমটি আপনি শেয়ার করুন!',
}: {
  initialItems: ClientFeedItem[]
  initialCursor: string | null
  query?: Record<string, string | undefined>
  emptyMessage?: string
}) {
  const [items, setItems] = useState<ClientFeedItem[]>(initialItems)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [loading, setLoading] = useState(false)
  const [likedIds, setLikedIds] = useState<string[]>([])
  const sentinel = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setItems(initialItems)
    setCursor(initialCursor)
  }, [initialItems, initialCursor])

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('pb_liked') || '[]') as string[]
    if (Array.isArray(ids)) setLikedIds(ids)
  }, [])

  useEffect(() => {
    if (!cursor) return
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) void loadMore()
      },
      { rootMargin: '700px' },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, loading])

  async function loadMore() {
    if (loading || !cursor) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(query).forEach(([k, v]) => v && params.set(k, v))
      params.set('cursor', cursor)
      const res = await fetch(`/api/feed?${params.toString()}`)
      const data = (await res.json()) as { items: ClientFeedItem[]; nextCursor: string | null }
      if (data.items?.length) {
        setItems((prev) => {
          const seen = new Set(prev.map((i) => i.key))
          return [...prev, ...data.items.filter((i) => !seen.has(i.key))]
        })
      }
      setCursor(data.nextCursor)
    } catch {
      /* silently ignore */
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <div className="card grid place-items-center p-10 text-center text-sm text-black/50">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      <div className="feed-grid">
        {items.map((item) =>
          item.type === 'post' ? (
            <PostCard key={item.key} post={item.data} likedInitially={likedIds.includes(item.data.id)} />
          ) : (
            <div key={item.key} className="feed-item">
              <div className="mb-1 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-forest-700">
                <span className="rounded-full bg-forest-50 px-2 py-0.5">তথ্যভাণ্ডার</span>
              </div>
              <SpeciesCard s={item.data} />
            </div>
          ),
        )}
      </div>

      <div ref={sentinel} className="py-8 text-center">
        {loading && (
          <span className="inline-flex items-center gap-2 text-sm text-black/50">
            <Loader2 className="animate-spin" size={16} /> আরো আনা হচ্ছে…
          </span>
        )}
        {!loading && !cursor && <span className="text-xs text-black/35">— শেষ —</span>}
      </div>
    </>
  )
}
