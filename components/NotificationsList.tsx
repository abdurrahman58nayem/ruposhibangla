'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Bell, Check, Sparkles } from 'lucide-react'
import type { Notification } from '@/lib/types'
import { timeAgoBn } from '@/lib/utils'

export default function NotificationsList() {
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/notifications', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false))
  }, [])

  async function markAll() {
    await fetch('/api/notifications', { method: 'POST' })
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-forest-900">
          <Bell size={22} /> নোটিফিকেশন
        </h1>
        {items.some((n) => !n.read) && (
          <button onClick={markAll} className="btn-soft px-3 py-1.5 text-xs">
            <Check size={13} /> সব পঠিত
          </button>
        )}
      </div>

      {loading && <div className="card p-8 text-center text-sm text-black/50">লোড হচ্ছে…</div>}

      {!loading && !items.length && (
        <div className="card p-8 text-center">
          <Sparkles size={28} className="mx-auto mb-2 text-forest-600" />
          <p className="text-sm text-black/55">এখনো কোনো বার্তা নেই।</p>
          <p className="mt-1 text-xs text-black/45">
            এআই-এর কাছে কোনো প্রশ্ন পাঠালে উত্তর পাওয়া গেলে এখানেই জানানো হবে।
          </p>
          <Link href="/ai" className="btn-primary mt-4">
            এআই-কে প্রশ্ন করুন
          </Link>
        </div>
      )}

      <div className="space-y-2">
        {items.map((n) => (
          <Link
            key={n.id}
            href={n.url || '#'}
            className={`card block p-3 transition hover:bg-forest-50 ${n.read ? 'opacity-70' : ''}`}
          >
            <div className="flex items-start gap-2">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-black/20' : 'bg-forest-600'}`} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-forest-900">{n.title}</p>
                {n.body && <p className="mt-0.5 line-clamp-2 text-xs text-black/60">{n.body}</p>}
                <p className="mt-1 text-[10px] text-black/40">{timeAgoBn(n.createdAt)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
