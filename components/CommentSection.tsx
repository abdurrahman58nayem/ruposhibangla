'use client'

import { useEffect, useState } from 'react'
import { Send, Trash2 } from 'lucide-react'
import type { Comment } from '@/lib/types'
import { timeAgoBn } from '@/lib/utils'

export default function CommentSection({
  postId,
  initial = [],
  userName,
  isAdmin = false,
}: {
  postId: string
  initial?: Comment[]
  userName?: string
  isAdmin?: boolean
}) {
  const [items, setItems] = useState<Comment[]>(initial)
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => setItems(initial), [initial])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || busy) return
    setBusy(true)
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ body: text.trim(), name: name.trim() }),
      })
      const data = await res.json()
      if (data.comment) {
        setItems((prev) => [...prev, data.comment])
        setText('')
      }
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    await fetch(`/api/posts/${postId}/comments?id=${id}`, { method: 'DELETE' }).catch(() => {})
    setItems((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <section id="comments" className="scroll-mt-24">
      <h2 className="mb-3 text-lg font-bold text-forest-900">মন্তব্য ({items.length})</h2>

      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="flex gap-3 rounded-2xl bg-forest-50/60 p-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-200 text-xs font-bold text-forest-900">
              {c.name.slice(0, 1)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-forest-900">
                {c.name}
                <span className="text-[11px] font-normal text-black/40">{timeAgoBn(c.createdAt)}</span>
                {isAdmin && (
                  <button onClick={() => remove(c.id)} className="ml-auto text-black/30 hover:text-red-500" aria-label="মুছুন">
                    <Trash2 size={13} />
                  </button>
                )}
              </p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-black/75">{c.body}</p>
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
      </form>
    </section>
  )
}
