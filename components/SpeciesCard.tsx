import Link from 'next/link'
import SmartImage from './SmartImage'
import { IUCN } from '@/lib/utils'
import { speciesPath, categoryLabel } from '@/lib/categories'
import type { Species } from '@/lib/types'

export default function SpeciesCard({ s, compact = false }: { s: Species; compact?: boolean }) {
  const status = IUCN[s.conservation] || IUCN.NE
  const href = speciesPath(s)

  return (
    <Link href={href} className="card group block overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative">
        <SmartImage
          src={s.image}
          alt={s.nameBn}
          fallbackLabel={s.nameBn}
          fallbackKind={s.type === 'udbhid' ? 'udbhid' : s.type === 'sthan' ? 'sthan' : s.type === 'sahitto' ? 'sahitto' : 'prani'}
          width={600}
          height={400}
          sizes="(max-width: 640px) 50vw, 300px"
          className={compact ? 'aspect-[4/3] w-full' : 'aspect-[4/3] w-full'}
          imgClassName="transition duration-500 group-hover:scale-105"
        />
        <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
          {s.category || categoryLabel(s.group)}
        </span>
        {['CR', 'EN', 'VU'].includes(s.conservation) && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-semibold text-white">
            {status.short}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-[15px] font-bold leading-tight text-forest-900 group-hover:text-forest-700">{s.nameBn}</h3>
        <p className="mt-0.5 truncate text-[11px] italic text-black/50">{s.scientificName}</p>
        {!compact && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-black/60">{s.summary}</p>}
        <div className="mt-2 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.color}`}>{status.label}</span>
        </div>
      </div>
    </Link>
  )
}
