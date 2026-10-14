'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { UploadCloud, X, Loader2, CheckCircle2, Video, ImageIcon, FileText, Film } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/lib/categories'

type SpeciesOption = { slug: string; nameBn: string; category: string; type: string }

export default function ShareForm({
  speciesOptions,
  defaultSpecies = '',
  defaultCategory = '',
  userName = '',
  loggedIn = false,
  defaultKind = 'photo',
}: {
  speciesOptions: SpeciesOption[]
  defaultSpecies?: string
  defaultCategory?: string
  userName?: string
  loggedIn?: boolean
  defaultKind?: 'photo' | 'video' | 'reel' | 'note'
}) {
  const router = useRouter()
  const [kind, setKind] = useState<'photo' | 'video' | 'reel' | 'note'>(defaultKind)
  const [category, setCategory] = useState(defaultCategory || 'prani')
  const [speciesSlug, setSpeciesSlug] = useState(defaultSpecies)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState('')
  const [needsIdentification, setNeedsIdentification] = useState(false)
  const [pending, setPending] = useState(false)
  const [name, setName] = useState(userName)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState<{ url: string; mediaType: 'image' | 'video'; storage: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (defaultSpecies) {
      const s = speciesOptions.find((x) => x.slug === defaultSpecies)
      if (s) setCategory(s.type === 'udbhid' ? 'udbhid' : 'prani')
    }
  }, [defaultSpecies, speciesOptions])

  function pick(f: File | null) {
    setError('')
    if (!f) return
    if (f.size > 25 * 1024 * 1024) {
      setError('ফাইলটি ২৫ মেগাবাইটের বেশি বড় — ছোট করে আবার চেষ্টা করুন।')
      return
    }
    setKind(f.type.startsWith('video') ? 'video' : 'photo')
    setFile(f)
    setUploaded(null)
    setPreview(URL.createObjectURL(f))
  }

  async function upload(): Promise<string | null> {
    if (!file) return null
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'আপলোড ব্যর্থ')
    setUploaded({ url: data.url, mediaType: data.mediaType, storage: data.storage })
    return data.url
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!loggedIn && name.trim().length < 2) {
      setError('আপনার নাম দিন (অ্যাকাউন্ট না থাকলেও নাম দিয়েই শেয়ার করা যায়)')
      return
    }
    if (kind !== 'note' && !file && !uploaded) {
      setError('একটি ছবি বা ভিডিও নির্বাচন করুন')
      return
    }
    if (kind === 'reel' && uploaded?.mediaType !== 'video' && file && !file.type.startsWith('video/')) {
      setError('রিলস হিসেবে শুধু ভিডিও প্রকাশ করা যায়')
      return
    }
    if (body.trim().length > 4000) {
      setError('লেখাটি অনেক বড়')
      return
    }
    setBusy(true)
    try {
      const mediaUrl = uploaded?.url || (await upload())
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind:
            kind === 'reel'
              ? 'reel'
              : uploaded?.mediaType === 'video' || kind === 'video'
                ? 'video'
                : kind === 'note'
                  ? 'note'
                  : 'photo',
          group: category,
          needsIdentification,
          title,
          body,
          mediaUrl: mediaUrl || '',
          mediaType: uploaded?.mediaType || (kind === 'video' || kind === 'reel' ? 'video' : 'image'),
          location,
          speciesSlug,
          tags: tags.split(/[,#،\s]+/).map((t) => t.trim()).filter(Boolean).slice(0, 10),
          authorName: loggedIn ? 'লগইনকৃত' : name.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'জমা দেওয়া যায়নি')
      if (data.pending) {
        setPending(true)
        setBusy(false)
        return
      }
      setDone(true)
      setTimeout(() => router.push(`/post/${data.post.id}`), 900)
    } catch (e: any) {
      setError(e?.message || 'কিছু একটা সমস্যা হয়েছে')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="card grid place-items-center gap-3 p-10 text-center">
        <CheckCircle2 size={44} className="text-forest-600" />
        <h2 className="text-lg font-bold text-forest-900">ধন্যবাদ! আপনার শেয়ারটি প্রকাশিত হয়েছে</h2>
        <p className="text-sm text-black/55">আপনাকে পোস্ট পাতায় নিয়ে যাওয়া হচ্ছে…</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="card p-5">
      {/* Kind */}
      <div className="mb-4 flex gap-2">
        {(
          [
            { id: 'photo', label: 'ছবি', icon: ImageIcon },
            { id: 'video', label: 'ভিডিও', icon: Video },
            { id: 'reel', label: 'রিলস', icon: Film },
            { id: 'note', label: 'লেখা', icon: FileText },
          ] as const
        ).map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setKind(k.id)}
            className={cn(
              'btn flex-1 text-sm',
              kind === k.id ? 'bg-forest-700 text-white' : 'border border-black/10 bg-white text-black/60 hover:bg-forest-50',
            )}
          >
            <k.icon size={15} /> {k.label}
          </button>
        ))}
      </div>

      {/* Upload */}
      {kind !== 'note' && (
        <div className="mb-4">
          {!preview ? (
            <label className="grid cursor-pointer place-items-center gap-2 rounded-2xl border-2 border-dashed border-forest-200 bg-forest-50/40 p-8 text-center transition hover:bg-forest-50">
              <UploadCloud size={30} className="text-forest-600" />
              <span className="text-sm font-medium text-forest-900">ছবি বা ভিডিও নির্বাচন করুন</span>
              <span className="text-[11px] text-black/45">JPG, PNG, WEBP, MP4 — সর্বোচ্চ ২৫ মেগাবাইট</span>
              <input
                type="file"
                accept={kind === 'video' || kind === 'reel' ? 'video/*' : 'image/*,video/*'}
                className="hidden"
                onChange={(e) => pick(e.target.files?.[0] || null)}
              />
            </label>
          ) : (
            <div className="relative overflow-hidden rounded-2xl bg-black">
              {kind === 'video' || kind === 'reel' ? (
                <video src={preview} controls className="max-h-80 w-full" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="প্রিভিউ" className="max-h-80 w-full object-contain" />
              )}
              <button
                type="button"
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                  setUploaded(null)
                }}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
                aria-label="সরিয়ে দিন"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Name */}
      {!loggedIn && (
        <div className="mb-4">
          <label className="label">আপনার নাম *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="যেমন: রাহাত হোসেন" maxLength={60} />
          <p className="mt-1 text-[11px] text-black/40">
            অ্যাকাউন্ট ছাড়াই শেয়ার করা যায়। চাইলে{' '}
            <a href="/register" className="text-forest-700 hover:underline">
              অ্যাকাউন্ট খুলে
            </a>{' '}
            সব শেয়ার এক জায়গায় রাখুন ও ফলো পান।
          </p>
        </div>
      )}

      {/* Title + body */}
      <div className="mb-4">
        <label className="label">শিরোনাম</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="field" placeholder="যেমন: সকালের কুয়াশায় বাগানের দোয়েল" maxLength={140} />
      </div>
      <div className="mb-4">
        <label className="label">বিবরণ / আপনার মতামত</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="field resize-none"
          placeholder="কোথায়, কখন, কীভাবে তুললেন — আর এই প্রাণী বা গাছ নিয়ে আপনার মনে কী ভাব জাগল…"
        />
      </div>

      {/* Category + species */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">ক্যাটাগরি</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="field">
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">প্রজাতি (ঐচ্ছিক)</label>
          <select value={speciesSlug} onChange={(e) => setSpeciesSlug(e.target.value)} className="field">
            <option value="">— নির্বাচন করুন —</option>
            {speciesOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.nameBn} ({s.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-[13px] text-amber-900">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={needsIdentification}
          onChange={(e) => setNeedsIdentification(e.target.checked)}
        />
        <span>
          <b>পরিচয় জানতে চাই</b> — এটি কোন প্রজাতি তা নিশ্চিত নই। সম্প্রদায় প্রস্তাব দিতে পারবে; কোনো প্রস্তাবই
          স্বয়ংক্রিয়ভাবে যাচাইকৃত হবে না, সম্পাদক/বিশেষজ্ঞ পর্যালোচনার পরেই “যাচাইকৃত” দেখাবে।
        </span>
      </label>

      {/* Location + tags */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">স্থান</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="field" placeholder="যেমন: সুন্দরবন, খুলনা" maxLength={120} />
        </div>
        <div>
          <label className="label">ট্যাগ (কমা দিয়ে আলাদা করুন)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="field" placeholder="দোয়েল, বাগান, সকাল" maxLength={200} />
        </div>
      </div>

      {error && <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {pending && (
        <p className="mb-3 rounded-xl bg-forest-50 px-3 py-2 text-sm text-forest-800">
          ধন্যবাদ! অ্যাকাউন্টবিহীন পোস্ট পর্যালোচনার পর প্রকাশ করা হয় — অ্যাডমিন প্যানেল থেকে অনুমোদনের পর এটি ফিডে
          দেখা যাবে।
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-primary w-full py-3">
        {busy ? <Loader2 size={17} className="animate-spin" /> : <UploadCloud size={17} />}
        {busy ? 'আপলোড হচ্ছে…' : 'প্রকাশ করুন'}
      </button>

      <p className="mt-3 text-center text-[11px] text-black/40">
        শেয়ার করার মানে আপনি সম্মত হচ্ছেন যে ছবিটি আপনার নিজের তোলা অথবা শেয়ার করার অনুমতি আপনার আছে এবং সেটি
        বাংলাদেশের প্রকৃতি-সম্পর্কিত।
      </p>
    </form>
  )
}
