'use client'

import { useCallback, useEffect, useState } from 'react'
import { Save, Trash2, Loader2, Database, CheckCircle2, XCircle } from 'lucide-react'

type Status = {
  configured: boolean
  source: 'env' | 'db' | 'none'
  envOverride: boolean
  masked: { accountId: string; accessKeyId: string; secretAccessKey: string; bucket: string; publicUrl: string }
}

export default function StorageSettingsForm() {
  const [status, setStatus] = useState<Status | null>(null)
  const [accountId, setAccountId] = useState('')
  const [accessKeyId, setAccessKeyId] = useState('')
  const [secretAccessKey, setSecretAccessKey] = useState('')
  const [bucket, setBucket] = useState('')
  const [publicUrl, setPublicUrl] = useState('')
  const [busy, setBusy] = useState<'save' | 'test' | 'clear' | null>(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/storage')
    if (res.ok) setStatus(await res.json())
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy('save')
    setMsg('')
    setErr('')
    try {
      const res = await fetch('/api/admin/storage', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ accountId, accessKeyId, secretAccessKey, bucket, publicUrl }),
      })
      const data = await res.json()
      if (!res.ok || data?.error) return setErr(data?.error || 'সংরক্ষণ ব্যর্থ')
      setMsg(data.message || 'সংরক্ষিত হয়েছে')
      setAccountId('')
      setAccessKeyId('')
      setSecretAccessKey('')
      await load()
    } finally {
      setBusy(null)
    }
  }

  async function test() {
    setBusy('test')
    setMsg('')
    setErr('')
    try {
      const res = await fetch('/api/admin/storage', { method: 'POST' })
      const data = await res.json()
      if (data.ok) setMsg(data.message)
      else setErr(data.error || 'সংযোগ ব্যর্থ')
    } finally {
      setBusy(null)
    }
  }

  async function clear() {
    if (!confirm('R2 সংযোগ মুছে ফেলবেন? এরপর আপলোড লোকাল ফোল্ডারে জমা হবে।')) return
    setBusy('clear')
    setMsg('')
    setErr('')
    try {
      const res = await fetch('/api/admin/storage', { method: 'DELETE' })
      const data = await res.json()
      if (data.ok) setMsg(data.message)
      else setErr(data.error || 'মোছা যায়নি')
      await load()
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-forest-900">
              <Database size={17} /> Cloudflare R2 সংযোগ
            </h3>
            <p className="mt-1 text-xs text-black/55">
              এখান থেকে R2 বাকেট যোগ করলে সব ছবি-ভিডিও R2-এ জমা হবে। ক্রেডেনশিয়াল সার্ভারে (ডেটাবেজে) থাকে,
              ব্রাউজারে কখনো যায় না।
            </p>
          </div>
          {status && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                status.configured
                  ? 'border-forest-200 bg-forest-50 text-forest-800'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}
            >
              {status.configured ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {status.configured
                ? `R2 চালু (উৎস: ${status.source === 'env' ? 'env' : 'অ্যাডমিন প্যানেল'})`
                : 'R2 নেই — লোকাল স্টোরেজ'}
            </span>
          )}
        </div>

        {status?.envOverride && (
          <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <b>মনে রাখুন:</b> সার্ভারে <code>R2_ACCOUNT_ID</code> ইত্যাদি env-ভেরিয়েবল সেট করা আছে — env-এর মানই
            কার্যকর হবে, নিচের ফর্ম থেকে সেভ করলে তা উপেক্ষিত হবে।
          </p>
        )}

        {status?.configured && (
          <dl className="mb-4 grid gap-2 rounded-xl bg-black/[0.03] p-4 text-xs sm:grid-cols-2">
            <div>
              <dt className="text-black/50">Account ID</dt>
              <dd className="font-mono">{status.masked.accountId || '—'}</dd>
            </div>
            <div>
              <dt className="text-black/50">Access Key ID</dt>
              <dd className="font-mono">{status.masked.accessKeyId || '—'}</dd>
            </div>
            <div>
              <dt className="text-black/50">Secret Access Key</dt>
              <dd className="font-mono">{status.masked.secretAccessKey || '—'}</dd>
            </div>
            <div>
              <dt className="text-black/50">Bucket</dt>
              <dd className="font-mono">{status.masked.bucket || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-black/50">Public URL</dt>
              <dd className="font-mono break-all">{status.masked.publicUrl || '—'}</dd>
            </div>
          </dl>
        )}

        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-black/70">Account ID</span>
            <input
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="ফাঁকা রাখলে বদলাবে না"
              className="w-full rounded-xl border border-black/10 px-3 py-2 font-mono text-xs outline-none focus:border-forest-500"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-black/70">Bucket name</span>
            <input
              value={bucket}
              onChange={(e) => setBucket(e.target.value)}
              placeholder="ruposhibangla"
              className="w-full rounded-xl border border-black/10 px-3 py-2 font-mono text-xs outline-none focus:border-forest-500"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-black/70">Access Key ID</span>
            <input
              value={accessKeyId}
              onChange={(e) => setAccessKeyId(e.target.value)}
              autoComplete="off"
              placeholder="ফাঁকা রাখলে বদলাবে না"
              className="w-full rounded-xl border border-black/10 px-3 py-2 font-mono text-xs outline-none focus:border-forest-500"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-black/70">Secret Access Key</span>
            <input
              type="password"
              value={secretAccessKey}
              onChange={(e) => setSecretAccessKey(e.target.value)}
              autoComplete="new-password"
              placeholder="ফাঁকা রাখলে বদলাবে না"
              className="w-full rounded-xl border border-black/10 px-3 py-2 font-mono text-xs outline-none focus:border-forest-500"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-black/70">
              Public URL (ঐচ্ছিক — R2 বাকেটের পাবলিক ডোমেইন)
            </span>
            <input
              value={publicUrl}
              onChange={(e) => setPublicUrl(e.target.value)}
              placeholder="https://pub-xxxx.r2.dev"
              className="w-full rounded-xl border border-black/10 px-3 py-2 font-mono text-xs outline-none focus:border-forest-500"
            />
          </label>

          {msg && (
            <p className="rounded-lg bg-forest-50 px-3 py-2 text-xs text-forest-800 sm:col-span-2">{msg}</p>
          )}
          {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 sm:col-span-2">{err}</p>}

          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button type="submit" disabled={busy !== null} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">
              {busy === 'save' ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              সংরক্ষণ করুন
            </button>
            <button
              type="button"
              onClick={test}
              disabled={busy !== null}
              className="btn-outline inline-flex items-center gap-2 disabled:opacity-60"
            >
              {busy === 'test' ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              সংযোগ পরীক্ষা
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={busy !== null}
              className="btn-outline inline-flex items-center gap-2 text-red-600 disabled:opacity-60"
            >
              {busy === 'clear' ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              সংযোগ মুছুন
            </button>
          </div>
        </form>
      </div>

      <div className="card p-5 text-xs leading-relaxed text-black/60">
        <p className="mb-2 font-semibold text-black/75">R2 বাকেট তৈরি ও কী পাওয়ার ধাপ</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Cloudflare ড্যাশবোর্ড → <b>R2</b> → <b>Create bucket</b> (যেমন <code>ruposhibangla</code>)।</li>
          <li>বাকেট → <b>Settings</b> → <b>Public access</b> চালু করলে <b>Public URL</b> পাবেন (r2.dev)।</li>
          <li>ডানপাশের <b>Account ID</b> কপি করুন।</li>
          <li><b>Manage R2 API tokens</b> → <b>Create API token</b> (Object Read &amp; Write) → Access Key ID ও Secret Access Key কপি করুন।</li>
          <li>উপরের ফর্মে বসিয়ে <b>সংযোগ পরীক্ষা</b> চাপুন। সবুজ হলেই কাজ শেষ।</li>
        </ol>
        <p className="mt-3 rounded-lg bg-forest-50 px-3 py-2 text-forest-900">
          বিকল্প: Vercel-এর Environment Variables-এ <code>R2_ACCOUNT_ID</code>, <code>R2_ACCESS_KEY_ID</code>,{' '}
          <code>R2_SECRET_ACCESS_KEY</code>, <code>R2_BUCKET_NAME</code>, <code>R2_PUBLIC_URL</code> সেট করলেও হয় —
          তখন অ্যাডমিন প্যানেলের মান উপেক্ষিত হবে।
        </p>
      </div>
    </div>
  )
}
