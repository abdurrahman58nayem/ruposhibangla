'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2, Plus, Star, Trash2, UploadCloud } from 'lucide-react'
import { toBn } from '@/lib/utils'

const MAX_GALLERY = 12

/**
 * প্রজাতির গ্যালারি সম্পাদক — একাধিক ছবি যোগ/সরানো/ক্রম বদলানো/প্রধান করা।
 * ছবি আপলোড (একসাথে একাধিক ফাইল) অথবা URL দিয়েও যোগ করা যায়।
 * প্রজাতির পাতায় প্রধান ছবির পরে এই ক্রমেই ছবিগুলো দেখায়।
 */
export default function GalleryField({
  gallery,
  mainImage,
  onChange,
  onSetMain,
}: {
  gallery: string[]
  mainImage: string
  onChange: (next: string[]) => void
  onSetMain: (url: string) => void
}) {
  const [urlText, setUrlText] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [err, setErr] = useState('')

  const addUrls = (urls: string[]) => {
    const clean = urls.map((u) => u.trim()).filter(Boolean)
    if (!clean.length) return
    const seen = new Set([mainImage, ...gallery].filter(Boolean))
    const fresh = clean.filter((u) => !seen.has(u))
    if (!fresh.length) {
      setErr('এই ছবি আগেই আছে (প্রধান ছবি বা গ্যালারিতে)।')
      return
    }
    const next = [...gallery, ...fresh].slice(0, MAX_GALLERY)
    if (next.length < gallery.length + fresh.length) {
      setErr(`গ্যালারিতে সর্বোচ্চ ${toBn(MAX_GALLERY)}টি ছবি রাখা যায় — বাকিগুলো যোগ হয়নি।`)
    } else {
      setErr('')
    }
    onChange(next)
  }

  const addFromInput = () => {
    // একাধিক URL একসাথে পেস্ট করলেও চলবে (লাইন/স্পেস/কমা দিয়ে আলাদা)
    addUrls(urlText.split(/[\s,]+/))
    setUrlText('')
  }

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return
    const list = Array.from(files)
    setBusy(true)
    setErr('')
    const done: string[] = []
    try {
      for (let i = 0; i < list.length; i++) {
        setProgress(`আপলোড হচ্ছে ${toBn(i + 1)}/${toBn(list.length)}…`)
        const fd = new FormData()
        fd.append('file', list[i])
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'আপলোড ব্যর্থ')
        if (data.mediaType && data.mediaType !== 'image') throw new Error('শুধু ছবি আপলোড করা যাবে')
        done.push(data.url)
      }
      addUrls(done)
    } catch (e: any) {
      setErr(e.message)
      if (done.length) addUrls(done)
    } finally {
      setBusy(false)
      setProgress('')
    }
  }

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= gallery.length) return
    const next = [...gallery]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  const remove = (i: number) => onChange(gallery.filter((_, idx) => idx !== i))

  return (
    <div className="mt-4">
      <label className="label">
        গ্যালারির ছবি {gallery.length > 0 && <span className="font-normal text-black/45">({toBn(gallery.length)}টি)</span>}
      </label>
      <p className="mb-2 text-[11px] leading-relaxed text-black/45">
        প্রজাতিটি ভালোভাবে চেনার জন্য একাধিক ছবি দিন — যেমন পুরো শরীর, মুখ/ফুলের কাছের দৃশ্য, পাতা/বাসস্থান।
        ছবিগুলো প্রজাতির পাতায় প্রধান ছবির পরে এই ক্রমে দেখাবে (সর্বোচ্চ {toBn(MAX_GALLERY)}টি)।
      </p>

      {gallery.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {gallery.map((url, i) => (
            <div key={`${url}-${i}`} className="overflow-hidden rounded-xl border border-black/10 bg-white">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`গ্যালারির ছবি ${toBn(i + 1)}`} className="aspect-[4/3] w-full bg-stone-100 object-cover" loading="lazy" />
                <span className="absolute left-1.5 top-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">{toBn(i + 1)}</span>
              </div>
              <p className="truncate px-2 pt-1.5 text-[10px] text-black/45" title={url}>{url}</p>
              <div className="flex items-center gap-1 p-1.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="আগে নিন" title="আগে নিন" className="rounded-full border border-black/10 p-1.5 text-black/60 transition hover:bg-forest-50 disabled:opacity-30">
                  <ChevronLeft size={13} />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === gallery.length - 1} aria-label="পরে নিন" title="পরে নিন" className="rounded-full border border-black/10 p-1.5 text-black/60 transition hover:bg-forest-50 disabled:opacity-30">
                  <ChevronRight size={13} />
                </button>
                <button type="button" onClick={() => onSetMain(url)} className="ml-auto inline-flex items-center gap-1 rounded-full border border-black/10 px-2 py-1 text-[10px] font-semibold text-forest-800 transition hover:bg-forest-50">
                  <Star size={11} /> প্রধান করুন
                </button>
                <button type="button" onClick={() => remove(i)} aria-label="ছবি মুছুন" title="ছবি মুছুন" className="rounded-full border border-black/10 p-1.5 text-black/60 transition hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-earth-50/60 px-3 py-2 text-xs text-black/50">গ্যালারিতে এখনো কোনো অতিরিক্ত ছবি নেই — শুধু প্রধান ছবিটিই দেখাবে।</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          value={urlText}
          onChange={(e) => setUrlText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFromInput() } }}
          placeholder="ছবির URL দিন (একাধিক হলে স্পেস দিয়ে)…"
          className="field min-w-56 flex-1"
        />
        <button type="button" onClick={addFromInput} className="btn-outline shrink-0 text-xs">
          <Plus size={13} /> যোগ করুন
        </button>
        <label className="btn-outline shrink-0 cursor-pointer text-xs">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />} একাধিক ছবি আপলোড
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = e.currentTarget.files
              e.currentTarget.value = ''
              void uploadFiles(files)
            }}
          />
        </label>
      </div>
      {progress && <p className="mt-1 text-[11px] text-forest-700">{progress}</p>}
      {err && <p className="mt-1 text-[11px] text-red-600">{err}</p>}
    </div>
  )
}
