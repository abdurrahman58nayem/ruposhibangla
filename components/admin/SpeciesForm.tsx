'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import UploadField from './UploadField'
import type { Species, DataStatus, GroupId } from '@/lib/types'
import { CATEGORIES } from '@/lib/categories'

const CONSERVATION = ['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX', 'DD', 'NE']
const CATEGORIES_PRANI = ['পাখি', 'স্তন্যপায়ী', 'সরীসৃপ', 'উভচর', 'মাছ', 'পতঙ্গ', 'অন্যান্য']
const CATEGORIES_UDBHID = ['বন গাছ', 'ফল গাছ', 'ফুল গাছ', 'ঔষধি গাছ', 'জলজ উদ্ভিদ', 'ম্যানগ্রোভ', 'তাল-জাতীয়', 'বট-জাতীয়', 'ঘাস-জাতীয়', 'ফসল', 'অন্যান্য']

export default function SpeciesForm({ initial, isNew = false }: { initial: Species; isNew?: boolean }) {
  const router = useRouter()
  const [s, setS] = useState<Species>(initial)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const set = <K extends keyof Species>(k: K, v: Species[K]) => setS((prev) => ({ ...prev, [k]: v }))
  const cats = s.type === 'udbhid' ? CATEGORIES_UDBHID : CATEGORIES_PRANI

  const poetViews = s.poetViews || []
  const setPoet = (i: number, key: 'poet' | 'work' | 'note', value: string) => {
    const next = [...poetViews]
    next[i] = { ...next[i], [key]: value }
    set('poetViews', next)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch(isNew ? '/api/species' : `/api/species/${initial.slug}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(s),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'সংরক্ষণ ব্যর্থ')
      setMsg('✔ সংরক্ষিত হয়েছে')
      if (isNew) router.push(`/admin/species/${data.species.slug}`)
      else router.refresh()
    } catch (e: any) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="card p-5">
        <h3 className="mb-3 text-sm font-bold text-forest-900">মূল তথ্য</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">বাংলা নাম *</label>
            <input value={s.nameBn} onChange={(e) => set('nameBn', e.target.value)} className="field" required />
          </div>
          <div>
            <label className="label">স্লাগ (URL)</label>
            <input
              value={s.slug}
              onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="field"
              disabled={!isNew}
            />
          </div>
          <div>
            <label className="label">ধরন</label>
            <select value={s.type} onChange={(e) => set('type', e.target.value as any)} className="field">
              <option value="prani">প্রাণী</option>
              <option value="udbhid">উদ্ভিদ / ছত্রাক / অণুজীব</option>
              <option value="sthan">নদী-বন-পাহাড় (স্থান)</option>
              <option value="sahitto">প্রকৃতি ও সাহিত্য</option>
            </select>
          </div>
          <div>
            <label className="label">প্রধান ক্যাটাগরি (১৭টি)</label>
            <select value={s.group} onChange={(e) => set('group', e.target.value as any)} className="field">
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">বিভাগ</label>
            <select value={s.category} onChange={(e) => set('category', e.target.value)} className="field">
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              value={s.category}
              onChange={(e) => set('category', e.target.value)}
              className="field mt-1"
              placeholder="অথবা নতুন বিভাগ লিখুন"
            />
          </div>
          <div>
            <label className="label">ইংরেজি নাম</label>
            <input value={s.nameEn} onChange={(e) => set('nameEn', e.target.value)} className="field" />
          </div>
          <div>
            <label className="label">বৈজ্ঞানিক নাম</label>
            <input value={s.scientificName} onChange={(e) => set('scientificName', e.target.value)} className="field italic" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">অন্যান্য/স্থানীয় নাম (কমা দিয়ে)</label>
            <input
              value={(s.otherNames || []).join(', ')}
              onChange={(e) => set('otherNames', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))}
              className="field"
            />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-bold text-forest-900">বিবরণ</h3>
        <div className="space-y-3">
          <div>
            <label className="label">এক লাইনে পরিচয় (কার্ডে দেখাবে)</label>
            <textarea value={s.summary} onChange={(e) => set('summary', e.target.value)} rows={2} className="field resize-none" />
          </div>
          <div>
            <label className="label">বিস্তারিত</label>
            <textarea value={s.description} onChange={(e) => set('description', e.target.value)} rows={7} className="field resize-none" />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-bold text-forest-900">বিস্তারিত বৈশিষ্ট্য</h3>
        <p className="mb-3 text-[11px] text-black/45">
          শারীরিক গঠন, আচরণ ও পরিবেশে ভূমিকা — প্রজাতির বিস্তারিত পাতায় দেখানো হয়।
        </p>
        <div className="space-y-3">
          <div>
            <label className="label">শারীরিক বৈশিষ্ট্য</label>
            <textarea
              value={s.physical || ''}
              onChange={(e) => set('physical', e.target.value)}
              rows={3}
              className="field resize-none"
              placeholder="আকার, রং, পশম/পাতা-ছাল, শিং-ডানা…"
            />
          </div>
          <div>
            <label className="label">আচরণ</label>
            <textarea
              value={s.behavior || ''}
              onChange={(e) => set('behavior', e.target.value)}
              rows={3}
              className="field resize-none"
              placeholder="কখন সক্রিয়, কীভাবে চলাচল ও খাবার খোঁজে…"
            />
          </div>
          <div>
            <label className="label">পরিবেশে ভূমিকা</label>
            <textarea
              value={s.ecologicalRole || ''}
              onChange={(e) => set('ecologicalRole', e.target.value)}
              rows={3}
              className="field resize-none"
              placeholder="খাদ্যশৃঙ্খলে ভূমিকা, পরাগ-সেবন, মাটি রক্ষা…"
            />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-bold text-forest-900">বাস্তুসংস্থান</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ['habitat', 'বাসস্থান'],
              ['diet', s.type === 'udbhid' ? 'পুষ্টি/ব্যবহার' : 'খাদ্য'],
              ['sizeOrHeight', 'আকার/উচ্চতা'],
              ['season', 'মৌসুম'],
              ['whereToSee', 'কোথায় দেখা যায়'],
              ['reproduction', 'প্রজনন'],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input value={(s[key] as string) || ''} onChange={(e) => set(key, e.target.value)} className="field" />
            </div>
          ))}
          <div>
            <label className="label">সংরক্ষণ অবস্থা (কোড)</label>
            <select value={s.conservation} onChange={(e) => set('conservation', e.target.value as any)} className="field">
              {CONSERVATION.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">সংরক্ষণ — বাংলায়</label>
            <input value={s.conservationBn || ''} onChange={(e) => set('conservationBn', e.target.value)} className="field" />
          </div>
          <div>
            <label className="label">তথ্যের অবস্থা</label>
            <select value={s.dataStatus || 'partial'} onChange={(e) => set('dataStatus', e.target.value as DataStatus)} className="field">
              <option value="verified">যাচাইকৃত</option>
              <option value="review">পর্যালোচনাধীন</option>
              <option value="partial">আংশিক তথ্য</option>
              <option value="identity_uncertain">পরিচয় অনিশ্চিত</option>
              <option value="needs_correction">সংশোধন প্রয়োজন</option>
            </select>
          </div>
          <div>
            <label className="label">উৎপত্তি</label>
            <select value={s.origin || ''} onChange={(e) => set('origin', (e.target.value || undefined) as any)} className="field">
              <option value="">—</option>
              <option value="native">দেশীয়</option>
              <option value="domestic">গৃহপালিত</option>
              <option value="cultivated">চাষকৃত</option>
              <option value="migratory">পরিযায়ী</option>
              <option value="exotic">বহিরাগত</option>
              <option value="invasive">আগ্রাসী</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">হুমকি</label>
            <textarea value={s.threats || ''} onChange={(e) => set('threats', e.target.value)} rows={2} className="field resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">সংরক্ষণের উপায়</label>
            <textarea value={s.conservationActions || ''} onChange={(e) => set('conservationActions', e.target.value)} rows={2} className="field resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">একাধিক সূত্রে পার্থক্য থাকলে</label>
            <input value={s.conflictingInfo || ''} onChange={(e) => set('conflictingInfo', e.target.value)} className="field" />
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={!!s.sensitive} onChange={(e) => set('sensitive', e.target.checked)} />
            বিপন্ন প্রজাতি — অবস্থান গোপন রাখতে হবে
          </label>
          <div className="sm:col-span-2">
            <label className="label">প্রধান রং (কমা দিয়ে — ছবি থেকে শনাক্ত করতে কাজে লাগে)</label>
            <input
              value={(s.colorTags || []).join(', ')}
              onChange={(e) => set('colorTags', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))}
              className="field"
            />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-bold text-forest-900">ছবি ও গ্যালারি</h3>
        <UploadField value={s.image || ''} onChange={(url) => set('image', url)} label="প্রধান ছবি" />
        <div className="mt-3">
          <label className="label">গ্যালারি (প্রতি লাইনে একটি URL)</label>
          <textarea
            value={(s.gallery || []).join('\n')}
            onChange={(e) => set('gallery', e.target.value.split('\n').map((x) => x.trim()).filter(Boolean))}
            rows={3}
            className="field resize-none"
          />
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-forest-900">কবির চোখে</h3>
          <button
            type="button"
            onClick={() => set('poetViews', [...poetViews, { poet: '', work: '', note: '' }])}
            className="btn-soft px-3 py-1 text-xs"
          >
            <Plus size={13} /> যোগ করুন
          </button>
        </div>
        {poetViews.length === 0 && <p className="text-xs text-black/45">এখনো কোনো এন্ট্রি নেই।</p>}
        <div className="space-y-3">
          {poetViews.map((pv, i) => (
            <div key={i} className="rounded-xl bg-earth-50/50 p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <input value={pv.poet} onChange={(e) => setPoet(i, 'poet', e.target.value)} placeholder="কবির নাম" className="field" />
                <input value={pv.work || ''} onChange={(e) => setPoet(i, 'work', e.target.value)} placeholder="কাব্যগ্রন্থ/কবিতা (ঐচ্ছিক)" className="field" />
              </div>
              <textarea
                value={pv.note}
                onChange={(e) => setPoet(i, 'note', e.target.value)}
                rows={3}
                placeholder="কবি কীভাবে দেখেছেন এই প্রজাতিকে…"
                className="field mt-2 resize-none"
              />
              <button
                type="button"
                onClick={() => set('poetViews', poetViews.filter((_, j) => j !== i))}
                className="mt-2 inline-flex items-center gap-1 text-[11px] text-red-600"
              >
                <Trash2 size={12} /> সরিয়ে দিন
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-bold text-forest-900">তথ্যসূত্র</h3>
        <textarea
          value={(s.sources || []).map((x) => `${x.title} | ${x.url}`).join('\n')}
          onChange={(e) =>
            set(
              'sources',
              e.target.value
                .split('\n')
                .map((line) => {
                  const [title, url] = line.split('|')
                  return { title: (title || '').trim(), url: (url || '').trim() }
                })
                .filter((x) => x.title && x.url),
            )
          }
          rows={3}
          className="field resize-none"
          placeholder="IUCN Red List | https://www.iucnredlist.org/"
        />
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!s.featured} onChange={(e) => set('featured', e.target.checked)} />
          হোমপেজে নির্বাচিত হিসেবে দেখান
        </label>
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
