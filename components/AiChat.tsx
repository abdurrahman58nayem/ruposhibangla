'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Send, SendHorizontal, ImagePlus, Sparkles, Loader2, X, Info } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'
import { cn } from '@/lib/utils'

type Msg = {
  id: string
  role: 'ai' | 'user'
  text: string
  image?: string
  sources?: { title: string; href: string; type: string }[]
  matches?: { slug: string; name: string; scientificName: string; image: string; href: string; score: number }[]
  mode?: 'llm' | 'local'
  /** এআই নিশ্চিত নয় — বিশেষজ্ঞের কাছে পাঠানোর প্রস্তাব */
  lowConfidence?: boolean
  question?: string
  escalated?: string
}

const SUGGESTIONS = [
  'দোয়েল সম্পর্কে সব কিছু বলুন',
  'সুন্দরবনে কী কী প্রাণী আছে?',
  'বাংলাদেশের বিপন্ন প্রজাতি কোনগুলো?',
  'কবির চোখে কোকিল কেমন?',
  'গ্রামবাংলার গাছপালা কী কী?',
  'ইলিশ কেন নদীতে ওঠে?',
]

/** ছবি থেকে প্রধান রং বের করা (ক্যানভাস দিয়ে — সার্ভারে পাঠানোর জন্য) */
function extractPalette(file: File): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 40
        canvas.height = 40
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve([])
        ctx.drawImage(img, 0, 0, 40, 40)
        const data = ctx.getImageData(0, 0, 40, 40).data
        const buckets = new Map<string, { r: number; g: number; b: number; n: number }>()
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2]
          const key = `${r >> 5}-${g >> 5}-${b >> 5}`
          const cur = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0 }
          cur.r += r; cur.g += g; cur.b += b; cur.n += 1
          buckets.set(key, cur)
        }
        const colors = [...buckets.values()]
          .sort((a, b) => b.n - a.n)
          .slice(0, 5)
          .map((c) => {
            const r = Math.round(c.r / c.n), g = Math.round(c.g / c.n), b = Math.round(c.b / c.n)
            return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
          })
        resolve(colors)
      } catch {
        resolve([])
      } finally {
        URL.revokeObjectURL(url)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve([])
    }
    img.src = url
  })
}

