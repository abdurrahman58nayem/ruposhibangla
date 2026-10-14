'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import UploadField from './UploadField'
import type { SiteSettings } from '@/lib/types'

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter()
  const [s, setS] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(s),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'ব্যর্থ')
      setMsg('✔ সংরক্ষিত হয়েছে')
      router.refresh()
    } catch (e: any) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="card p-5">
        <h3 className="mb-3 text-sm font-bold text-forest-900">সাইট পরিচয়</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">সাইটের নাম (বাংলা)</label>
            <input value={s.siteName} onChange={(e) => setS({ ...s, siteName: e.target.value })} className="field" />
          </div>
          <div>
            <label className="label">সাইটের নাম (ইংরেজি)</label>
            <input value={s.siteNameEn} onChange={(e) => setS({ ...s, siteNameEn: e.target.value })} className="field" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">ট্যাগলাইন</label>
            <input value={s.tagline} onChange={(e) => setS({ ...s, tagline: e.target.value })} className="field" />
          </div>
          <div className="sm:col-span-2">
            <UploadField value={s.logoUrl} onChange={(url) => setS({ ...s, logoUrl: url })} label="লোগো" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">পরিচিতি (সম্পর্কে পাতায়)</label>
            <textarea value={s.about} onChange={(e) => setS({ ...s, about: e.target.value })} rows={4} className="field resize-none" />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-bold text-forest-900">হেডার নোটিশ</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={s.headerNoticeActive} onChange={(e) => setS({ ...s, headerNoticeActive: e.target.checked })} />
            নোটিশটি সবার উপরে দেখান
          </label>
          <input
            value={s.headerNotice}
            onChange={(e) => setS({ ...s, headerNotice: e.target.value })}
            className="field"
            placeholder="যেমন: নতুন খবর, সতর্কতা, ক্যাম্পেইন…"
          />
          <p className="text-[11px] text-black/45">জীব-উদ্ভিদ নিয়ে নতুন কিছু জানালেই এখান থেকে সবার জানিয়ে দিন।</p>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-forest-900">সোশ্যাল মিডিয়া লিংক</h3>
          <button
            type="button"
            onClick={() => setS({ ...s, socials: [...s.socials, { label: 'নতুন', url: 'https://' }] })}
            className="btn-soft px-3 py-1 text-xs"
          >
            <Plus size={13} /> যোগ করুন
          </button>
        </div>
        <div className="space-y-2">
          {s.socials.map((link, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input
                value={link.label}
                onChange={(e) => {
                  const next = [...s.socials]
                  next[i] = { ...next[i], label: e.target.value }
                  setS({ ...s, socials: next })
                }}
                className="field w-32"
                placeholder="Facebook"
              />
              <input
                value={link.url}
                onChange={(e) => {
                  const next = [...s.socials]
                  next[i] = { ...next[i], url: e.target.value }
                  setS({ ...s, socials: next })
                }}
                className="field flex-1"
                placeholder="https://facebook.com/…"
              />
              <select
                value={link.icon || 'facebook'}
                onChange={(e) => {
                  const next = [...s.socials]
                  next[i] = { ...next[i], icon: e.target.value }
                  setS({ ...s, socials: next })
                }}
                className="field w-32"
              >
                {['facebook', 'youtube', 'x', 'instagram', 'website'].map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setS({ ...s, socials: s.socials.filter((_, j) => j !== i) })}
                className="rounded-full p-2 text-black/40 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-bold text-forest-900">এআই সহচর ও যোগাযোগ</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">এআই-এর নাম</label>
            <input value={s.aiName} onChange={(e) => setS({ ...s, aiName: e.target.value })} className="field" />
          </div>
          <div>
            <label className="label">যোগাযোগের ইমেইল</label>
            <input value={s.contactEmail} onChange={(e) => setS({ ...s, contactEmail: e.target.value })} className="field" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">এআই-এর পরিচয় (চ্যাটের প্রথম বার্তা)</label>
            <textarea value={s.aiIntro} onChange={(e) => setS({ ...s, aiIntro: e.target.value })} rows={2} className="field resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">ফুটার নোট</label>
            <input value={s.footerNote} onChange={(e) => setS({ ...s, footerNote: e.target.value })} className="field" />
          </div>
        </div>
      </div>

      <div className="sticky bottom-16 z-30 flex flex-wrap items-center gap-3 rounded-2xl border border-black/10 bg-white/95 p-3 backdrop-blur md:bottom-4">
        <button className="btn-primary" disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} সংরক্ষণ করুন
        </button>
        {msg && <span className="text-sm text-black/60">{msg}</span>}
      </div>
    </form>
  )
}
