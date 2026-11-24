'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BadgeCheck, Clock, ExternalLink, Loader2, ShieldX, X } from 'lucide-react'
import type { UserRecord } from '@/lib/types'
import { bnDate } from '@/lib/utils'

type Row = Omit<UserRecord, 'passwordHash'>

/**
 * নীল টিকের আবেদন-কিউ — অ্যাডমিন এখানেই দেখে অনুমোদন/প্রত্যাখ্যান করেন।
 * প্রত্যাখ্যানে কারণ বাধ্যতামূলক, কারণ সেটি ব্যবহারকারীর সেটিংস পাতায় দেখানো হয়।
 */
export default function VerificationQueue({ pending, decided }: { pending: Row[]; decided: Row[] }) {
  const router = useRouter()
  const [items, setItems] = useState(pending)
  const [busyId, setBusyId] = useState('')
  const [msg, setMsg] = useState('')
  const [reasonFor, setReasonFor] = useState('')
  const [reason, setReason] = useState('')

  async function act(id: string, action: 'approve' | 'reject' | 'revoke', why = '') {
    setBusyId(id)
    setMsg('')
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ verificationAction: action, reason: why }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'সিদ্ধান্ত সংরক্ষণ করা যায়নি')
      setItems((prev) => prev.filter((u) => u.id !== id))
      setReasonFor('')
      setReason('')
      router.refresh()
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'ব্যর্থ হয়েছে')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-forest-900">
          <BadgeCheck size={18} className="text-sky-500" /> ব্লু টিকের আবেদন
          {items.length > 0 && (
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
              {items.length}
            </span>
          )}
        </h2>
        <p className="mb-3 text-xs text-black/50">
          ব্যবহারকারী নিজে যাচাইয়ের আবেদন করলে এখানে জমা হয়। অনুমোদন দিলে প্রোফাইলে নীল টিক বসবে;
          প্রত্যাখ্যানে কারণ লেখা বাধ্যতামূলক — ব্যবহারকারী সেটি নিজের সেটিংসে দেখতে পাবেন।
        </p>

        {msg && <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p>}

        {items.length === 0 ? (
          <p className="card p-4 text-sm text-black/55">এই মুহূর্তে কোনো আবেদন অপেক্ষমাণ নেই।</p>
        ) : (
          <div className="space-y-3">
            {items.map((u) => {
              const req = u.verificationRequest!
              const busy = busyId === u.id
              return (
                <article key={u.id} className="card space-y-3 p-4">
                  <header className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-forest-100 text-xs font-bold text-forest-800">
                        {u.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          u.name.slice(0, 1)
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-forest-900">{u.name}</p>
                        <Link href={`/u/${u.username}`} className="text-[11px] text-black/45 hover:underline">
                          @{u.username} · প্রোফাইল দেখুন
                        </Link>
                      </div>
                    </div>
                    <p className="flex items-center gap-1 text-[11px] text-black/45">
                      <Clock size={12} /> {bnDate(req.requestedAt)}
                    </p>
                  </header>

                  <p className="rounded-xl bg-forest-50/70 px-3 py-2 text-sm leading-relaxed text-forest-900">
                    {req.note}
                  </p>

                  {req.evidence && (
                    <a
                      href={req.evidence}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1 break-all text-xs text-sky-700 hover:underline"
                    >
                      <ExternalLink size={12} className="shrink-0" /> {req.evidence}
                    </a>
                  )}

                  {reasonFor === u.id ? (
                    <div className="space-y-2">
                      <label className="label" htmlFor={`reason-${u.id}`}>
                        প্রত্যাখ্যানের কারণ (ব্যবহারকারী দেখবেন)
                      </label>
                      <textarea
                        id={`reason-${u.id}`}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={2}
                        maxLength={200}
                        className="field"
                        placeholder="যেমন: প্রমাণসূত্র কাজ করছে না — পরিচয় বা কাজের লিংক দিন"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => act(u.id, 'reject', reason)}
                          disabled={busy || !reason.trim()}
                          className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          {busy ? <Loader2 size={13} className="animate-spin" /> : <ShieldX size={13} />}
                          প্রত্যাখ্যান নিশ্চিত করুন
                        </button>
                        <button
                          onClick={() => { setReasonFor(''); setReason('') }}
                          className="inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1.5 text-xs font-semibold text-black/60"
                        >
                          <X size={13} /> বাতিল
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => act(u.id, 'approve')}
                        disabled={busy}
                        className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        {busy ? <Loader2 size={13} className="animate-spin" /> : <BadgeCheck size={13} />}
                        অনুমোদন — নীল টিক দিন
                      </button>
                      <button
                        onClick={() => setReasonFor(u.id)}
                        disabled={busy}
                        className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-xs font-semibold text-black/60 disabled:opacity-50"
                      >
                        <ShieldX size={13} /> প্রত্যাখ্যান
                      </button>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>

      {decided.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-bold text-forest-900">সাম্প্রতিক সিদ্ধান্ত</h2>
          <div className="card divide-y divide-black/5">
            {decided.map((u) => {
              const req = u.verificationRequest!
              const approved = req.status === 'approved'
              return (
                <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-forest-900">{u.name}</p>
                    <p className="truncate text-[11px] text-black/45">
                      {approved ? 'অনুমোদিত' : `প্রত্যাখ্যাত${req.reason ? ` · ${req.reason}` : ''}`}
                      {req.reviewedByName ? ` · ${req.reviewedByName}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        approved ? 'bg-sky-100 text-sky-700' : 'bg-black/5 text-black/50'
                      }`}
                    >
                      {approved ? '✔' : '—'}
                    </span>
                    {approved && (
                      <button
                        onClick={() => {
                          const why = window.prompt('টিক প্রত্যাহারের কারণ লিখুন') || ''
                          if (why.trim()) void act(u.id, 'revoke', why)
                        }}
                        disabled={busyId === u.id}
                        className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold text-black/55 disabled:opacity-50"
                      >
                        টিক প্রত্যাহার
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
