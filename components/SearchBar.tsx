'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { getRepo } from '@/lib/repo'

type Hit = { title: string; href: string; type: string }

export default function SearchBar({ placeholder = 'দোয়েল, বাংলার বাঘ, শাপলা — যেকোনো কিছু খুঁজুন…' }: { placeholder?: string }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<Hit[]>([])
  const [open, setOpen] = useState(false)

  async function onChange(value: string) {
    setQ(value)
    if (value.trim().length < 2) {
      setHits([])
      setOpen(false)
      return
    }
    try {
      const res = await fetch(`/api/suggest?q=${encodeURIComponent(value.trim())}`)
      const data = (await res.json()) as { hits: Hit[] }
      setHits(data.hits || [])
      setOpen(true)
    } catch {
      setHits([])
    }
  }

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!q.trim()) return
          setOpen(false)
          router.push(`/search?q=${encodeURIComponent(q.trim())}`)
        }}
        className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-lg"
      >
        <Search size={18} className="ml-2 shrink-0 text-black/40" />
        <input
          value={q}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => hits.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-black/35"
        />
        <button type="submit" className="btn-primary shrink-0 px-4 py-2 text-sm">
          খুঁজুন
        </button>
      </form>

      {open && hits.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
          {hits.map((h) => (
            <button
              key={h.href + h.title}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setOpen(false)
                router.push(h.href)
              }}
              className="flex w-full items-center gap-2 border-b border-black/5 px-4 py-2.5 text-left last:border-0 hover:bg-forest-50"
            >
              <Sparkles size={13} className="shrink-0 text-forest-500" />
              <span className="min-w-0 flex-1 truncate text-sm text-forest-900">{h.title}</span>
              <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[10px] text-black/50">{h.type}</span>
            </button>
          ))}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setOpen(false)
              router.push(`/search?q=${encodeURIComponent(q.trim())}`)
            }}
            className="w-full bg-forest-50 px-4 py-2.5 text-left text-xs font-medium text-forest-800"
          >
            সব ফলাফল দেখুন →
          </button>
        </div>
      )}
    </div>
  )
}
