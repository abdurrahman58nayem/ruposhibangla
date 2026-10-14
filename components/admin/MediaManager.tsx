'use client'

import { useState } from 'react'
import { UploadCloud, Loader2, Copy, Check } from 'lucide-react'

export default function MediaManager({ storage }: { storage: 'r2' | 'local' }) {
  const [files, setFiles] = useState<File[]>([])
  const [uploaded, setUploaded] = useState<{ url: string; key: string; storage: string }[]>([])
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState('')

  async function upload() {
    if (!files.length) return
    setBusy(true)
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.ok) setUploaded((prev) => [{ url: data.url, key: data.key, storage: data.storage }, ...prev])
      }
      setFiles([])
    } finally {
      setBusy(false)
    }
  }

  function copy(url: string) {
    navigator.clipboard?.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-forest-900">মিডিয়া লাইব্রেরি</h2>
        <p className="text-xs text-black/50">
          বর্তমান স্টোরেজ: <b>{storage === 'r2' ? 'Cloudflare R2' : 'লোকাল (public/uploads)'}</b> — এখান থেকে আপলোড করা
          ছবি সরাসরি প্রজাতি বা খবরে ব্যবহার করা যাবে।
        </p>
      </div>

      <div className="card p-5">
        <label className="grid cursor-pointer place-items-center gap-2 rounded-2xl border-2 border-dashed border-forest-200 bg-forest-50/40 p-8 text-center transition hover:bg-forest-50">
          <UploadCloud size={28} className="text-forest-600" />
          <span className="text-sm font-medium text-forest-900">এক বা একাধিক ফাইল নির্বাচন করুন</span>
          <span className="text-[11px] text-black/45">ছবি বা ভিডিও — সর্বোচ্চ ২৫ মেগাবাইট</span>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
        </label>
        {files.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-black/60">{files.length} টি ফাইল নির্বাচিত</span>
            <button onClick={upload} className="btn-primary text-sm" disabled={busy}>
              {busy ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />} আপলোড করুন
            </button>
          </div>
        )}
      </div>

      {uploaded.length > 0 && (
        <div className="card p-4">
          <h3 className="mb-3 text-sm font-bold text-forest-900">সদ্য আপলোড</h3>
          <div className="space-y-2">
            {uploaded.map((u) => (
              <div key={u.url} className="flex items-center gap-3 rounded-xl bg-forest-50/60 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.url} alt="" className="h-12 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] text-black/60">{u.key}</p>
                  <p className="truncate text-[11px] text-black/40">{u.storage}</p>
                </div>
                <button onClick={() => copy(u.url)} className="btn-soft px-2.5 py-1 text-[11px]">
                  {copied === u.url ? <Check size={12} /> : <Copy size={12} />} কপি
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
