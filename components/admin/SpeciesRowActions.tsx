'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

export default function SpeciesRowActions({ slug, editHref }: { slug: string; editHref: string }) {
  const router = useRouter()

  async function remove() {
    if (!confirm('সত্যিই মুছতে চান?')) return
    await fetch(`/api/species/${slug}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <>
      <Link href={editHref} className="rounded-full bg-forest-50 px-3 py-1 text-[11px] font-medium text-forest-800 hover:bg-forest-100">
        সম্পাদনা
      </Link>
      <button onClick={remove} className="rounded-full p-2 text-black/40 hover:bg-red-50 hover:text-red-600" title="মুছুন">
        <Trash2 size={14} />
      </button>
    </>
  )
}