export default function AiChat({ settings }: { settings: SiteSettings }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'm0',
      role: 'ai',
      text: `${settings.aiIntro}\n\nযেমন জিজ্ঞেস করতে পারেন: “দোয়েল কোথায় দেখা যায়?”, “বাঘ কেন বিপন্ন?”, “কবির চোখে কোকিল” — অথবা কোনো ছবি দিন, আমি চেষ্টা করব চিনতে।`,
    },
  ])
  const [input, setInput] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [palette, setPalette] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  async function pickImage(file: File | null) {
    if (!file) return
    setImage(file)
    setImageUrl(URL.createObjectURL(file))
    setPalette(await extractPalette(file))
  }

  function clearImage() {
    setImage(null)
    setImageUrl(null)
    setPalette([])
    if (fileRef.current) fileRef.current.value = ''
  }

  async function send(text?: string) {
    const message = (text ?? input).trim()
    if ((!message && !image) || busy) return
    const userMsg: Msg = { id: `u-${Date.now()}`, role: 'user', text: message || 'এই ছবিটি দেখুন', image: imageUrl || undefined }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setBusy(true)

    // ছবি থাকলে আগে আপলোড (R2/লোকাল) — পরে রঙের তথ্য দিয়ে প্রশ্ন পাঠানো হবে
    if (image && !String(imageUrl).startsWith('http')) {
      try {
        const fd = new FormData()
        fd.append('file', image)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data?.url) {
          setMessages((m) => m.map((x) => (x.id === userMsg.id ? { ...x, image: data.url } : x)))
        }
      } catch {
        /* ignore */
      }
    }

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message, palette }),
      })
      const data = await res.json()
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: 'ai',
          text: data.answer || 'দুঃখিত, উত্তর তৈরি করতে পারিনি।',
          sources: data.sources,
          matches: data.imageMatches,
          mode: data.mode,
          lowConfidence: !!data.lowConfidence,
          question: message || (image ? 'এই ছবির প্রাণী বা উদ্ভিদটি চিনতে পারছি না' : ''),
        },
      ])
      clearImage()
    } catch {
      setMessages((m) => [...m, { id: `a-err-${Date.now()}`, role: 'ai', text: 'সংযোগে সমস্যা হয়েছে, একটু পরে চেষ্টা করুন।' }])
    } finally {
      setBusy(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  async function escalate(msgId: string, question: string, image?: string) {
    try {
      const res = await fetch('/api/ai/questions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          question: question || 'প্রশ্ন পাঠানো হয়েছে',
          imageUrl: image || '',
          aiAnalysis: 'এআই এই প্রশ্নের নির্ভরযোগ্য উত্তর খুঁজে পায়নি — বিশেষজ্ঞ পর্যালোচনা প্রয়োজন।',
          missingInfo: 'তথ্যভাণ্ডারে যথেষ্ট প্রসঙ্গ পাওয়া যায়নি',
        }),
      })
      const data = await res.json()
      if (data?.trackCode) {
        setMessages((m) => m.map((x) => (x.id === msgId ? { ...x, escalated: data.trackCode } : x)))
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="max-h-[62vh] space-y-4 overflow-y-auto p-4 sm:p-6">
        {messages.map((m) => (
          <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[88%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed',
                m.role === 'user' ? 'bg-forest-700 text-white' : 'bg-forest-50 text-black/80',
              )}
            >
              {m.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.image} alt="আপলোড" className="mb-2 max-h-56 w-full rounded-xl object-cover" />
              )}
              <p className="whitespace-pre-wrap">{m.text}</p>

              {!!m.matches?.length && (
                <div className="mt-3 space-y-2">
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-forest-700">
                    <Info size={12} /> ছবির রঙের সাথে মিলে যাওয়া সম্ভাব্য প্রজাতি
                  </p>
                  {m.matches.map((mm) => (
                    <Link
                      key={mm.slug}
                      href={mm.href}
                      className="flex items-center gap-2 rounded-xl bg-white p-2 text-black/80 transition hover:bg-white/80"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mm.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold">{mm.name}</span>
                        <span className="block truncate text-[11px] italic text-black/50">{mm.scientificName}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {!!m.sources?.length && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.sources.map((s, i) => (
                    <Link
                      key={i}
                      href={s.href}
                      className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-forest-800 hover:bg-white"
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              )}

              {m.mode === 'local' && m.role === 'ai' && (
                <p className="mt-2 text-[10px] text-black/40">— সাইটের নিজস্ব তথ্যভাণ্ডার থেকে (অফলাইন মোড)</p>
              )}

              {/* এআই অনিশ্চিত — বিশেষজ্ঞের কাছে পাঠানোর পথ */}
              {m.role === 'ai' && m.lowConfidence && (
                <div className="mt-3 rounded-xl border border-earth-200 bg-earth-50/70 p-3">
                  <p className="text-[11px] leading-relaxed text-earth-900">
                    এই প্রশ্নের নির্ভরযোগ্য উত্তর দিতে আরও যাচাই প্রয়োজন। চাইলে প্রশ্নটি রূপসী বাংলার
                    বিশেষজ্ঞ/অ্যাডমিন টিমের কাছে পাঠান।
                  </p>
                  {m.escalated ? (
                    <Link
                      href={`/ai/q/${m.escalated}`}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-forest-700 px-3 py-1.5 text-[11px] font-semibold text-white"
                    >
                      <SendHorizontal size={12} /> উত্তর ট্র্যাক করুন
                    </Link>
                  ) : (
                    <button
                      onClick={() => escalate(m.id, m.question || '', m.image)}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-earth-500 px-3 py-1.5 text-[11px] font-semibold text-white"
                    >
                      <SendHorizontal size={12} /> বিশেষজ্ঞের কাছে পাঠান
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-forest-50 px-4 py-3 text-sm text-forest-800">
              <Loader2 size={15} className="animate-spin" /> ভাবছি…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-black/5 bg-white p-3">
        {imageUrl && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-forest-50 p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
            <span className="max-w-[160px] truncate text-[11px] text-black/60">{image?.name}</span>
            <div className="flex gap-0.5">
              {palette.slice(0, 4).map((c) => (
                <span key={c} className="h-4 w-4 rounded-full border border-white" style={{ background: c }} />
              ))}
            </div>
            <button onClick={clearImage} className="rounded-full p-1 hover:bg-black/5" aria-label="সরিয়ে দিন">
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pickImage(e.target.files?.[0] || null)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/10 text-forest-700 transition hover:bg-forest-50"
            aria-label="ছবি যোগ করুন"
          >
            <ImagePlus size={19} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void send()
              }
            }}
            rows={1}
            placeholder="প্রকৃতি নিয়ে যেকোনো প্রশ্ন করুন…"
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
          />
          <button
            onClick={() => void send()}
            disabled={busy || (!input.trim() && !image)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest-700 text-white transition hover:bg-forest-800 disabled:opacity-40"
            aria-label="পাঠান"
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>

        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => void send(s)}
              className="whitespace-nowrap rounded-full border border-forest-100 bg-white px-3 py-1 text-[11px] text-forest-800 transition hover:bg-forest-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
