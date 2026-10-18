import Link from 'next/link'
import { Images } from 'lucide-react'
import SmartImage from './SmartImage'
import { iucnInfo, toBn } from '@/lib/utils'
import { speciesPath, categoryLabel } from '@/lib/categories'
import type { Species } from '@/lib/types'
import CategoryIcon, { toneOf } from '@/components/icons/CategoryIcon'

export default function SpeciesCard({ s, compact = false }: { s: Species; compact?: boolean }) {
  const status = iucnInfo(s.conservation)
  const href = speciesPath(s)
  const tone = toneOf(s.group)
  const showIucn = s.type === 'prani' || s.type === 'udbhid' || s.conservation !== 'NE'
  /** IUCN স্ট্যাটাস যেন কার্ডে একবারই দেখায় — ঝুঁকিপূর্ণ প্রজাতির জন্য ছবির উপরে ব্যাজ,
   *  বাকিদের জন্য নিচের চিপ; দুই জায়গায় একসাথে কখনও নয়। */
  const overlayIucn =
    showIucn && (status.threatened || status.code === 'EW' || status.code === 'EX')
  const chipIucn = showIucn && !overlayIucn
  /** মোট ছবি — প্রধান + গ্যালারি + যাচাইকৃত মিডিয়া (ডুপ্লিকেট বাদ) */
  const photoUrls = new Set<string>()
  if (s.image) photoUrls.add(s.image)
  for (const g of s.gallery || []) if (g) photoUrls.add(g)
  for (const m of s.media || []) {
    if (m.kind === 'image' && m.verificationStatus === 'verified' && (m.directMediaUrl || m.url)) {
      photoUrls.add(m.directMediaUrl || m.url)
    }
  }
  const photoCount = photoUrls.size

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
        {s.type === 'sthan' && s.image?.startsWith('/illustrations/landscapes/') && (
          <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur">
            প্রতিনিধিত্বমূলক ইলাস্ট্রেশন
          </span>
        )}
        {photoCount > 1 && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
            <Images size={11} /> {toBn(photoCount)}টি ছবি
          </span>
        )}
        {overlayIucn && (
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
          {chipIucn && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${status.color}`}
              title={`${status.code} — ${status.en}: ${status.meaning}`}
            >
              <span className="font-extrabold">{status.code}</span>
              <span>·</span>
              <span>{status.meaning}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
