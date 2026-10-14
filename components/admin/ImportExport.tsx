'use client'

import { useState } from 'react'
import { Download, Upload, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

type Result = {
  total: number
  created: number
  updated: number
  duplicates: { row: number; name: string; slug: string; reason: string }[]
  skipped: { row: number; reason: string }[]
}

export default function ImportExport() {
  const [busy, setBusy] = useState<'import' | null>(null)
  const [updateExisting, setUpdateExisting] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  async function doImport(file: File) {
    setBusy('import')
    setError('')
    setResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`/api/admin/species/import?update=${updateExisting ? '1' : '0'}`, {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'আমদানি করা যায়নি')
      setResult(data)
    } catch (e: any) {
      setError(e?.message || 'আমদানি ব্যর্থ হয়েছে')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="card mb-4 p-4">
      <h3 className="mb-1 text-sm font-bold text-forest-900">CSV / JSON আমদানি ও রপ্তানি</h3>
      <p className="mb-3 text-[11px] leading-relaxed text-black/50">
        রপ্তানি করে বাইরে সম্পাদনা করে আবার আমদানি করা যায়। আমদানিতে ডুপ্লিকেট (একই স্লাগ/বাংলা নাম/বৈজ্ঞানিক নাম) ধরা
        পড়লে তা <b>এড়িয়ে যাওয়া হয়</b> এবং নিচে তালিকা দেখানো হয় — “হালনাগাদের অনুমতি” টিক দিলে বিদ্যমান রেকর্ড আপডেট হবে।
        আমদানিকৃত কোনো রেকর্ডই স্বয়ংক্রিয়ভাবে <b>যাচাইকৃত</b> হয় না।
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <a href="/api/admin/species/export?format=csv" className="btn-outline text-xs">
          <Download size={14} /> CSV রপ্তানি
        </a>
        <a href="/api/admin/species/export?format=json" className="btn-outline text-xs">
          <Download size={14} /> JSON রপ্তানি
        </a>

        <label className="btn-outline cursor-pointer text-xs">
          {busy === 'import' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {busy === 'import' ? 'আমদানি হচ্ছে…' : 'CSV / JSON আমদানি'}
          <input
            type="file"
            accept=".csv,.json,text/csv,application/json"
            className="hidden"
            disabled={busy === 'import'}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void doImport(f)
              e.target.value = ''
            }}
          />
        </label>

        <label className="flex items-center gap-1.5 text-[11px] text-black/60">
          <input
            type="checkbox"
            checked={updateExisting}
            onChange={(e) => setUpdateExisting(e.target.checked)}
          />
          বিদ্যমান রেকর্ড হালনাগাদের অনুমতি দিন
        </label>
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-700">
          <AlertTriangle size={13} /> {error}
        </p>
      )}

      {result && (
        <div className="mt-3 rounded-xl bg-forest-50 p-3 text-[12px] text-forest-900">
          <p className="mb-1 flex items-center gap-1.5 font-semibold">
            <CheckCircle2 size={14} /> আমদানি শেষ — মোট {result.total} সারি
          </p>
          <p>
            নতুন যোগ: <b>{result.created}</b> · হালনাগাদ: <b>{result.updated}</b> · ডুপ্লিকেট:{' '}
            <b>{result.duplicates.length}</b> · বাদ: <b>{result.skipped.length}</b>
          </p>
          {!!result.duplicates.length && (
            <ul className="mt-2 max-h-40 space-y-1 overflow-auto">
              {result.duplicates.slice(0, 30).map((d, i) => (
                <li key={i} className="text-[11px] text-amber-800">
                  সারি {d.row}: {d.name} — {d.reason} (<code>{d.slug}</code>)
                </li>
              ))}
            </ul>
          )}
          {!!result.skipped.length && (
            <p className="mt-1 text-[11px] text-black/55">
              বাদ পড়া সারি: {result.skipped.slice(0, 10).map((s) => `${s.row} (${s.reason})`).join(', ')}
            </p>
          )}
          <button onClick={() => window.location.reload()} className="btn-outline mt-2 text-[11px]">
            তালিকা রিফ্রেশ করুন
          </button>
        </div>
      )}
    </div>
  )
}
