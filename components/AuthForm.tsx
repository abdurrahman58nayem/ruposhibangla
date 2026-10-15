'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Leaf, Loader2 } from 'lucide-react'

export default function AuthForm({ mode, next }: { mode: 'login' | 'register'; next?: string }) {
  const router = useRouter()
  const isLogin = mode === 'login'
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await fetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(
          isLogin ? { username, password } : { name, username, password, email: email.trim().toLowerCase() },
        ),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'সমস্যা হয়েছে')
      router.push(next || '/')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-forest-700 text-white">
          <Leaf size={26} />
        </span>
        <h1 className="text-2xl font-bold text-forest-900">{isLogin ? 'লগইন করুন' : 'অ্যাকাউন্ট খুলুন'}</h1>
        <p className="mt-1 text-sm text-black/55">
          {isLogin ? 'আপনার শেয়ার আর ফলো-ফলোয়ার এক জায়গায়' : 'অ্যাকাউন্ট ছাড়াও শেয়ার করা যায় — তবে অ্যাকাউন্ট থাকলে সুবিধা বেশি'}
        </p>
      </div>

      <form onSubmit={submit} className="card space-y-4 p-5">
        {!isLogin && (
          <div>
            <label className="label">আপনার নাম</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="field" required minLength={2} maxLength={60} />
          </div>
        )}
        <div>
          <label className="label">{isLogin ? 'ইমেইল বা ব্যবহারনাম' : 'ব্যবহারনাম'}</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="field"
            required
            minLength={3}
            maxLength={120}
            placeholder={isLogin ? 'admin@example.com বা আপনার ইউজারনেম' : 'লাতিন অক্ষরে, যেমন: rahatbd'}
            autoComplete="username"
          />
          {!isLogin && <p className="mt-1 text-[11px] text-black/40">বাংলা নাম দিলে স্বয়ংক্রিয়ভাবে লাতিনে রূপান্তর হবে</p>}
        </div>
        {!isLogin && (
          <div>
            <label className="label">ইমেইল</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              required
              maxLength={120}
              placeholder="name@example.com"
              autoComplete="email"
            />
            <p className="mt-1 text-[11px] text-black/40">
              এই ইমেইল দিয়েই পরে লগইন করবেন — ইউজারনেমও চলবে
            </p>
          </div>
        )}
        <div>
          <label className="label">পাসওয়ার্ড</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            required
            minLength={6}
            maxLength={80}
          />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button className="btn-primary w-full py-3" disabled={busy}>
          {busy && <Loader2 size={17} className="animate-spin" />}
          {isLogin ? 'লগইন' : 'অ্যাকাউন্ট তৈরি করুন'}
        </button>

        <p className="text-center text-sm text-black/55">
          {isLogin ? (
            <>
              অ্যাকাউন্ট নেই?{' '}
              <Link href="/register" className="font-medium text-forest-700 hover:underline">
                খুলুন
              </Link>
            </>
          ) : (
            <>
              আগেই অ্যাকাউন্ট আছে?{' '}
              <Link href="/login" className="font-medium text-forest-700 hover:underline">
                লগইন
              </Link>
            </>
          )}
        </p>
      </form>

      <p className="mt-4 text-center text-xs text-black/45">
        <Link href="/share" className="hover:underline">
          অ্যাকাউন্ট ছাড়াই ছবি শেয়ার করুন →
        </Link>
      </p>
    </div>
  )
}
