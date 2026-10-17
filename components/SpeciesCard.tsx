import Link from 'next/link'
import SmartImage from './SmartImage'
import { iucnInfo } from '@/lib/utils'
import { speciesPath, categoryLabel } from '@/lib/categories'
import { UNVERIFIED_REASONS } from '@/data/seed/verification'
import type { Species } from '@/lib/types'
import CategoryIcon, { toneOf } from '@/components/icons/CategoryIcon'

export default function SpeciesCard({ s, compact = false }: { s: Species; compact?: boolean }) {
  const status = iucnInfo(s.conservation)
  const href = speciesPath(s)
  const tone = toneOf(s.group)
  const showIucn = s.type === 'prani' || s.type === 'udbhid' || s.conservation !== 'NE'
  const isVerified = (s.dataStatus || 'partial') === 'verified'
  const unverifiedMeta = UNVERIFIED_REASONS[s.slug]
  const unverifiedReason = s.conflictingInfo || unverifiedMeta?.reason || 'তথ্য যাচাই প্রক্রিয়াধীন'

  return (
    <Link
      href={href}
      className="card group block overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      style={{ borderTop: `2px solid ${tone.from}` }}
    >
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
        <span
          className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white shadow-sm backdrop-blur"
          style={{ backgroundImage: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }}
        >
          <CategoryIcon id={s.group} size={12} variant="mono" strokeWidth={2.1} />
          {s.category || categoryLabel(s.group)}
        </span>
        {showIucn && (status.threatened || status.code === 'EW' || status.code === 'EX') && (
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm ${status.color}`}
            title={`${status.code} — ${status.en}: ${status.meaning}`}
          >
            {status.code} · {status.meaning}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-display text-[16px] font-bold leading-tight text-forest-900 group-hover:text-forest-700">
          {s.nameBn}
        </h3>
        <p className="mt-0.5 truncate text-[11.5px] italic text-black/50">{s.scientificName}</p>
        {!compact && <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-black/65">{s.summary}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {showIucn && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${status.color}`}
              title={`${status.code} — ${status.en}: ${status.meaning}`}
            >
              <span className="font-extrabold">{status.code}</span>
              <span>·</span>
              <span>{status.meaning}</span>
            </span>
          )}
          {isVerified ? (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800"
              title="বৈজ্ঞানিক নাম, IUCN সংরক্ষণ অবস্থা ও তথ্যসূত্র যাচাইকৃত"
            >
              যাচাইকৃত ✓
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900"
              title={`কেন যাচাই করা যায়নি: ${unverifiedReason}`}
            >
              যাচাই করা যায়নি · {unverifiedMeta?.category || 'কারণ দেখুন'}
            </span>
          )}
        </div>
        {!compact && !isVerified && (
          <p className="mt-1.5 line-clamp-2 rounded-lg bg-amber-50/90 px-2 py-1 text-[11px] leading-snug text-amber-950 ring-1 ring-amber-200/80">
            <b>কারণ:</b> {unverifiedReason}
          </p>
        )}
      </div>
    </Link>
  )
}
