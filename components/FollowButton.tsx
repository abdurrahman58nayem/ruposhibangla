'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FollowButton({
  userId,
  initial = false,
  loggedIn = false,
  className,
}: {
  userId: string
  initial?: boolean
  loggedIn?: boolean
  className?: string
}) {
  const router = useRouter()
  const [following, setFollowing] = useState(initial)
  const [busy, setBusy] = useState(false)

  async function toggle() {
    if (!loggedIn) {
      router.push('/login?next=' + encodeURIComponent(window.location.pathname))
      return
    }
    if (busy) return
    setBusy(true)
    setFollowing((v) => !v)
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (typeof data.following === 'boolean') setFollowing(data.following)
    } catch {
      setFollowing((v) => !v)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        'btn text-sm',
        following ? 'border border-forest-300 bg-white text-forest-800' : 'bg-forest-700 text-white hover:bg-forest-800',
        className,
      )}
    >
      {following ? <UserCheck size={16} /> : <UserPlus size={16} />}
      {following ? 'ফলো করা হয়েছে' : 'ফলো করুন'}
    </button>
  )
}
