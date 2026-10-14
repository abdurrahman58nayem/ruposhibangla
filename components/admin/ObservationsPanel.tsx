'use client'

import { useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import type { Observation } from '@/lib/types'
import { bnDate, timeAgoBn } from '@/lib/utils'

export default function ObservationsPanel({ initial }: { initial: Observation[] }) {
  const [items, setItems] = useState(initial)

  async function patch(id: string, body: Partial<Observation>) {
    setItems((prev) => prev.map((o) => (o.id === id ? { ...o, ...body } : o)))
    await fetch(`/api/observations/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  const pending = items.filter((o) => o.status === 'submitted' || o.status === 'identified')

  return (
    <div>
      <h2 className="text-lg font-bold text-forest-900">পর্যবেক্ষণ যাচাই</h2>
      <p className="mb-4 text-xs text-black/50">
        সম্প্রদায়ের পাঠানো পর্যবেক্ষণ। শনাক্ত করার পরও এটি “সাধারণ পোস্ট” নয় — যাচাইকৃত পর্যবেক্ষণ হিসেবে
        আলাদাভাবে চিহ্নিত হবে। ({pending.length} টি অপেক্ষমান)
      </p>

      <div className="space-y-3">
        {items
          .filter((o) => o.status !== 'rejected')
          .map((o) => (
            <div key={o.id} className="card flex flex-wrap gap-3 p-3">
              {o.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={o.photoUrl} alt="" className="h-24 w-32 rounded-lg object-cover" />
              ) : (
                <span className="grid h-24 w-32 place-items-center rounded-lg bg-forest-50 text-[10px] text-forest-700">
                  ছবি নেই
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-forest-900">
                  {o.speciesSlug || o.guessedName || 'পরিচয় জানা যায়নি'}
                </p>
                <p className="text-[11px] text-black/45">
                  {o.name} · দেখা: {bnDate(o.observedAt)} · জমা: {timeAgoBn(o.createdAt)}
                  {o.locationShared && o.location ? ` · ${o.location}` : ''}
                </p>
                {o.notes && <p className="mt-1 text-xs leading-relaxed text-black/65">{o.notes}</p>}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input
                    defaultValue={o.speciesSlug || ''}
                    onBlur={(e) => e.target.value !== (o.speciesSlug || '') && patch(o.id, { speciesSlug: e.target.value, uncertain: !e.target.value })}
                    placeholder="প্রজাতির স্লাগ (যেমন: doyel)"
                    className="field max-w-[220px] py-1 text-xs"
                  />
                  <button
                    onClick={() => patch(o.id, { status: 'identified', uncertain: true })}
                    className="btn-soft px-2.5 py-1 text-[11px]"
                  >
                    শনাক্ত (পর্যালোচনাধীন)
                  </button>
                  <button
                    onClick={() => patch(o.id, { status: 'verified', uncertain: false })}
                    className="btn-soft px-2.5 py-1 text-[11px] text-emerald-700"
                  >
                    <CheckCircle2 size={12} /> যাচাইকৃত
                  </button>
                  <button
                    onClick={() => patch(o.id, { status: 'rejected' })}
                    className="rounded-full p-1.5 text-black/40 hover:bg-red-50 hover:text-red-600"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        {!items.length && (
          <div className="card p-8 text-center text-sm text-black/50">কোনো পর্যবেক্ষণ জমা পড়েনি।</div>
        )}
      </div>
    </div>
  )
}
