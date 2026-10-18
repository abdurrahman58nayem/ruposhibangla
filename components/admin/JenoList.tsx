'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import type { Jeno } from '@/lib/types'
import { timeAgoBn, toBn } from '@/lib/utils'

export default function JenoList({ initial }: { initial: Jeno[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initial)

  async function patch(id: string, status: Jeno['status']) {
    setItems((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)))
    await fetch(`/api/jeno/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('মুছে ফেলবেন?')) return
    setItems((prev) => prev.filter((j) => j.id !== id))
    await fetch(`/api/jeno/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-forest-900">জেনো — পাঠানো তথ্য ({toBn(items.length)})</h2>
      <p className="mb-4 text-xs text-black/50">দর্শকদের পাঠানো তথ্য, ভুল সংশোধন ও পরামর্ষ</p>

      <div className="space-y-3">
        {items.map((j) => (
          <div key={j.id} className="card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-forest-900">{j.name}</p>
              {j.contact && <span className="text-[11px] text-black/45">· {j.contact}</span>}
              <span className="text-[11px] text-black/35">· {timeAgoBn(j.createdAt)}</span>
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  j.status === 'new' ? 'bg-red-100 text-red-700' : j.status === 'read' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {j.status}
              </span>
            </div>
            {j.topic && <p className="mt-1 text-xs font-medium text-forest-700">বিষয়: {j.topic}</p>}
            <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-black/70">{j.message}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => patch(j.id, 'read')} className="btn-soft px-3 py-1 text-[11px]">
                পড়া হয়েছে
              </button>
              <button onClick={() => patch(j.id, 'done')} className="btn-soft px-3 py-1 text-[11px] text-emerald-700">
                কাজ শেষ
              </button>
              <button onClick={() => patch(j.id, 'new')} className="btn-soft px-3 py-1 text-[11px]">
                নতুন হিসেবে চিহ্নিত
              </button>
              <button onClick={() => remove(j.id)} className="ml-auto rounded-full p-1.5 text-black/40 hover:bg-red-50 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {!items.length && <div className="card p-8 text-center text-sm text-black/50">কোনো বার্তা নেই।</div>}
      </div>
    </div>
  )
}
