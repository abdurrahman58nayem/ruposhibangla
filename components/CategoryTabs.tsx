'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function CategoryTabs({
  items,
  basePath,
  param = 'cat',
}: {
  items: { id: string; label: string }[]
  basePath: string
  param?: string
}) {
  const sp = useSearchParams()
  const current = sp.get(param) || 'all'
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
      {items.map((it) => {
        const params = new URLSearchParams(sp.toString())
        if (it.id === 'all') params.delete(param)
        else params.set(param, it.id)
        const qs = params.toString()
        return (
          <Link key={it.id} href={qs ? `${basePath}?${qs}` : basePath} className={cn('chip', current === it.id && 'chip-active')}>
            {it.label}
          </Link>
        )
      })}
    </div>
  )
}
