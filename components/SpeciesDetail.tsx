import Link from 'next/link'
import { notFound } from 'next/navigation'
import SmartImage from './SmartImage'
import { licenseFor } from '@/data/seed/media-licenses'
import { imageGapFor } from '@/data/seed/image-gaps'
import PostCard from './PostCard'
import SpeciesCard from './SpeciesCard'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { iucnInfo, extraConservationNote, toBn, bnDate } from '@/lib/utils'
import { speciesPath, typeLabel, isCetaceanOrMarine, isBatSpecies } from '@/lib/categories'
import SpeciesActions from '@/components/SpeciesActions'
import SpeciesSections from '@/components/SpeciesSections'
import { IucnSpeciesCard } from '@/components/IucnGuide'
import { UNVERIFIED_REASONS } from '@/data/seed/verification'
import SpeciesVideoEmbed, { type VideoEmbed } from '@/components/SpeciesVideoEmbed'
import SpeciesGallery, { type GalleryItem } from '@/components/SpeciesGallery'
import CommonsPlaceMedia from '@/components/CommonsPlaceMedia'
import { DATA_STATUS_LABEL } from '@/lib/i18n'
import { MapPin, Utensils, Ruler, CalendarDays, Trees, BookOpen, Quote, Camera, Info, ExternalLink, Pencil } from 'lucide-react'
import type { Species, SpeciesType } from '@/lib/types'

