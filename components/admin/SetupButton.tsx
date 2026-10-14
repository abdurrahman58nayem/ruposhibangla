'use client'

import { useState } from 'react'
import { Loader2, DatabaseZap } from 'lucide-react'

export default function SetupButton() {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function run(mode: 'schema' | 'seed') {
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch(`/api/admin/setup?mode=${mode}`, { method: 'POST' })
      const data = await res.json()
      setMsg(data.ok ? data.message : data.error || 'ব্যর্থ')
    } catch {
      setMsg('সংযোগ ব্যর্থ')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-3">
      <div className="flex gap-2">
        <button onClick={() => run('schema')} disabled={busy} className="btn-outline px-3 py-1.5 text-[11px]">
          {busy ? <Loader2 size={13} className="animate-spin" /> : <DatabaseZap size={13} />} টেবিল তৈরি
        </button>
        <button onClick={() => run('seed')} disabled={busy} className="btn-outline px-3 py-1.5 text-[11px]">
          প্রজাতির তথ্য বসান
        </button>
      </div>
      {msg && <p className="mt-2 text-[11px] text-black/55">{msg}</p>}
    </div>
  )
}
