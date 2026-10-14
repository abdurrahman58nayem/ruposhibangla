'use client'

import { useState } from 'react'
import { Save, Loader2, ShieldCheck } from 'lucide-react'

type Me = { id: string; username: string; name: string; email: string; role: string }

export default function AccountForm({ initial }: { initial: Me }) {
  const [me, setMe] = useState(initial)
  const [name, setName] = useState(initial.name)
  const [email, setEmail] = useState(initial.email)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    setErr('')
    try {
      if (newPassword && newPassword !== confirmPassword) {
        setErr('নতুন পাসওয়ার্ড দুইবার একই নয়')
        return
      }
      const res = await fetch('/api/admin/account', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          ...(newPassword ? { currentPassword, newPassword } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok || data?.error) {
        setErr(data?.error || 'সংরক্ষণ ব্যর্থ')
        return
      }
      setMsg(data.message || 'সংরক্ষিত হয়েছে')
      if (data.user) setMe(data.user)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} className="card space-y-5 p-5">
      <div className="flex items-start gap-3 rounded-xl bg-forest-50 p-4 text-xs text-forest-900">
        <ShieldCheck size={18} className="mt-0.5 shrink-0" />
        <p>
          লগইন করতে <b>ব্যবহারনাম (@{me.username})</b> বা <b>ইমেইল</b> — যেকোনো একটি ব্যবহার করা যায়। পাসওয়ার্ড
          বদলালে পরের লগইনে নতুন পাসওয়ার্ড দিতে হবে।
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-black/70">নাম</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-black/70">ইমেইল (লগইনে ব্যবহার করা যায়)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ruposhibangla.org"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500"
          />
        </label>
      </div>

      <div className="rounded-xl border border-dashed border-black/15 p-4">
        <p className="mb-3 text-xs font-semibold text-black/70">পাসওয়ার্ড বদল (ঐচ্ছিক)</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-black/70">বর্তমান পাসওয়ার্ড</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-black/70">নতুন পাসওয়ার্ড (কমপক্ষে ৮)</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-black/70">নতুন পাসওয়ার্ড (আবার)</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500"
            />
          </label>
        </div>
      </div>

      {msg && <p className="rounded-lg bg-forest-50 px-3 py-2 text-xs text-forest-800">{msg}</p>}
      {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{err}</p>}

      <button type="submit" disabled={busy} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">
        {busy ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        সংরক্ষণ করুন
      </button>
    </form>
  )
}
