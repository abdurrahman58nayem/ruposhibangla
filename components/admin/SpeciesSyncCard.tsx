'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react'
import { toBn } from '@/lib/utils'

type SyncInfo = {
  seedCount: number
  before: number
  after: number
  missing: number
  added: number
}

/**
 * জ্ঞানভান্ডার সিঙ্ক — সিড (কোড) বনাম ডেটাবেজের পার্থক্য দেখায় ও
 * এক ক্লিকে অনুপস্থিত রেকর্ডগুলো যোগ করে। কোনো কিছু মুছে ফেলা হয় না।
 */
export default function SpeciesSyncCard({ info }: { info: SyncInfo }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [state, setState] = useState(info)

  async function sync() {
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/setup?mode=sync', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || data.error) {
        setMsg(data.error || 'সিঙ্ক ব্যর্থ')
      } else {
        setMsg(data.message || 'সিঙ্ক সম্পন্ন')
        setState({
          seedCount: data.seedCount ?? state.seedCount,
          before: data.before ?? state.before,
          after: data.after ?? state.after,
          missing: data.missing ?? 0,
          added: data.added ?? 0,
        })
        router.refresh()
      }
    } catch {
      setMsg('সংযোগ ব্যর্থ')
    } finally {
      setBusy(false)
    }
  }

  const gap = state.missing

  return (
    <div className="card p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/45">
        {gap > 0 ? (
          <AlertTriangle size={14} className="text-amber-500" />
        ) : (
          <CheckCircle2 size={14} className="text-emerald-600" />
        )}
        জ্ঞানভান্ডার সিঙ্ক
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-black/[0.03] p-2">
          <p className="text-lg font-bold text-forest-900">{toBn(state.seedCount)}</p>
          <p className="text-[10px] text-black/45">কোডে (সিড)</p>
        </div>
        <div className="rounded-xl bg-black/[0.03] p-2">
          <p className="text-lg font-bold text-forest-900">{toBn(state.before)}</p>
          <p className="text-[10px] text-black/45">ডেটাবেজে</p>
        </div>
        <div
          className={`rounded-xl p-2 ${gap > 0 ? 'bg-amber-50' : 'bg-emerald-50'}`}
        >
          <p className={`text-lg font-bold ${gap > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {toBn(gap)}
          </p>
          <p className="text-[10px] text-black/45">অনুপস্থিত</p>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-black/55">
        {gap > 0
          ? `${toBn(gap)}টি রেকর্ড কোডে আছে কিন্তু ডেটাবেজে ঢোকেনি — তাই সাইটে দেখা যাচ্ছে না। "এখনই সিঙ্ক" চাপলে কেবল এই রেকর্ডগুলো যোগ হবে; বিদ্যমান তথ্য, ইউজারের পোস্ট ও অ্যাকাউন্ট অক্ষত থাকবে।`
          : 'সিড ও ডেটাবেজ মিলে আছে — কোডের সব রেকর্ড সাইটে দেখা যাচ্ছে।'}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={sync}
          disabled={busy || gap === 0}
          className="btn-primary px-3 py-1.5 text-[11px] disabled:opacity-50"
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
          {gap > 0 ? 'এখনই সিঙ্ক করুন' : 'সিঙ্কড'}
        </button>
        {msg && <span className="text-[11px] text-black/60">{msg}</span>}
      </div>
    </div>
  )
}
