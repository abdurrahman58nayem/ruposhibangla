'use client'

/**
 * রূপসী বাংলা — নিজ প্রোফাইলের সহজ আপলোড (ফেসবুক-স্টাইল):
 *  · ProfileControls  → কভার জোন: সেটিংস গিয়ার + "কভার বদলান" বোতাম + ত্রুটি বার্তা
 *  · ProfileAvatarButton → অবতারের ওপর ক্যামেরা বোতাম
 * ছবি বাছুন → /api/upload → /api/profile প্যাচ → router.refresh()।
 */

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Camera, ImagePlus, Loader2, Settings } from 'lucide-react'

async function uploadAndPatch(target: 'avatar' | 'cover', file: File) {
  const fd = new FormData()
  fd.append('file', file)
  const up = await fetch('/api/upload', { method: 'POST', body: fd })
  const data = await up.json().catch(() => ({}))
  if (!up.ok) throw new Error(data.error || 'আপলোড ব্যর্থ হয়েছে')
  const patch = await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(target === 'avatar' ? { avatar: data.url } : { cover: data.url }),
  })
  const pd = await patch.json().catch(() => ({}))
  if (!patch.ok) throw new Error(pd.error || 'সংরক্ষণ ব্যর্থ হয়েছে')
}

/** কভার জোন — সেটিংস গিয়ার ও কভার-আপলোড বোতাম (isOwn না হলে কিছুই দেখায় না) */
export default function ProfileControls({ isOwn, cover }: { isOwn: boolean; cover?: string }) {
  const router = useRouter()
  const coverInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!isOwn) return null

  async function pick(file?: File | null) {
    if (!file) return
    setError('')
    setBusy(true)
    try {
      await uploadAndPatch('cover', file)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Link
        href="/settings"
        aria-label="সেটিংস"
        title="সেটিংস"
        className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-black/5 bg-white/90 text-forest-800 shadow-card backdrop-blur transition hover:bg-white"
      >
        <Settings size={17} />
      </Link>

      <button
        type="button"
        onClick={() => coverInput.current?.click()}
        disabled={busy}
        className="absolute bottom-3 right-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white/95 px-3 py-1.5 text-xs font-semibold text-forest-800 shadow-card transition hover:bg-white disabled:opacity-60"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
        {cover ? 'কভার বদলান' : 'কভার যোগ করুন'}
      </button>

      {error && (
        <p className="absolute bottom-3 left-4 z-20 max-w-[60%] rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700">
          {error}
        </p>
      )}

      <input
        ref={coverInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </>
  )
}

/** অবতারের ওপরের ক্যামেরা বোতাম — নিজ প্রোফাইলে কার্নারে বসে থাকে */
export function ProfileAvatarButton({ isOwn }: { isOwn: boolean }) {
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!isOwn) return null

  async function pick(file?: File | null) {
    if (!file) return
    setError('')
    setBusy(true)
    try {
      await uploadAndPatch('avatar', file)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
      setTimeout(() => setError(''), 4000)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={busy}
        aria-label="প্রোফাইল ছবি বদলান"
        title="প্রোফাইল ছবি বদলান"
        className="absolute -bottom-1.5 -right-1.5 z-20 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-forest-700 text-white shadow-card transition hover:bg-forest-800 disabled:opacity-60"
      >
        {busy ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
      </button>
      {error && (
        <span className="absolute -bottom-8 left-0 z-20 whitespace-nowrap rounded-lg bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
          {error}
        </span>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </>
  )
}
