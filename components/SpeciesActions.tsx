'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Flag, Share2 } from 'lucide-react'

/** প্রজাতির পাতা — সংরক্ষণ, শেয়ার ও রিপোর্ট */
export default function SpeciesActions({ slug, title }: { slug: string; title: string }) {
  const [saved, setSaved] = useState(false)
  const [reported, setReported] = useState(false)

  useEffect(() => {
    fetch('/api/saves', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        const items: any[] = d.items || []
        setSaved(items.some((i) => i.targetType === 'species' && i.targetId === slug))
      })
      .catch(() => {})
  }, [slug])

  async function toggleSave() {
    const res = await fetch('/api/saves', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ targetType: 'species', targetId: slug }),
    })
    const data = await res.json()
    setSaved(!!data.saved)
  }

  async function report() {
    const reason = window.prompt('কী সমস্যা পেয়েছেন? (যেমন: ভুল তথ্য, অনুপযুক্ত ছবি)')
    if (!reason) return
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ targetType: 'species', targetId: slug, reason }),
    })
    setReported(true)
  }

  function share() {
    const url = window.location.href
    if (navigator.share) navigator.share({ title, url })
    else navigator.clipboard?.writeText(url)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={toggleSave} className={`btn-soft text-sm ${saved ? 'bg-forest-100' : ''}`}>
        <Bookmark size={15} className={saved ? 'fill-forest-700 text-forest-700' : ''} />
        {saved ? 'সংরক্ষিত' : 'সংরক্ষণ'}
      </button>
      <button onClick={share} className="btn-soft text-sm">
        <Share2 size={15} /> শেয়ার
      </button>
      <button onClick={report} className="btn-soft text-sm" disabled={reported}>
        <Flag size={15} /> {reported ? 'রিপোর্ট পাঠানো হয়েছে' : 'রিপোর্ট'}
      </button>
    </div>
  )
}
