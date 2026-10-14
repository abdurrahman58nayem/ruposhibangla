import Link from 'next/link'
import { notFound } from 'next/navigation'
import SmartImage from './SmartImage'
import { licenseFor } from '@/data/seed/media-licenses'
import PostCard from './PostCard'
import SpeciesCard from './SpeciesCard'
import { getRepo } from '@/lib/repo'
import { IUCN, toBn, bnDate } from '@/lib/utils'
import { speciesPath, typeLabel } from '@/lib/categories'
import SpeciesActions from '@/components/SpeciesActions'
import { DATA_STATUS_LABEL } from '@/lib/i18n'
import { MapPin, Utensils, Ruler, CalendarDays, Trees, BookOpen, Quote, Camera, Info, ExternalLink } from 'lucide-react'
import type { Species, SpeciesType } from '@/lib/types'

export default async function SpeciesDetail({ slug, type }: { slug: string; type: SpeciesType }) {
  const repo = getRepo()
  const s = await repo.getSpecies(slug)
  if (!s || (type && s.type !== type)) notFound()

  try {
    await repo.bumpSpeciesViews(slug)
  } catch {
    /* ignore */
  }

  const [related, relatedPosts, settings] = await Promise.all([
    repo.listSpecies({ type, category: s.category, limit: 5 }),
    repo.listPosts({ status: 'approved', speciesSlug: slug, limit: 6 }),
    repo.getSettings(),
  ])
  const relatedSpecies = related.filter((x) => x.slug !== s.slug).slice(0, 4)
  const lic = licenseFor(s.image)
  const status = IUCN[s.conservation] || IUCN.NE
  const base = type === 'prani' ? '/prani' : type === 'udbhid' ? '/udbhid' : type === 'sthan' ? '/sthan' : '/sahitto'

  const facts = [
    s.habitat && { icon: Trees, label: 'বাসস্থান', value: s.habitat },
    s.diet && { icon: Utensils, label: type === 'udbhid' ? 'পুষ্টি/ব্যবহার' : 'খাদ্য', value: s.diet },
    s.sizeOrHeight && { icon: Ruler, label: type === 'udbhid' ? 'আকার/উচ্চতা' : 'আকার', value: s.sizeOrHeight },
    s.season && { icon: CalendarDays, label: 'মৌসুম', value: s.season },
    s.whereToSee && { icon: MapPin, label: 'কোথায় দেখা যায়', value: s.whereToSee },
    s.reproduction && { icon: Info, label: 'প্রজনন', value: s.reproduction },
  ].filter(Boolean) as { icon: any; label: string; value: string }[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'prani' ? 'Animal' : 'Plant',
    name: s.nameBn,
    alternateName: [s.nameEn, ...(s.otherNames || [])].filter(Boolean),
    scientificName: s.scientificName,
    description: s.summary,
    image: s.image ? undefined : undefined,
    url: `/${type}/${s.slug}`,
  }

  return (
    <article className="pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="container-pb pt-4 text-xs text-black/50">
        <Link href="/" className="hover:text-forest-700">হোম</Link>
        <span className="mx-1">/</span>
        <Link href={base} className="hover:text-forest-700">{type === 'prani' ? 'প্রাণী' : 'উদ্ভিদ'}</Link>
        <span className="mx-1">/</span>
        <Link href={`${base}?cat=${encodeURIComponent(s.category)}`} className="hover:text-forest-700">{s.category}</Link>
        <span className="mx-1">/</span>
        <span className="text-black/70">{s.nameBn}</span>
      </nav>

      {/* Hero */}
      <div className="container-pb mt-3 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SmartImage
            src={s.image}
            alt={s.nameBn}
            fallbackLabel={s.nameBn}
            fallbackKind={type === 'udbhid' ? 'udbhid' : 'prani'}
            width={900}
            height={640}
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="aspect-[3/2] w-full rounded-2xl"
          />
          {lic && (
            <p className="mt-1.5 text-[11px] leading-relaxed text-black/45">
              {lic.verified ? (
                <>
                  ছবির ক্রেডিট: {lic.credit || 'অজানা'}{' '}
                  {lic.source ? (
                    <a href={lic.source} target="_blank" rel="noreferrer" className="text-forest-700 hover:underline">
                      উৎস
                    </a>
                  ) : null}{' '}
                  · লাইসেন্স: {lic.license}
                </>
              ) : (
                <>
                  এই ছবির উৎস ও লাইসেন্স যাচাই করা বাকি —{' '}
                  <a href="/credits" className="text-forest-700 hover:underline">
                    মিডিয়া ক্রেডিট তালিকা
                  </a>{' '}
                  দেখুন
                </>
              )}
            </p>
          )}
          {!!s.gallery?.length && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {s.gallery.slice(0, 4).map((g, i) => (
                <SmartImage
                  key={i}
                  src={g}
                  alt={`${s.nameBn} — ছবি ${i + 1}`}
                  fallbackLabel={s.nameBn}
                  fallbackKind={type === 'udbhid' ? 'udbhid' : 'prani'}
                  width={200}
                  height={150}
                  className="aspect-square w-full rounded-xl"
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-800">{s.category}</span>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-forest-900 sm:text-4xl">{s.nameBn}</h1>
          <p className="mt-1 text-sm italic text-black/55">{s.scientificName}</p>
          {s.nameEn && <p className="text-xs text-black/45">ইংরেজি: {s.nameEn}</p>}
          {!!s.otherNames?.length && (
            <p className="mt-1 text-xs text-black/45">অন্যান্য নাম: {s.otherNames.join(', ')}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
              সংরক্ষণ: {status.label} ({status.short})
            </span>
            {s.conservationBn && (
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/60">{s.conservationBn}</span>
            )}
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                (s.dataStatus || 'partial') === 'verified'
                  ? 'bg-emerald-100 text-emerald-800'
                  : (s.dataStatus || 'partial') === 'identity_uncertain'
                    ? 'bg-red-100 text-red-700'
                    : (s.dataStatus || 'partial') === 'needs_correction'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-amber-100 text-amber-800'
              }`}
              title={s.conflictingInfo || undefined}
            >
              তথ্য: {DATA_STATUS_LABEL[s.dataStatus || 'partial']?.bn}
            </span>
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-black/80">{s.summary}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={`/share?species=${s.slug}`} className="btn-primary text-sm">
              <Camera size={15} /> এই প্রজাতির ছবি শেয়ার করুন
            </Link>
            <Link href="/ai" className="btn-outline text-sm">
              এআইকে জিজ্ঞেস করুন
            </Link>
            <Link href={`/jeno?species=${s.slug}`} className="btn-outline text-sm">
              ভুল-ত্রুটি জানান
            </Link>
          </div>

          <div className="mt-3">
            <SpeciesActions slug={s.slug} title={s.nameBn} />
          </div>

          {/* তথ্য অসম্পূর্ণ হলে স্পষ্টভাবে জানানো */}
          {(s.dataStatus || 'partial') !== 'verified' && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-[11px] leading-relaxed text-amber-900">
              <b>এই রেকর্ডের তথ্য এখনো অসম্পূর্ণ।</b>{' '}
              {s.conflictingInfo || 'আরও নির্ভরযোগ্য উৎস যোগ করে ধাপে ধাপে পূর্ণ করা হবে।'} আপনার কাছে তথ্য
              থাকলে <b>জেনো</b>-তে পাঠিয়ে দিন।
            </div>
          )}
        </div>
      </div>

      {/* Facts + description */}
      <div className="container-pb mt-8 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <section className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-forest-900">
              <BookOpen size={18} /> বিস্তারিত পরিচয়
            </h2>
            <div className="prose-bn">{s.description}</div>
          </section>

          {!!s.poetViews?.length && (
            <section id="kobi" className="card mt-4 scroll-mt-24 p-5">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-forest-900">
                <Quote size={18} className="text-earth-500" /> কবির চোখে {s.nameBn}
              </h2>
              <div className="space-y-4">
                {s.poetViews.map((pv, i) => (
                  <blockquote key={i} className="rounded-xl bg-earth-50/60 p-4">
                    <p className="text-sm font-semibold text-forest-900">
                      {pv.poet}
                      {pv.work && <span className="ml-2 text-xs font-normal italic text-black/50">— {pv.work}</span>}
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-black/75">{pv.note}</p>
                    {pv.needsReview && (
                      <p className="mt-2 text-[11px] text-amber-700">* এই তথ্য যাচাইয়ের অপেক্ষায় আছে</p>
                    )}
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          {!!s.sources?.length && (
            <section className="card mt-4 p-5">
              <h2 className="mb-3 text-base font-bold text-forest-900">তথ্যসূত্র</h2>
              <ul className="space-y-1.5 text-sm">
                {s.sources.map((src, i) => (
                  <li key={i}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-forest-700 hover:underline"
                    >
                      <ExternalLink size={13} /> {src.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="lg:col-span-2">
          <section className="card p-5">
            <h2 className="mb-3 text-base font-bold text-forest-900">এক নজরে</h2>
            <dl className="space-y-3">
              {facts.map((f, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-700">
                    <f.icon size={14} />
                  </span>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-black/45">{f.label}</dt>
                    <dd className="text-[13px] leading-relaxed text-black/75">{f.value}</dd>
                  </div>
                </div>
              ))}
              {!!s.colorTags?.length && (
                <div className="flex gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-700">
                    <Info size={14} />
                  </span>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-black/45">প্রধান রং</dt>
                    <dd className="flex flex-wrap gap-1 pt-0.5">
                      {s.colorTags.map((c) => (
                        <span key={c} className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] text-black/65">
                          {c}
                        </span>
                      ))}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </section>

          {relatedSpecies.length > 0 && (
            <section className="card mt-4 p-5">
              <h2 className="mb-3 text-base font-bold text-forest-900">একই বিভাগে আরও</h2>
              <div className="space-y-2">
                {relatedSpecies.map((r) => (
                  <Link
                    key={r.slug}
                    href={`${r.type === 'prani' ? '/prani' : '/udbhid'}/${r.slug}`}
                    className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-forest-50"
                  >
                    <SmartImage
                      src={r.image}
                      alt={r.nameBn}
                      fallbackLabel={r.nameBn}
                      fallbackKind={r.type === 'udbhid' ? 'udbhid' : 'prani'}
                      width={80}
                      height={80}
                      className="h-14 w-14 shrink-0 rounded-lg"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-forest-900">{r.nameBn}</span>
                      <span className="block truncate text-[11px] italic text-black/45">{r.scientificName}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      {/* Community posts */}
      <section className="container-pb mt-8">
        <div className="mb-3 flex items-end justify-between gap-4">
          <h2 className="section-title"> সম্প্রদায়ের ছবি ও মতামত</h2>
          <Link href={`/share?species=${s.slug}`} className="shrink-0 text-sm font-medium text-forest-700 hover:underline">
            শেয়ার করুন
          </Link>
        </div>
        {relatedPosts.items.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.items.map((p) => (
              <PostCard key={p.id} post={p} dense />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-sm text-black/50">
            এই প্রজাতির কোনো ছবি এখনো শেয়ার করা হয়নি।{' '}
            <Link href={`/share?species=${s.slug}`} className="font-medium text-forest-700 hover:underline">
              প্রথমটি আপনি দিন
            </Link>
            !
          </div>
        )}
      </section>

      <p className="container-pb mt-8 text-[11px] text-black/35">
        সর্বশেষ হালনাগাদ: {s.updatedAt ? bnDate(s.updatedAt) : '—'} · দর্শন: {toBn(s.views || 0)} · {settings.siteName}
      </p>
    </article>
  )
}
