'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Send, CheckCircle2, Trash2 } from 'lucide-react'
import type { AiQuestion } from '@/lib/types'
import { timeAgoBn, toBn } from '@/lib/utils'

const STATUS: { id: AiQuestion['status']; label: string }[] = [
  { id: 'new', label: 'নতুন প্রশ্ন' },
  { id: 'ai_checking', label: 'এআই যাচাই করছে' },
  { id: 'admin_review', label: 'অ্যাডমিন পর্যালোচনায়' },
  { id: 'answer_ready', label: 'উত্তর প্রস্তুত' },
  { id: 'answered', label: 'উত্তর জানানো হয়েছে' },
  { id: 'need_info', label: 'অতিরিক্ত তথ্য প্রয়োজন' },
  { id: 'resolved', label: 'সমাধান সম্পন্ন' },
]

export default function AiQuestionsPanel({ initial }: { initial: AiQuestion[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState('')

  async function patch(id: string, body: Partial<AiQuestion>) {
    setBusy(id)
    try {
      const res = await fetch(`/api/ai/questions/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.ok && data.question) {
        setItems((prev) => prev.map((q) => (q.id === id ? data.question : q)))
      }
      router.refresh()
    } finally {
      setBusy('')
    }
  }

  const pending = items.filter((q) => q.status !== 'answered' && q.status !== 'resolved')

  return (
    <div>
      <h2 className="text-lg font-bold text-forest-900">এআই প্রশ্ন পর্যালোচনা</h2>
      <p className="mb-4 text-xs text-black/50">
        এআই যে প্রশ্নের নির্ভরযোগ্য উত্তর দিতে পারেনি — সেগুলো এখানে। উত্তর প্রকাশ করলে প্রশ্নকারী
        নোটিফিকেশন ও ট্র্যাকিং লিংক পাবেন। ({toBn(pending.length)}টি অপেক্ষমান / মোট {toBn(items.length)})
      </p>

      <div className="space-y-3">
        {items.map((q) => (
          <div key={q.id} className="card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-forest-50 px-2 py-0.5 text-[10px] font-semibold text-forest-800">
                {STATUS.find((s) => s.id === q.status)?.label || q.status}
              </span>
              <span className="text-[11px] text-black/40">{timeAgoBn(q.createdAt)}</span>
              {q.userName && <span className="text-[11px] text-black/45">· {q.userName}</span>}
              <span className="ml-auto text-[10px] text-black/35">কোড: {q.trackCode}</span>
            </div>

            <p className="mt-2 text-sm font-semibold text-forest-900">{q.question}</p>
            {q.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={q.imageUrl} alt="" className="mt-2 max-h-48 rounded-lg object-contain" />
            )}
            {q.aiAnalysis && (
              <p className="mt-2 rounded-xl bg-forest-50/70 p-2 text-[11px] text-forest-900">
                <b>এআই-এর প্রাথমিক বিশ্লেষণ:</b> {q.aiAnalysis}
              </p>
            )}
            {q.missingInfo && (
              <p className="mt-1 text-[11px] text-black/45">কী পাওয়া যায়নি: {q.missingInfo}</p>
            )}

            {q.answer ? (
              <div className="mt-3 rounded-xl bg-emerald-50 p-3">
                <p className="text-[11px] font-semibold text-emerald-800">প্রকাশিত উত্তর</p>
                <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-black/75">{q.answer}</p>
                <p className="mt-1 text-[10px] text-black/45">{q.answeredBy}</p>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <textarea
                  value={draft[q.id] ?? ''}
                  onChange={(e) => setDraft({ ...draft, [q.id]: e.target.value })}
                  rows={3}
                  className="field resize-none"
                  placeholder="নির্ভরযোগ্য উৎস খুঁজে উত্তর লিখুন…"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => patch(q.id, { answer: draft[q.id] || '', status: 'answered' })}
                    className="btn-primary px-3 py-1.5 text-xs"
                    disabled={busy === q.id || !(draft[q.id] || '').trim()}
                  >
                    {busy === q.id ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} উত্তর প্রকাশ
                  </button>
                  <button
                    onClick={() => patch(q.id, { status: 'admin_review' })}
                    className="btn-soft px-3 py-1.5 text-xs"
                  >
                    পর্যালোচনায় নিন
                  </button>
                  <button
                    onClick={() => patch(q.id, { status: 'need_info' })}
                    className="btn-soft px-3 py-1.5 text-xs"
                  >
                    অতিরিক্ত তথ্য চাই
                  </button>
                  <button
                    onClick={() => patch(q.id, { status: 'resolved' })}
                    className="ml-auto rounded-full p-1.5 text-black/40 hover:bg-emerald-50 hover:text-emerald-700"
                    title="সমাধান সম্পন্ন"
                  >
                    <CheckCircle2 size={15} />
                  </button>
                  <button
                    onClick={() => patch(q.id, { status: 'resolved' })}
                    className="rounded-full p-1.5 text-black/40 hover:bg-red-50 hover:text-red-600"
                    title="সরিয়ে দিন"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <label className="flex items-center gap-2 text-[11px] text-black/55">
                  <input
                    type="checkbox"
                    defaultChecked={q.suggestToKnowledgeBase}
                    onChange={(e) => patch(q.id, { suggestToKnowledgeBase: e.target.checked })}
                  />
                  এই উত্তর জ্ঞানভান্ডারে যুক্ত করার জন্য সুপারিশ করুন
                </label>
              </div>
            )}
          </div>
        ))}
        {!items.length && (
          <div className="card p-8 text-center text-sm text-black/50">কোনো প্রশ্ন জমা পড়েনি।</div>
        )}
      </div>
    </div>
  )
}
