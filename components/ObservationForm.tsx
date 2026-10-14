'use client'

import { useState } from 'react'
import { Camera, Loader2, Send, MapPin } from 'lucide-react'
import { useApp } from '@/components/Providers'

/** “আমি কী দেখলাম?” — পর্যবেক্ষণ জমা; অবস্থান শেয়ার করা সম্পূর্ণ ঐচ্ছিক */
export default function ObservationForm() {
  const { t } = useApp()
  const [name, setName] = useState('')
  const [guessed, setGuessed] = useState('')
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState('')
  const [shareLocation, setShareLocation] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState('')

  function pick(f: File | null) {
    setFile(f)
    if (f) setPreview(URL.createObjectURL(f))
    else setPreview('')
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return alert('আপনার নাম দিন')
    if (!file && !notes.trim()) return alert('ছবি অথবা বিবরণ দিন')
    setBusy(true)
    try {
      let photoUrl = ''
      if (file) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.ok) photoUrl = data.url
      }
      const res = await fetch('/api/observations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          guessedName: guessed.trim(),
          notes: notes.trim(),
          photoUrl,
          location: shareLocation ? location.trim() : '',
          coarseLocation: shareLocation ? location.trim().split(',')[0] : '',
          locationShared: shareLocation,
          uncertain: true,
          observedAt: new Date().toISOString(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'জমা দেওয়া যায়নি')
      setDone('✔ পর্যবেক্ষণ জমা হয়েছে — পর্যালোচনার পর জানানো হবে।')
      setName('')
      setGuessed('')
      setNotes('')
      setLocation('')
      setShareLocation(false)
      pick(null)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-3 p-4">
      <h2 className="text-sm font-bold text-forest-900">পর্যবেক্ষণ জমা দিন</h2>

      <label className="grid cursor-pointer place-items-center gap-2 rounded-xl border-2 border-dashed border-forest-200 bg-forest-50/40 p-5 text-center transition hover:bg-forest-50">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-32 rounded-lg object-contain" />
        ) : (
          <Camera size={24} className="text-forest-600" />
        )}
        <span className="text-xs font-medium text-forest-900">
          {file ? file.name.slice(0, 40) : 'ছবি নির্বাচন করুন (ঐচ্ছিক)'}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0] || null)} />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">আপনার নাম *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="field" />
        </div>
        <div>
          <label className="label">আপনার ধারণা (ঐচ্ছিক)</label>
          <input
            value={guessed}
            onChange={(e) => setGuessed(e.target.value)}
            className="field"
            placeholder="যেমন: হলুদ পাখি"
          />
        </div>
      </div>

      <div>
        <label className="label">বিবরণ — কোথায়, কখন, কী করছিল</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="field resize-none"
          placeholder="আমাদের বাগানে সকালে ডালে বসেছিল…"
        />
      </div>

      <label className="flex items-start gap-2 rounded-xl bg-forest-50/60 p-3">
        <input
          type="checkbox"
          checked={shareLocation}
          onChange={(e) => setShareLocation(e.target.checked)}
          className="mt-1 accent-[#235d41]"
        />
        <span className="text-[11px] leading-relaxed text-forest-900">
          <MapPin size={12} className="mr-1 inline" />
          অবস্থান শেয়ার করতে চাই (সম্পূর্ণ ঐচ্ছিক)। বিপন্ন প্রজাতির ক্ষেত্রে শুধু স্থূল এলাকা সংরক্ষিত হবে।
        </span>
      </label>
      {shareLocation && (
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="field"
          placeholder="যেমন: সিলেট, জকিগঞ্জ"
        />
      )}

      <button className="btn-primary" disabled={busy}>
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} জমা দিন
      </button>
      {done && <p className="text-sm text-emerald-700">{done}</p>}
    </form>
  )
}
