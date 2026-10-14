'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Trash2, Save } from 'lucide-react'
import UploadField from './UploadField'
import type { News } from '@/lib/types'
import { uid, slugify } from '@/lib/utils'

const blank = (): News => ({
  id: uid('news'),
  slug: '',
  title: '',
  excerpt: '',
  body: '',
  cover: '',
  tags: [],
  published: true,
  pinned: false,
  views: 0,
  createdAt: new Date().toISOString(),
})

export default function NewsManager({ initial }: { initial: News[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [draft, setDraft] = useState<News | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function save() {
    if (!draft) return
    if (!draft.title.trim()) return setMsg('শিরোনাম দিন')
    setBusy(true)
    setMsg('')
    try {
      const payload = { ...draft, slug: draft.slug || slugify(draft.title) }
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'ব্যর্থ')
      setItems((prev) => {
        const i = prev.findIndex((n) => n.slug === data.news.slug)
        if (i >= 0) {
          const next = [...prev]
          next[i] = data.news
          return next
        }
        return [data.news, ...prev]
      })
      setDraft(null)
      router.refresh()
    } catch (e: any) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove(slug: string) {
    if (!confirm('মুছে ফেলবেন?')) return
    await fetch(`/api/news/${slug}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((n) => n.slug !== slug))
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-forest-900">খবর ({items.length})</h2>
          <p className="text-xs text-black/50">প্রাণী ও উদ্ভিদ নিয়ে নতুন খবর প্রকাশ করুন</p>
        </div>
        <button onClick={() => setDraft(blank())} className="btn-primary text-sm">
          <Plus size={16} /> নতুন খবর
        </button>
      </div>

      {draft && (
        <div className="card space-y-3 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">শিরোনাম</label>
              <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="field" />
            </div>
            <div>
              <label className="label">স্লাগ (খালি রাখলে স্বয়ংক্রিয়)</label>
              <input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className="field" />
            </div>
          </div>
          <div>
            <label className="label">সারাংশ</label>
            <textarea value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} rows={2} className="field resize-none" />
          </div>
          <div>
            <label className="label">বিস্তারিত (অনুচ্ছেদ আলাদা করতে দুইবার এন্টার)</label>
            <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} rows={8} className="field resize-none" />
          </div>
          <UploadField value={draft.cover || ''} onChange={(url) => setDraft({ ...draft, cover: url })} label="প্রচ্ছদ ছবি" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">ট্যাগ (কমা দিয়ে)</label>
              <input
                value={draft.tags.join(', ')}
                onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                className="field"
              />
            </div>
            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> প্রকাশিত
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!draft.pinned} onChange={(e) => setDraft({ ...draft, pinned: e.target.checked })} /> পিন করা
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="btn-primary" disabled={busy}>
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} সংরক্ষণ
            </button>
            <button onClick={() => setDraft(null)} className="btn-outline">
              বাতিল
            </button>
            {msg && <span className="self-center text-sm text-black/60">{msg}</span>}
          </div>
        </div>
      )}

      <div className="card divide-y divide-black/5">
        {items.map((n) => (
          <div key={n.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-forest-900">{n.title}</p>
              <p className="text-[11px] text-black/45">
                /khobor/{n.slug} · {n.published ? 'প্রকাশিত' : 'খসড়া'} {n.pinned ? '· পিন করা' : ''}
              </p>
            </div>
            <button onClick={() => setDraft(n)} className="btn-soft px-3 py-1 text-xs">
              সম্পাদনা
            </button>
            <button onClick={() => remove(n.slug)} className="rounded-full p-2 text-black/40 hover:bg-red-50 hover:text-red-600">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {!items.length && <p className="p-8 text-center text-sm text-black/50">কোনো খবর নেই।</p>}
      </div>
    </div>
  )
}
