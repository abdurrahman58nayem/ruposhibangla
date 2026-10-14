'use client'

import { useState } from 'react'
import { UploadCloud, Loader2 } from 'lucide-react'

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
          <input type="file" accept={accept} className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        </label>
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-2 h-24 w-auto rounded-lg border border-black/10 object-cover" />
      )}
      {err && <p className="mt-1 text-[11px] text-red-600">{err}</p>}
    </div>
  )
}
