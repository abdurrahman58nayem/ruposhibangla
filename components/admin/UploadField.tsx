'use client'

import { useState } from 'react'
import { UploadCloud, Loader2, X } from 'lucide-react'

export default function UploadField({
  value,
  onChange,
  label = 'ছবি',
  accept = 'image/*',
  folder = 'admin',
}: {
  value: string
  onChange: (url: string) => void
  label?: string
  accept?: string
  folder?: string
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function upload(file?: File | null) {
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'ব্যর্থ')
      onChange(data.url)
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap items-start gap-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} className="field flex-1" placeholder="/seed/prani/doyel.jpg বা https://…" />
        <label className="btn-outline shrink-0 cursor-pointer text-xs">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />} আপলোড
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0]
              e.currentTarget.value = ''
              void upload(file)
            }}
          />
        </label>
      </div>
      {value && (
        <div className="mt-2 flex items-start gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-28 w-auto max-w-full rounded-lg border border-black/10 object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="ছবি সরান"
            title="ছবি সরান"
            className="rounded-full border border-black/10 bg-white p-1.5 text-black/50 transition hover:text-red-600"
          >
            <X size={13} />
          </button>
        </div>
      )}
      {err && <p className="mt-1 text-[11px] text-red-600">{err}</p>}
    </div>
  )
}
