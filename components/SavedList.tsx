'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import type { SavedItem } from '@/lib/types'

export default function SavedList() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/saves', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="mb-1 flex items-center gap-2 text-2xl font-bold text-forest-900">
        <Bookmark size={22} /> সংরক্ষিত
      </h1>
      <p className="mb-4 text-sm text-black/55">পরে দেখার জন্য রাখা প্রজাতি, পোস্ট ও খবর।</p>

      {loading && <div className="card p-8 text-center text-sm text-black/50">লোড হচ্ছে…</div>}
      {!loading && !items.length && (
        <div className="card p-8 text-center text-sm text-black/55">
          কিছুই সংরক্ষণ করেননি। যেকোনো প্রজাতির পাতায় “সংরক্ষণ” বাটনে চেপে রাখুন।
        </div>
      )}

      <div className="space-y-2">
        {items.map((s) => (
          <Link
            key={s.id}
            href={
              s.targetType === 'post'
                ? `/post/${s.targetId}`
                : s.targetType === 'news'
                  ? `/khobor/${s.targetId}`
                  : `/search?q=${encodeURIComponent(s.targetId)}`
            }
            className="card flex items-center gap-3 p-3 transition hover:bg-forest-50"
          >
            <span className="rounded-full bg-forest-50 px-2 py-1 text-[10px] font-semibold text-forest-800">
              {s.targetType === 'post' ? 'পোস্ট' : s.targetType === 'news' ? 'খবর' : 'প্রজাতি'}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-forest-900">{s.targetId}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
