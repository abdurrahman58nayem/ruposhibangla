'use client'

import { useState } from 'react'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'

export default function JenoForm({
  speciesOptions,
  defaultSpecies = '',
  defaultTopic = '',
}: {
  speciesOptions: { slug: string; nameBn: string; category: string }[]
  defaultSpecies?: string
  defaultTopic?: string
}) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [topic, setTopic] = useState(defaultTopic)
  const [speciesSlug, setSpeciesSlug] = useState(defaultSpecies)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (name.trim().length < 2) return setError('আপনার নাম দিন')
    if (message.trim().length < 10) return setError('অন্তত ১০ অক্ষরে বিষয়টি লিখুন')
    setBusy(true)
    try {
      const res = await fetch('/api/jeno', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, contact, topic, speciesSlug, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'পাঠানো যায়নি')
      setDone(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="card grid place-items-center gap-3 p-10 text-center">
        <CheckCircle2 size={42} className="text-forest-600" />
        <h2 className="text-lg font-bold text-forest-900">জেনো — আপনার তথ্য পেয়ে গেলাম!</h2>
        <p className="max-w-md text-sm text-black/60">
          আমাদের সম্পাদক দল যাচাই করে তথ্যভাণ্ডারে যোগ করবে। প্রয়োজনে আপনার সাথে যোগাযোগ করা হতে পারে।
        </p>
        <button onClick={() => setDone(false)} className="btn-outline mt-2">
          আরও তথ্য পাঠান
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="card p-5">
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">আপনার নাম *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="field" maxLength={60} />
        </div>
        <div>
          <label className="label">মোবাইল বা ইমেইল (ঐচ্ছিক)</label>
          <input value={contact} onChange={(e) => setContact(e.target.value)} className="field" maxLength={80} />
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">বিষয়</label>
          <input value={topic} onChange={(e) => setTopic(e.target.value)} className="field" placeholder="যেমন: ভুল তথ্য / নতুন প্রজাতি" maxLength={120} />
        </div>
        <div>
          <label className="label">সম্পর্কিত প্রজাতি (ঐচ্ছিক)</label>
          <select value={speciesSlug} onChange={(e) => setSpeciesSlug(e.target.value)} className="field">
            <option value="">— নির্বাচন করুন —</option>
            {speciesOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.nameBn} ({s.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-5">
        <label className="label">আপনার তথ্য *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="field resize-none"
          placeholder="যেমন: আমাদের এলাকায় এই পাখিটি মার্চ মাসে বেশি দেখা যায়… / এই নামে ভুল আছে… / নতুন ছবি পাঠাচ্ছি…"
          maxLength={4000}
        />
      </div>

      {error && <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button className="btn-primary w-full py-3" disabled={busy}>
        {busy ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />} পাঠিয়ে দিন
      </button>
    </form>
  )
}
