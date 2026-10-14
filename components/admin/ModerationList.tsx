'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, X, Trash2, Star } from 'lucide-react'
import type { Post } from '@/lib/types'
import { timeAgoBn } from '@/lib/utils'

export default function ModerationList({ initial }: { initial: Post[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [busy, setBusy] = useState('')

  async function patch(id: string, data: Partial<Post>) {
    setBusy(id)
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      })
      router.refresh()
    } finally {
      setBusy('')
    }
  }

  async function remove(id: string) {
    if (!confirm('মুছে ফেলবেন?')) return
    setItems((prev) => prev.filter((p) => p.id !== id))
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && <div className="card p-8 text-center text-sm text-black/50">কোনো পোস্ট নেই।</div>}
      {items.map((p) => (
        <div key={p.id} className="card flex flex-wrap items-center gap-3 p-3">
          {p.mediaUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.mediaUrl} alt="" className="h-16 w-24 rounded-lg object-cover" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-forest-900">{p.title || p.body?.slice(0, 50) || '—'}</p>
            <p className="text-[11px] text-black/45">
              {p.authorName} · {timeAgoBn(p.createdAt)} · {p.category} · {p.kind}
            </p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : p.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {p.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Link href={`/post/${p.id}`} className="btn-soft px-2.5 py-1 text-[11px]">
              দেখুন
            </Link>
            {p.status !== 'approved' && (
              <button onClick={() => patch(p.id, { status: 'approved' })} className="btn-soft px-2.5 py-1 text-[11px] text-emerald-700">
                <Check size={12} /> অনুমোদন
              </button>
            )}
            {p.status !== 'rejected' && (
              <button onClick={() => patch(p.id, { status: 'rejected' })} className="btn-soft px-2.5 py-1 text-[11px] text-amber-700">
                <X size={12} /> বাতিল
              </button>
            )}
            <button
              onClick={() => patch(p.id, { featured: !p.featured })}
              className={`btn-soft px-2.5 py-1 text-[11px] ${p.featured ? 'text-earth-600' : ''}`}
            >
              <Star size={12} className={p.featured ? 'fill-earth-500 text-earth-500' : ''} /> ফিচার্ড
            </button>
            <button onClick={() => remove(p.id)} className="rounded-full p-1.5 text-black/40 hover:bg-red-50 hover:text-red-600">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
