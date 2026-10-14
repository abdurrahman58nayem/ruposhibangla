'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Sun, Moon, MonitorSmartphone, Languages, Bell, Trash2, Save, Loader2, ShieldCheck,
  Camera, Check,
} from 'lucide-react'
import { useApp } from '@/components/Providers'
import UploadField from '@/components/admin/UploadField'
import { toBn } from '@/lib/utils'
import { cn } from '@/lib/utils'

type User = {
  id: string
  username: string
  name: string
  bio?: string
  avatar?: string
  cover?: string
  location?: string
  followers: number
  following: number
  verified: boolean
  role: string
  deletionRequested?: boolean
} | null

const THEMES = [
  { id: 'light', label: 'হালকা', labelEn: 'Light', icon: Sun },
  { id: 'dark', label: 'গাঢ়', labelEn: 'Dark', icon: Moon },
  { id: 'system', label: 'ডিভাইসের মতো', labelEn: 'System', icon: MonitorSmartphone },
] as const

export default function SettingsForm({ user }: { user: User }) {
  const router = useRouter()
  const {
    theme, setTheme, lang, setLang, dataSaver, setDataSaver,
    autoplay, setAutoplay, videoSound, setVideoSound, reduceMotion, setReduceMotion,
  } = useApp()

  const [profile, setProfile] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    cover: user?.cover || '',
    location: user?.location || '',
    password: '',
  })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [deleteAsked, setDeleteAsked] = useState(!!user?.deletionRequested)

  async function saveProfile() {
    if (!user) return
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'সংরক্ষণ করা যায়নি')
      setMsg('✔ সংরক্ষিত হয়েছে')
      router.refresh()
    } catch (e: any) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function requestDeletion() {
    if (!user) return
    if (!confirm('অ্যাকাউন্ট মুছে ফেলার অনুরোধ পাঠাবেন? অ্যাডমিন যাচাই করে অনুরোধটি প্রক্রিয়া করবেন।')) return
    setBusy(true)
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ deletionRequested: true }),
    })
    setDeleteAsked(true)
    setBusy(false)
    router.refresh()
  }

  return (
    <div className="container-pb max-w-3xl space-y-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-forest-900">সেটিংস</h1>
        <p className="mt-1 text-sm text-black/55">
          থিম, ভাষা, ভিডিও ও ডেটার পছন্দ আপনার ডিভাইসেই সংরক্ষিত হয় — আবার আসলেও একই থাকবে।
        </p>
      </div>

      {/* থিম */}
      <section className="card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest-900">
          <Sun size={16} /> থিম
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => {
            const Icon = t.icon
            const active = theme === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition',
                  active
                    ? 'border-forest-700 bg-forest-700 text-white'
                    : 'border-black/10 bg-white text-forest-900 hover:bg-forest-50',
                )}
              >
                <Icon size={20} />
                {lang === 'bn' ? t.label : t.labelEn}
              </button>
            )
          })}
        </div>
      </section>

      {/* ভাষা */}
      <section className="card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest-900">
          <Languages size={16} /> ভাষা
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {(['bn', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn(
                'rounded-xl border px-3 py-2.5 text-sm font-medium transition',
                lang === l
                  ? 'border-forest-700 bg-forest-700 text-white'
                  : 'border-black/10 bg-white text-forest-900 hover:bg-forest-50',
              )}
            >
              {l === 'bn' ? 'বাংলা' : 'English'}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-black/45">
          বৈজ্ঞানিক নাম সবসময় ল্যাটিনেই থাকবে — ভুল অনুবাদ তৈরি করা হয় না।
        </p>
      </section>

      {/* ছবি ও ভিডিও */}
      <section className="card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest-900">
          <MonitorSmartphone size={16} /> ছবি ও ভিডিও
        </h2>
        <div className="space-y-2">
          <Toggle
            label="ডেটা সাশ্রয়ী মোড"
            hint="ভিডিও আগেই লোড হয় না, ছবির মান কমানো হয়"
            checked={dataSaver}
            onChange={setDataSaver}
          />
          <Toggle
            label="ভিডিও অটো-প্লে"
            hint="ফিড ও রিলসে ভিডিও নিজে থেকে চালু হবে"
            checked={autoplay}
            onChange={setAutoplay}
          />
          <Toggle
            label="ভিডিওর শব্দ"
            hint="চালু থাকলে ভিডিও শব্দসহ শুরু হবে"
            checked={videoSound}
            onChange={setVideoSound}
          />
          <Toggle
            label="অ্যানিমেশন কমান"
            hint="নড়াচড়া কমিয়ে দেয় — চোখ আরাম পায়"
            checked={reduceMotion}
            onChange={setReduceMotion}
          />
        </div>
      </section>

      {/* প্রোফাইল */}
      <section className="card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest-900">
          <Camera size={16} /> প্রোফাইল
        </h2>
        {!user ? (
          <div className="rounded-xl bg-forest-50 p-4 text-sm text-forest-900">
            <p>প্রোফাইল ও ব্যক্তিগত সেটিংস পেতে অ্যাকাউন্ট খুলুন বা লগইন করুন।</p>
            <div className="mt-3 flex gap-2">
              <Link href="/login" className="btn-primary text-sm">লগইন</Link>
              <Link href="/register" className="btn-outline text-sm">অ্যাকাউন্ট খুলুন</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">প্রদর্শিত নাম</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="field"
                />
              </div>
              <div>
                <label className="label">ইউজারনেম</label>
                <input
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="field"
                />
              </div>
            </div>
            <div>
              <label className="label">পরিচিতি</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="field resize-none"
              />
            </div>
            <div>
              <label className="label">এলাকা (ঐচ্ছিক)</label>
              <input
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="field"
                placeholder="যেমন: সিলেট"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <UploadField value={profile.avatar} onChange={(url) => setProfile({ ...profile, avatar: url })} label="প্রোফাইল ছবি" />
              <UploadField value={profile.cover} onChange={(url) => setProfile({ ...profile, cover: url })} label="কভার ছবি" />
            </div>
            <div>
              <label className="label">নতুন পাসওয়ার্ড (বদলাতে চাইলে)</label>
              <input
                type="password"
                value={profile.password}
                onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                className="field"
                placeholder="••••••"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={saveProfile} className="btn-primary" disabled={busy}>
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} সংরক্ষণ করুন
              </button>
              <Link href={`/u/${user.username}`} className="btn-outline text-sm">আমার প্রোফাইল</Link>
              {msg && <span className="text-sm text-black/60">{msg}</span>}
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl bg-forest-50 p-3 text-center">
              <Stat label="পোস্ট" value={0} />
              <Stat label="অনুসারী" value={user.followers} />
              <Stat label="অনুসরণ" value={user.following} />
            </div>
          </div>
        )}
      </section>

      {/* অ্যাকাউন্ট */}
      {user && (
        <section className="card p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest-900">
            <ShieldCheck size={16} /> অ্যাকাউন্ট
          </h2>
          <p className="text-xs text-black/55">
            ভূমিকা: <b>{user.role === 'partner' ? 'যাচাইকৃত পার্টনার' : user.role === 'admin' || user.role === 'super_admin' ? 'অ্যাডমিন' : user.role === 'editor' ? 'এডিটর/মডারেটর' : 'ব্যবহারকারী'}</b>
            {user.verified && ' · ব্লু টিক ✔'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/saved" className="btn-outline text-sm">সংরক্ষিত</Link>
            <Link href="/notifications" className="btn-outline text-sm">
              <Bell size={14} /> নোটিফিকেশন
            </Link>
            <Link href="/observations" className="btn-outline text-sm">আমার পর্যবেক্ষণ</Link>
          </div>
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50/60 p-3">
            <p className="text-xs text-red-800">
              অ্যাকাউন্ট মুছে ফেলার অনুরোধ পাঠালে আমরা যাচাই করে সাড়া দিই। আপনার ব্যক্তিগত তথ্য অন্য কোথাও ব্যবহার করা হয় না।
            </p>
            <button
              onClick={requestDeletion}
              disabled={busy || deleteAsked}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {deleteAsked ? <Check size={14} /> : <Trash2 size={14} />}
              {deleteAsked ? 'অনুরোধ জমা হয়েছে' : 'অ্যাকাউন্ট মুছে ফেলার অনুরোধ'}
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

function Toggle({
  label, hint, checked, onChange,
}: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-black/10 p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-[#235d41]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-forest-900">{label}</span>
        {hint && <span className="block text-[11px] text-black/45">{hint}</span>}
      </span>
    </label>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-lg font-bold text-forest-900">{toBn(value)}</p>
      <p className="text-[10px] text-black/50">{label}</p>
    </div>
  )
}