export default async function SpeciesDetail({ slug, type }: { slug: string; type: SpeciesType }) {
  const repo = getRepo()
  const [s, session] = await Promise.all([repo.getSpecies(slug), getSession()])
  if (!s || (type && s.type !== type)) notFound()
  const canEdit = !!session && ['admin', 'super_admin', 'editor'].includes(session.role)

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
  /** §12 — নথিভুক্ত ফাঁক: ছবি পাওয়া যায়নি এমন প্রজাতির কারণ স্পষ্ট করে বলা */
  const gap = s.image ? undefined : imageGapFor(s.slug)
  const status = iucnInfo(s.conservation)
  const extraConsNote = extraConservationNote(s.conservation, s.conservationBn)
  const showIucn = type === 'prani' || type === 'udbhid' || s.conservation !== 'NE'
  /** §12 — কপিরাইট-মুক্ত ভিডিও: ডাউনলোড না করে সরাসরি এম্বেড */
  const videos: VideoEmbed[] = (s.media || [])
    .filter((m) => m.kind === 'video' && m.url && (!m.verificationStatus || m.verificationStatus === 'verified'))
    .slice(0, 3)
    .map((m) => ({
      url: m.url,
      title: m.title || m.caption || `${s.nameBn} — ভিডিও`,
      credit: m.creator || m.credit,
      creatorUrl: m.creatorUrl,
      sourcePlatform: m.sourcePlatform,
      license: m.license,
      licenseUrl: m.licenseUrl,
      sourceUrl: m.sourceUrl,
      poster: m.poster,
    }))
  const base = type === 'prani' ? '/prani' : type === 'udbhid' ? '/udbhid' : type === 'sthan' ? '/sthan' : '/sahitto'

  const facts = [
    s.habitat && { icon: Trees, label: 'বাসস্থান', value: s.habitat },
    s.diet && { icon: Utensils, label: type === 'udbhid' ? 'পুষ্টি/ব্যবহার' : 'খাদ্য', value: s.diet },
    s.sizeOrHeight && {
      icon: Ruler,
      label: type === 'sthan' ? 'উচ্চতা/আয়তন' : type === 'udbhid' ? 'আকার/উচ্চতা' : 'আকার',
      value: s.sizeOrHeight,
    },
    s.season && { icon: CalendarDays, label: 'মৌসুম', value: s.season },
    s.whereToSee && { icon: MapPin, label: 'কোথায় দেখা যায়', value: s.whereToSee },
    s.reproduction && { icon: Info, label: 'প্রজনন', value: s.reproduction },
  ].filter(Boolean) as { icon: any; label: string; value: string }[]

  /* একীভূত গ্যালারি — প্রধান ছবি + গ্যালারির ছবি + যাচাইকৃত মিডিয়া ছবি (সূত্রসহ), ডুপ্লিকেট বাদ */
  const galleryItems: GalleryItem[] = []
  {
    const seen = new Set<string>()
    const push = (item: GalleryItem) => {
      const key = (item.src || '').trim()
      if (!key || seen.has(key)) return
      seen.add(key)
      galleryItems.push(item)
    }
    if (s.image) {
      const isIllustration = type === 'sthan' && s.image.startsWith('/illustrations/landscapes/')
      push({
        src: s.image,
        credit: lic?.credit || undefined,
        license: lic?.verified ? lic.license : undefined,
        licenseUrl: lic?.licenseUrl,
        sourceUrl: lic?.source || undefined,
        licenseVerified: !!lic?.verified,
        note: isIllustration
          ? 'প্রতিনিধিত্বমূলক ইলাস্ট্রেশন—এই স্থানের নির্দিষ্ট ছবি নিচের Commons গ্যালারিতে দেখুন।'
          : lic && !lic.verified
            ? lic.note || 'মূল ফটোগ্রাফারের নাম ও সুনির্দিষ্ট লাইসেন্স যাচাই প্রক্রিয়াধীন'
            : undefined,
        noteTone: lic && !lic.verified && !isIllustration ? 'amber' : 'plain',
        creditsLink: !!(lic && !lic.verified),
      })
    }
    for (const g of s.gallery || []) push({ src: g })
    for (const m of s.media || []) {
      if (m.kind !== 'image' || m.verificationStatus !== 'verified') continue
      const src = m.directMediaUrl || m.url
      if (!src || !m.sourceUrl || !m.license || !m.licenseUrl) continue
      push({
        src,
        caption: m.title || m.caption,
        credit: m.creator || m.credit,
        creditUrl: m.creatorUrl,
        license: m.license,
        licenseUrl: m.licenseUrl,
        sourceUrl: m.sourceUrl,
        licenseVerified: true,
        pexels: m.sourcePlatform === 'pexels',
      })
    }
  }
  const gallery = galleryItems.slice(0, 12)

  const allImages = gallery.map((g) => g.src)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'prani' ? 'Animal' : 'Plant',
    name: s.nameBn,
    alternateName: [s.nameEn, ...(s.otherNames || [])].filter(Boolean),
    scientificName: s.scientificName,
    description: s.summary,
    image: allImages.length > 1 ? allImages : allImages[0] || undefined,
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
          <SpeciesGallery
            items={gallery}
            name={s.nameBn}
            fallbackKind={type === 'udbhid' ? 'udbhid' : type === 'sthan' ? 'sthan' : type === 'sahitto' ? 'sahitto' : 'prani'}
          />
          {!s.image && gap && (
            <p className="mt-1.5 text-[11px] leading-relaxed text-black/50">
              <span className="font-semibold text-black/70">কোনো মুক্ত-লাইসেন্স ছবি পাওয়া যায়নি:</span>{' '}
              {gap.reason}{' '}
              <a href="/share" className="text-forest-700 hover:underline">
                আপনার কাছে ছবি থাকলে শেয়ার করুন
              </a>
            </p>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-800">{s.category}</span>
            {isCetaceanOrMarine(s) && (
              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
                🌊 সামুদ্রিক স্তন্যপায়ী (Cetacea)
              </span>
            )}
            {isBatSpecies(s) && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
                🦇 উড়ন্ত স্তন্যপায়ী (Chiroptera)
              </span>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-forest-900 sm:text-4xl">{s.nameBn}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-sm italic text-black/55">{s.scientificName}</p>
            {canEdit && (
              <Link
                href={`/admin/species/${s.slug}`}
                className="btn-outline shrink-0 px-2.5 py-1 text-[11px]"
                aria-label={`${s.nameBn} প্রজাতির তথ্য সম্পাদনা`}
              >
                <Pencil size={12} /> সম্পাদনা
              </Link>
            )}
          </div>
          {s.nameEn && <p className="text-xs text-black/45">ইংরেজি: {s.nameEn}</p>}
          {!!s.otherNames?.length && (
            <p className="mt-1 text-xs text-black/45">অন্যান্য নাম: {s.otherNames.join(', ')}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {showIucn && (
              <a
                href="#iucn-status"
                title={`${status.code} — ${status.en}: ${status.detailBn}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-90 ${status.color}`}
              >
                <span className="font-extrabold">IUCN: {status.code}</span>
                <span>—</span>
                <span>{status.meaning}</span>
                <span className="opacity-75">({status.en})</span>
              </a>
            )}
            {showIucn && extraConsNote && (
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/65">{extraConsNote}</span>
            )}
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-black/80">{s.summary}</p>

          {isCetaceanOrMarine(s) && (
            <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50/70 p-3 text-xs leading-relaxed text-cyan-950">
              <b>বিজ্ঞান-তথ্য:</b> তিমি ও শুশুক জলে বসবাস করলেও এরা মাছ নয়। এরা উষ্ণ রক্তের স্তন্যপায়ী প্রাণী — ফুসফুস দিয়ে শ্বাস নেয়, বাতাসে ভেসে নিশ্বাস ফেলে এবং শাবককে বুকের দুধ পান করায়।
            </div>
          )}
          {isBatSpecies(s) && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-950">
              <b>বিজ্ঞান-তথ্য:</b> বাদুড় ডানায় ভর করে উড়লেও এটি পাখি নয়। এরা পৃথিবীর একমাত্র উড়তে সক্ষম স্তন্যপায়ী প্রাণী — ছানা প্রসব করে ও দুধ পান করিয়ে বড় করে।
            </div>
          )}

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

          {/* তথ্যের যাচাই অবস্থা — যাচাইকৃত হলে সবুজ নিশ্চিতকরণ, আর যাচাই করা না গেলে সুনির্দিষ্ট কারণ */}
          {(s.dataStatus || 'partial') === 'verified' ? (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-[11.5px] leading-relaxed text-emerald-950">
              <b>যাচাইকৃত রেকর্ড ✓</b> — বৈজ্ঞানিক নাম, শনাক্তকরণ বৈশিষ্ট্য, IUCN সংরক্ষণ অবস্থা ও প্রামাণ্য তথ্যসূত্র যাচাই করা হয়েছে
              {s.lastVerifiedAt ? ` (${bnDate(s.lastVerifiedAt)})` : ''}।
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-[11.5px] leading-relaxed text-amber-950">
              <b>
                কেন এই রেকর্ডটি একক প্রজাতি হিসেবে যাচাই করা যায়নি
                {UNVERIFIED_REASONS[s.slug]?.category ? ` (${UNVERIFIED_REASONS[s.slug].category})` : ''}:
              </b>{' '}
              {s.conflictingInfo ||
                UNVERIFIED_REASONS[s.slug]?.reason ||
                'নির্দিষ্ট দ্বিপদ বৈজ্ঞানিক নাম বা মাঠপর্যায়ের নিশ্চিত উপাত্তের অভাবে চূড়ান্ত যাচাই সম্পন্ন করা যায়নি।'}{' '}
              আপনার কাছে প্রামাণ্য তথ্য থাকলে <b>জেনো</b>-তে পাঠিয়ে দিন।
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

            {/* সম্পূর্ণ বিবরণ — বিষয়ভিত্তিক সেকশন (থাকলে) */}
            <div className="mt-6 space-y-6 border-t border-black/5 pt-5">
              <SpeciesSections s={s} />
            </div>
          </section>

          {/* কপিরাইট-মুক্ত ভিডিও — এম্বেড, ডাউনলোড নয় */}
          {!!videos.length && <SpeciesVideoEmbed videos={videos} />}
          {type === 'sthan' && <CommonsPlaceMedia slug={s.slug} name={s.nameBn} existingVideoUrls={videos.map((video) => video.url)} />}

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

          {s.taxonomy && Object.values(s.taxonomy).some(Boolean) && (
            <section className="card mt-4 p-5">
              <h2 className="mb-3 text-base font-bold text-forest-900">বৈজ্ঞানিক শ্রেণিবিন্যাস</h2>
              <dl className="divide-y divide-black/5 text-xs">
                {[
                  { label: 'রাজ্য (Kingdom)', val: s.taxonomy.kingdom },
                  { label: 'পর্ব (Phylum)', val: s.taxonomy.phylum },
                  { label: 'শ্রেণি (Class)', val: s.taxonomy.class },
                  { label: 'বর্গ (Order)', val: s.taxonomy.order },
                  { label: 'গোত্র (Family)', val: s.taxonomy.family },
                  { label: 'গণ (Genus)', val: s.taxonomy.genus, italic: true },
                  { label: 'প্রজাতি (Species)', val: s.taxonomy.species, italic: true },
                ]
                  .filter((r) => r.val)
                  .map((r) => (
                    <div key={r.label} className="flex items-center justify-between gap-2 py-1.5">
                      <dt className="text-black/55">{r.label}</dt>
                      <dd className={`font-semibold text-forest-900 ${r.italic ? 'italic' : ''}`}>{r.val}</dd>
                    </div>
                  ))}
              </dl>
            </section>
          )}

          {(type === 'prani' || type === 'udbhid') && (
            <IucnSpeciesCard
              s={s}
              conservation={s.conservation}
              conservationBn={s.conservationBn}
              type={type}
            />
          )}

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
