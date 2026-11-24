'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Sun, Moon, MonitorSmartphone, Languages, Bell, Trash2, Save, Loader2, ShieldCheck,
  Camera, Check, BadgeCheck, Clock, X,
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
  verificationRequest?: {
    status: 'pending' | 'approved' | 'rejected'
    note: string
    evidence?: string
    requestedAt: string
    reviewedAt?: string
    reviewedByName?: string
    reason?: string
  }
  retryDaysLeft: number
} | null

const THEMES = [
  { id: 'light', key: 'themeLight', icon: Sun },
  { id: 'dark', key: 'themeDark', icon: Moon },
  { id: 'system', key: 'themeSystem', icon: MonitorSmartphone },
] as const

export default function SettingsForm({ user }: { user: User }) {
  const router = useRouter()
  const {
    theme, setTheme, lang, setLang, dataSaver, setDataSaver,
    autoplay, setAutoplay, videoSound, setVideoSound, reduceMotion, setReduceMotion, t,
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
  const req = user?.verificationRequest
  const [verifyNote, setVerifyNote] = useState('')
  const [verifyLink, setVerifyLink] = useState('')
  const [verifyBusy, setVerifyBusy] = useState(false)
  const [verifyMsg, setVerifyMsg] = useState('')

  async function submitVerification() {
    setVerifyBusy(true)
    setVerifyMsg('')
    try {
      const res = await fetch('/api/me/verification', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ note: verifyNote, evidence: verifyLink }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'আবেদন পাঠানো যায়নি')
      setVerifyMsg('✔ আবেদন জমা হয়েছে — অ্যাডমিন পর্যালোচনা করবেন')
      setVerifyNote('')
      setVerifyLink('')
      router.refresh()
    } catch (e: any) {
      setVerifyMsg(e.message)
    } finally {
      setVerifyBusy(false)
    }
  }

  async function withdrawVerification() {
    if (!confirm('যাচাইয়ের আবেদন প্রত্যাহার করবেন?')) return
    setVerifyBusy(true)
    try {
      const res = await fetch('/api/me/verification', { method: 'DELETE' })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'প্রত্যাহার করা যায়নি')
      }
      router.refresh()
    } catch (e: any) {
      setVerifyMsg(e.message)
    } finally {
      setVerifyBusy(false)
    }
  }

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
        <h1 className="text-2xl font-bold text-forest-900">{t('settings')}</h1>
        <p className="mt-1 text-sm text-black/55">
          {lang === 'bn'
            ? 'থিম, ভাষা, ভিডিও ও ডেটার পছন্দ আপনার ডিভাইসেই সংরক্ষিত হয় — আবার আসলেও একই থাকবে।'
            : 'Theme, language, video and data preferences are saved on your device — and will still be here when you return.'}
        </p>
      </div>

      {/* থিম */}
      <section className="card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest-900">
          <Sun size={16} /> {t('theme')}
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((opt) => {
            const Icon = opt.icon
            const active = theme === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition',
                  active
                    ? 'border-forest-700 bg-forest-700 text-white'
                    : 'border-black/10 bg-white text-forest-900 hover:bg-forest-50',
                )}
              >
                <Icon size={20} />
                {t(opt.key)}
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
        <p className="mt-2 text-[11px] text-black/45">{t('languageHint')}</p>
        <p className="mt-1 text-[11px] text-black/45">
          {lang === 'bn'
            ? 'বৈজ্ঞানিক নাম সবসময় ল্যাটিনেই থাকবে — ভুল অনুবাদ তৈরি করা হয় না।'
            : 'Scientific names always stay in Latin — no machine mistranslation.'}
        </p>
      </section>

      {/* ছবি ও ভিডিও */}
      <section className="card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest-900">
          <MonitorSmartphone size={16} /> {t('media')}
        </h2>
        <div className="space-y-2">
          <Toggle
            label={t('dataSaver')}
            hint={t('dataSaverHint')}
            checked={dataSaver}
            onChange={setDataSaver}
          />
          <Toggle
            label={t('autoplay')}
            hint={t('autoplayHint')}
            checked={autoplay}
            onChange={setAutoplay}
          />
          <Toggle
            label={t('videoSound')}
            hint={t('videoSoundHint')}
            checked={videoSound}
            onChange={setVideoSound}
          />
          <Toggle
            label={t('reduceMotion')}
            hint={t('reduceMotionHint')}
            checked={reduceMotion}
            onChange={setReduceMotion}
          />
        </div>
      </section>

      {/* প্রোফাইল */}
      <section className="card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest-900">
          <Camera size={16} /> {t('profileSection')}
        </h2>
        {!user ? (
          <div className="rounded-xl bg-forest-50 p-4 text-sm text-forest-900">
            <p>
              {lang === 'bn'
                ? 'প্রোফাইল ও ব্যক্তিগত সেটিংস পেতে অ্যাকাউন্ট খুলুন বা লগইন করুন।'
                : 'Create an account or log in to get a profile and personal settings.'}
            </p>
            <div className="mt-3 flex gap-2">
              <Link href="/login" className="btn-primary text-sm">{t('login')}</Link>
              <Link href="/register" className="btn-outline text-sm">{t('register')}</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">{t('displayName')}</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="field"
                />
              </div>
              <div>
                <label className="label">{t('username')}</label>
                <input
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="field"
                />
              </div>
            </div>
            <div>
              <label className="label">{t('bio')}</label>
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
              <label className="label">{t('password')}</label>
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
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {t('saveChanges')}
              </button>
              <Link href={`/u/${user.username}`} className="btn-outline text-sm">{t('myProfile')}</Link>
              {msg && <span className="text-sm text-black/60">{msg}</span>}
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl bg-forest-50 p-3 text-center">
              <Stat label={t('posts')} value={0} />
              <Stat label={t('followers')} value={user.followers} />
              <Stat label={t('following')} value={user.following} />
            </div>
          </div>
        )}
      </section>

      {/* অ্যাকাউন্ট */}
      {user && (
        <section className="card p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest-900">
            <ShieldCheck size={16} /> {t('accountSection')}
          </h2>
          <p className="text-xs text-black/55">
            {lang === 'bn' ? 'ভূমিকা' : 'Role'}:{' '}
            <b>
              {user.role === 'partner'
                ? lang === 'bn' ? 'যাচাইকৃত পার্টনার' : 'Verified partner'
                : user.role === 'admin' || user.role === 'super_admin'
                  ? lang === 'bn' ? 'অ্যাডমিন' : 'Admin'
                  : user.role === 'editor'
                    ? lang === 'bn' ? 'এডিটর/মডারেটর' : 'Editor / moderator'
                    : lang === 'bn' ? 'ব্যবহারকারী' : 'Member'}
            </b>
            {user.verified && ` · ${t('verified')} ✔`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/saved" className="btn-outline text-sm">{t('savedItems')}</Link>
            <Link href="/notifications" className="btn-outline text-sm">
              <Bell size={14} /> {t('notifications')}
            </Link>
            <Link href="/observations" className="btn-outline text-sm">{t('myObservations')}</Link>
          </div>
          {/* নীল টিক */}
          <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50/50 p-3">
            <p className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
              <BadgeCheck size={14} /> নীল টিক (যাচাইকৃত পরিচয়)
            </p>

            {user.verified ? (
              <p className="mt-1.5 text-xs text-sky-900/80">
                আপনার প্রোফাইল যাচাইকৃত ✔ — নামের পাশে নীল টিক দেখানো হচ্ছে।
              </p>
            ) : req?.status === 'pending' ? (
              <div className="mt-1.5 space-y-2">
                <p className="flex items-center gap-1 text-xs text-sky-900/80">
                  <Clock size={12} /> আপনার আবেদন পর্যালোচনাধীন — দয়া করে অপেক্ষা করুন।
                </p>
                <p className="rounded-lg bg-white/70 px-2.5 py-1.5 text-[11px] leading-relaxed text-black/60">
                  “{req.note}”
                </p>
                <button
                  onClick={withdrawVerification}
                  disabled={verifyBusy}
                  className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold text-black/60 disabled:opacity-50"
                >
                  <X size={12} /> আবেদন প্রত্যাহার
                </button>
              </div>
            ) : req?.status === 'rejected' ? (
              <div className="mt-1.5 space-y-1.5">
                <p className="text-xs text-red-700">
                  আবেদনটি অনুমোদিত হয়নি{req.reason ? `: ${req.reason}` : ''}
                </p>
                {user.retryDaysLeft > 0 ? (
                  <p className="text-[11px] text-black/50">
                    আবার আবেদন করতে {toBn(user.retryDaysLeft)} দিন বাকি।
                  </p>
                ) : (
                  <p className="text-[11px] text-black/50">এখন আবার আবেদন করতে পারবেন।</p>
                )}
              </div>
            ) : null}

            {/* ফর্ম দেখানো হয়: আবেদন নেই, প্রত্যাখ্যাত ও অপেক্ষা শেষ */}
            {!user.verified && req?.status !== 'pending' && user.retryDaysLeft === 0 && (
              <div className="mt-2 space-y-2">
                <p className="text-[11px] leading-relaxed text-black/55">
                  দেশ ও প্রকৃতির কাজে যুক্ত গবেষক, সংরক্ষণকর্মী, আলোকচিত্রী বা প্রতিষ্ঠান হলে
                  যাচাইয়ের আবেদন করুন। অনুমোদনে প্রোফাইলে নীল টিক বসবে।
                </p>
                <label className="label" htmlFor="verify-note">
                  কেন যাচাই দরকার (অন্তত ২০ অক্ষর)
                </label>
                <textarea
                  id="verify-note"
                  rows={3}
                  maxLength={400}
                  value={verifyNote}
                  onChange={(e) => setVerifyNote(e.target.value)}
                  className="field"
                  placeholder="যেমন: সুন্দরবনের পাখি নিয়ে ৮ বছর মাঠপর্যায়ে কাজ করছি; প্রকাশিত ছবি ও প্রতিবেদন রয়েছে…"
                />
                <label className="label" htmlFor="verify-link">
                  প্রমাণসূত্র (ইচ্ছা হলে — পূর্ণ লিংক)
                </label>
                <input
                  id="verify-link"
                  type="url"
                  value={verifyLink}
                  onChange={(e) => setVerifyLink(e.target.value)}
                  className="field"
                  placeholder="https://…"
                />
                {verifyMsg && <p className="text-[11px] text-black/60">{verifyMsg}</p>}
                <button
                  onClick={submitVerification}
                  disabled={verifyBusy || verifyNote.trim().length < 20}
                  className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {verifyBusy ? <Loader2 size={13} className="animate-spin" /> : <BadgeCheck size={13} />}
                  আবেদন পাঠান
                </button>
              </div>
            )}
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
              {deleteAsked ? t('deleteRequested') : t('deleteAccount')}
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
