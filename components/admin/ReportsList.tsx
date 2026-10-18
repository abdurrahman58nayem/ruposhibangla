'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Eye } from 'lucide-react'
import type { Report } from '@/lib/types'
import { timeAgoBn, toBn } from '@/lib/utils'

export default function ReportsList({ initial }: { initial: Report[] }) {
  const [items, setItems] = useState(initial)

  async function patch(id: string, status: Report['status']) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    await fetch(`/api/reports`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).catch(() => {})
  }

  const open = items.filter((r) => r.status === 'new')

  return (
    <div>
      <h2 className="text-lg font-bold text-forest-900">রিপোর্ট পর্যালোচনা</h2>
      <p className="mb-4 text-xs text-black/50">
        সম্প্রদায়ের পাঠানো রিপোর্ট — খোলা {toBn(open.length)}টি, মোট {toBn(items.length)}টি।
      </p>

      <div className="space-y-2">
        {items.map((r) => (
          <div key={r.id} className="card flex flex-wrap items-center gap-3 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-forest-900">
                {r.reason} · <span className="text-[11px] font-normal text-black/45">{r.targetType}</span>
              </p>
              {r.details && <p className="line-clamp-2 text-xs text-black/60">{r.details}</p>}
              <p className="mt-0.5 text-[10px] text-black/40">
                {r.reporterName || 'অতিথি'} · {timeAgoBn(r.createdAt)}
              </p>
            </div>
            <Link
              href={r.targetType === 'post' ? `/post/${r.targetId}` : `/search?q=${encodeURIComponent(r.targetId)}`}
              className="btn-soft px-2.5 py-1 text-[11px]"
            >
              <Eye size={12} /> দেখুন
            </Link>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                r.status === 'new' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {r.status === 'new' ? 'নতুন' : r.status === 'reviewing' ? 'দেখা হচ্ছে' : r.status === 'resolved' ? 'সমাধান' : 'খারিজ'}
            </span>
            {r.status === 'new' && (
              <>
                <button onClick={() => patch(r.id, 'reviewing')} className="btn-soft px-2.5 py-1 text-[11px]">
                  দেখছি
                </button>
                <button
                  onClick={() => patch(r.id, 'resolved')}
                  className="rounded-full p-1.5 text-black/40 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <CheckCircle2 size={15} />
                </button>
              </>
            )}
          </div>
        ))}
        {!items.length && <div className="card p-8 text-center text-sm text-black/50">কোনো রিপোর্ট নেই।</div>}
      </div>
    </div>
  )
}
