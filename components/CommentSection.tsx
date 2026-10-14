'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Send, Trash2, BadgeCheck, Sparkles, Users, HelpCircle } from 'lucide-react'
import type { Comment } from '@/lib/types'
import { timeAgoBn, cn } from '@/lib/utils'

type Suggestion = Comment & { _label: string }

export default function CommentSection({
  postId,
  initial = [],
  userName,
  isAdmin = false,
  needsIdentification = false,
  identifiedSpecies = '',
}: {
  postId: string
  initial?: Comment[]
  userName?: string
  isAdmin?: boolean
  needsIdentification?: boolean
  identifiedSpecies?: string
}) {
  const [items, setItems] = useState<Comment[]>(initial)
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [guess, setGuess] = useState('')
  const [guessName, setGuessName] = useState('')
  const [options, setOptions] = useState<{ slug: string; nameBn: string; scientificName: string }[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => setItems(initial), [initial])

  const suggestions = useMemo<Suggestion[]>(
    () =>
      items
        .filter((c) => !!c.suggestedSpecies)
        .map((c) => ({ ...c, _label: c.suggestedName || c.suggestedSpecies || '' }))
        .sort((a, b) => Number(!!b.idVerified) - Number(!!a.idVerified)),
    [items],
  )

  async function lookupSpecies(q: string) {
    if (q.trim().length < 2) {
      setOptions([])
      return
    }
    try {
      const res = await fetch(`/api/species?q=${encodeURIComponent(q)}&limit=8`)
      const rows = (await res.json()) as any[]
      setOptions(
        (Array.isArray(rows) ? rows : []).map((s) => ({
          slug: s.slug,
          nameBn: s.nameBn,
          scientificName: s.scientificName || '',
        })),
      )
    } catch {
      setOptions([])
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || busy) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          body: text.trim(),
          name: name.trim(),
          suggestedSpecies: guess.trim() || '',
          suggestedName: guessName.trim() || '',
        }),
      })
      const data = await res.json()
      if (data.comment) {
        setItems((prev) => [...prev, data.comment])
        setText('')
        setGuess('')
        setGuessName('')
        setOptions([])
      } else setError(data.error || 'মন্তব্য পাঠানো যায়নি')
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    await fetch(`/api/comments/${id}`, { method: 'DELETE' }).catch(() => {})
    setItems((prev) => prev.filter((c) => c.id !== id))
  }

  async function verify(c: Comment) {
    const res = await fetch(`/api/comments/${c.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ verify: true }),
    }).catch(() => null)
    if (res?.ok) {
      const data = await res.json()
      setItems((prev) => prev.map((x) => (x.id === c.id ? data.comment : x)))
    }
  }

  return (
    <section id="comments" className="scroll-mt-24">
      {/* §16 — “পরিচয় জানতে চাই” */}
      {(needsIdentification || identifiedSpecies || suggestions.length > 0) && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5">
          <h2 className="mb-1 flex items-center gap-1.5 text-[15px] font-bold text-amber-900">
            <HelpCircle size={16} />
            {needsIdentification ? 'পরিচয় জানতে চাই' : 'শনাক্তকরণ'}
          </h2>
          <p className="mb-2 text-[12px] leading-relaxed text-amber-900/80">
            {needsIdentification
              ? 'লেখক এই প্রজাতিটি চিনতে পারেননি। নিচে মন্তব্যে আপনার ধারণা লিখুন — সম্প্রদায়ের প্রস্তাব স্বয়ংক্রিয়ভাবে যাচাইকৃত হয় না, সম্পাদক/বিশেষজ্ঞ পর্যালোচনার পরেই “যাচাইকৃত” দেখাবে।'
              : 'এই পোস্টে প্রজাতি-শনাক্তকরণের প্রস্তাব আছে।'}
          </p>

          {identifiedSpecies && (
            <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[12px] font-semibold text-emerald-800">
              <BadgeCheck size={13} /> বিশেষজ্ঞ পর্যালোচনায় নিশ্চিত:{' '}
              <Link href={`/prani/${identifiedSpecies}`} className="underline">
                {identifiedSpecies}
              </Link>
            </p>
          )}

          {!!suggestions.length && (
            <ul className="space-y-1.5">
              {suggestions.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-1.5 text-[12px]">
                  <Link href={`/prani/${c.suggestedSpecies}`} className="font-semibold text-forest-900 underline">
                    {c._label}
                  </Link>
                  {c.idVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">
                      <BadgeCheck size={11} /> বিশেষজ্ঞ-যাচাইকৃত
                    </span>
                  ) : c.idSource === 'ai' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 font-medium text-sky-800">
                      <Sparkles size={11} /> এআই অনুমান
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                      <Users size={11} /> সম্প্রদায়ের প্রস্তাব — যাচাই হয়নি
                    </span>
                  )}
                  <span className="text-black/45">
                    {c.name} · {timeAgoBn(c.createdAt)}
                  </span>
                  {isAdmin && !c.idVerified && (
                    <button onClick={() => verify(c)} className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                      যাচাই করুন
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <h2 className="mb-3 text-lg font-bold text-forest-900">মন্তব্য ({items.length})</h2>

      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="flex gap-3 rounded-2xl bg-forest-50/60 p-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-200 text-xs font-bold text-forest-900">
              {c.name.slice(0, 1)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-forest-900">
                {c.name}
                <span className="text-[11px] font-normal text-black/40">{timeAgoBn(c.createdAt)}</span>
                {c.suggestedName && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-medium',
                      c.idVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.idSource === 'ai'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800',
                    )}
                  >
                    {c.idVerified ? 'বিশেষজ্ঞ-যাচাইকৃত' : c.idSource === 'ai' ? 'এআই অনুমান' : 'প্রস্তাব'} · {c.suggestedName}
                  </span>
                )}
                {isAdmin && (
                  <button onClick={() => remove(c.id)} className="ml-auto text-black/30 hover:text-red-500" aria-label="মুছুন">
                    <Trash2 size={13} />
                  </button>
                )}
              </p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-black/75">{c.body}</p>
              {isAdmin && c.suggestedSpecies && !c.idVerified && (
                <button onClick={() => verify(c)} className="mt-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  বিশেষজ্ঞ হিসেবে যাচাই করুন
                </button>
              )}
            </div>
          </div>
        ))}
        {!items.length && <p className="text-sm text-black/45">এখনো কোনো মন্তব্য নেই — প্রথমটি আপনি লিখুন!</p>}
      </div>

      <form onSubmit={submit} className="mt-4 space-y-2">
        {!userName && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="আপনার নাম (ঐচ্ছিক)"
            className="field"
            maxLength={60}
          />
        )}
        <div className="relative">
          <input
            value={guessName}
            onChange={(e) => {
              setGuessName(e.target.value)
              void lookupSpecies(e.target.value)
            }}
            placeholder="প্রজাতির নাম জানলে লিখুন (ঐচ্ছিক) — যেমন: দোয়েল, ইলিশ"
            className="field"
            maxLength={80}
          />
          {!!options.length && guessName.trim().length > 1 && (
            <ul className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-black/10 bg-white shadow-lg">
              {options.map((o) => (
                <li key={o.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      setGuess(o.slug)
                      setGuessName(o.nameBn)
                      setOptions([])
                    }}
                    className="w-full px-3 py-2 text-left text-[13px] hover:bg-forest-50"
                  >
                    <span className="font-semibold text-forest-900">{o.nameBn}</span>
                    {o.scientificName && <span className="ml-1 text-[11px] italic text-black/45">{o.scientificName}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="আপনার মতামত লিখুন…"
            rows={2}
            className="field min-h-[60px] flex-1 resize-none"
            maxLength={1000}
          />
          <button className="btn-primary h-[46px] px-4" disabled={busy || !text.trim()}>
            <Send size={16} />
          </button>
        </div>
        {error && <p className="text-[12px] text-red-600">{error}</p>}
        <p className="text-[11px] text-black/40">
          প্রজাতির প্রস্তাব স্বয়ংক্রিয়ভাবে যাচাইকৃত হয় না — সম্পাদক/বিশেষজ্ঞ পর্যালোচনার পরেই তা “যাচাইকৃত” হিসেবে দেখানো হয়।
        </p>
      </form>
    </section>
  )
}
