import Link from 'next/link'
import PortalCategoryGrid from '@/components/PortalCategoryGrid'
import { ArrowRight, Sparkles, Camera, Bird, Leaf, Map as MapIcon, Quote, Newspaper } from 'lucide-react'
import Feed from '@/components/Feed'
import SpeciesCard from '@/components/SpeciesCard'
import SmartImage from '@/components/SmartImage'
import SearchBar from '@/components/SearchBar'
import { getRepo } from '@/lib/repo'
import { buildFeedPage } from '@/lib/feed'
import { toBn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const PLACE_HIGHLIGHTS = [
  {
    href: '/gyan?type=sthan&group=nadi',
    image: '/illustrations/landscapes/river-placeholder.jpg',
    title: 'নদী ও জলাভূমি',
    note: 'পদ্মা, মেঘনা, হাওর ও বাংলার জলজ জীবন',
  },
  {
    href: '/sthan?cat=বনাঞ্চল',
    image: '/illustrations/landscapes/forest-placeholder.jpg',
    title: 'বন ও ম্যানগ্রোভ',
    note: 'সুন্দরবন, রাতারগুল ও দেশের বনাঞ্চল',
  },
  {
    href: '/sthan?cat=পাহাড়',
    image: '/illustrations/landscapes/hills-placeholder.jpg',
    title: 'পাহাড়ি অঞ্চল',
    note: 'রাঙামাটি, কাপ্তাই ও পাহাড়ি বাস্তুতন্ত্র',
  },
]

const ICONIC_FEATURED_SLUGS = [
  'bagh',
  'nil-timi',
  'doyel',
  'ilish',
  'shushuk',
  'nona-kumir',
  'shundori',
  'shapla',
]

export default async function HomePage() {
  const repo = getRepo()
  const [settings, stats, allFeatured, news, feed, poetSpecies] = await Promise.all([
    repo.getSettings(),
    repo.stats(),
    repo.listSpecies({ featured: true, limit: 50 }),
    repo.listNews({ publishedOnly: true, limit: 3 }),
    buildFeedPage({ limit: 12, withSpecies: true }),
    repo.listSpecies({ limit: 200 }),
  ])

  // বাংলাদেশের বিভিন্ন দলের বিশিষ্ট প্রজাতিগুলো সামনে রাখা — পাখি, বাঘ, তিমি, শুশুক, মাছ ও ফুল
  const iconicMap = new Map(allFeatured.map((s) => [s.slug, s]))
  const curatedFeatured = ICONIC_FEATURED_SLUGS.map((slug) => iconicMap.get(slug)).filter(Boolean) as typeof allFeatured
  for (const s of allFeatured) {
    if (curatedFeatured.length >= 8) break
    if (!curatedFeatured.some((c) => c.slug === s.slug)) curatedFeatured.push(s)
  }

  const poetEntries = poetSpecies
    .flatMap((s) => (s.poetViews || []).map((pv) => ({ s, pv })))
    .slice(0, 3)

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="hero-pattern relative overflow-hidden">
        <div className="absolute inset-0 opacity-25 [background-image:url('/seed/village/paddy-2.jpg')] bg-cover bg-center mix-blend-overlay" />
        <div className="container-pb relative py-12 text-white sm:py-16">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Leaf size={13} /> {settings.tagline}
          </p>
          <h1 className="text-balance text-3xl font-bold leading-tight sm:text-5xl">
            বাংলাদেশের প্রাণী, পাখি আর গাছপালার
            <br className="hidden sm:block" /> <span className="text-earth-300">সব খোঁজ এক জায়গায়</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {toBn(stats.species)}+ প্রজাতির তথ্যভাণ্ডার, গ্রামবাংলার ছবি, কবির চোখে প্রকৃতি আর আপনার নিজের তোলা ছবি শেয়ারের জায়গা —
            সব মিলিয়ে একটাই ঠিকানা।
          </p>

          <div className="mt-6 max-w-2xl">
            <SearchBar />
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs sm:text-sm">
            <Link href="/prani" className="rounded-full bg-white/10 px-4 py-2 font-medium backdrop-blur transition hover:bg-white/20">
              <Bird size={14} className="mr-1 inline" /> প্রাণী
            </Link>
            <Link href="/udbhid" className="rounded-full bg-white/10 px-4 py-2 font-medium backdrop-blur transition hover:bg-white/20">
              <Leaf size={14} className="mr-1 inline" /> উদ্ভিদ
            </Link>
            <Link href="/grambangla" className="rounded-full bg-white/10 px-4 py-2 font-medium backdrop-blur transition hover:bg-white/20">
              <MapIcon size={14} className="mr-1 inline" /> গ্রামবাংলা
            </Link>
            <Link href="/ai" className="rounded-full bg-earth-400 px-4 py-2 font-medium text-white transition hover:bg-earth-500">
              <Sparkles size={14} className="mr-1 inline" /> এআই সহচর
            </Link>
          </div>

          <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'প্রজাতির তথ্য', value: stats.species },
              { label: 'পাখি', value: stats.birds },
              { label: 'উদ্ভিদ', value: stats.plants },
              { label: 'শেয়ার করা ছবি', value: stats.posts },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                <dt className="text-[11px] text-white/70">{s.label}</dt>
                <dd className="num text-2xl font-bold">{toBn(s.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- ১০টি প্রধান বিভাগ — সাবক্যাটাগরির সংক্ষিপ্ত সূচি ---------- */}
      <section className="container-pb mt-6 sm:mt-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div><h2 className="text-base font-bold text-forest-900 sm:text-lg">কী খুঁজছেন?</h2><p className="text-xs text-black/50">প্রাণী থেকে গ্রামবাংলা—সব বিভাগ ও দ্রুত সাবক্যাটাগরি</p></div>
          <Link href="/categories" className="shrink-0 text-xs font-semibold text-forest-700 hover:underline">সব বিভাগ <ArrowRight size={13} className="ml-1 inline" /></Link>
        </div>
        <PortalCategoryGrid compact />
      </section>

      {/* ---------- Featured species (বাঘ, তিমি, দোয়েল, ইলিশ, সুন্দরী, শাপলা) ---------- */}
      <section className="container-pb mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">আজকের নির্বাচিত প্রজাতি</h2>
            <p className="text-xs text-black/50">বাংলাদেশের বাঘ, নীল তিমি, দোয়েল, ইলিশ ও অন্যান্য বিশেষ জীববৈচিত্র্য</p>
          </div>
          <Link href="/prani" className="shrink-0 text-sm font-medium text-forest-700 hover:underline">
            সব দেখুন <ArrowRight size={14} className="inline" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {curatedFeatured.slice(0, 8).map((s) => (
            <SpeciesCard key={s.slug} s={s} />
          ))}
        </div>
      </section>

      {/* ---------- প্রকৃতির স্রোত (Feed) — কমিউনিটি ও প্রজাতির মেলবন্ধন ---------- */}
      <section className="container-pb mt-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">প্রকৃতির স্রোত</h2>
            <p className="text-xs text-black/50">স্ক্রল করুন — কমিউনিটির শেয়ার করা ছবি ও প্রজাতির জীবন্ত রূপ</p>
          </div>
          <Link href="/feed" className="shrink-0 text-sm font-medium text-forest-700 hover:underline">
            ফিড <ArrowRight size={14} className="inline" />
          </Link>
        </div>
        <Feed initialItems={feed.items as any} initialCursor={feed.nextCursor} query={{}} />
      </section>

      {/* ---------- সাম্প্রতিক প্রকৃতির খবর ---------- */}
      {news.length > 0 && (
        <section className="container-pb mt-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <Newspaper size={18} className="text-forest-600" /> প্রকৃতির খবর
              </h2>
              <p className="text-xs text-black/50">জীববৈচিত্র্য ও পরিবেশ সংরক্ষণের সর্বশেষ খবর</p>
            </div>
            <Link href="/khobor" className="shrink-0 text-sm font-medium text-forest-700 hover:underline">
              সব খবর <ArrowRight size={14} className="inline" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {news.map((n) => (
              <Link key={n.id} href={`/khobor/${n.slug}`} className="card group overflow-hidden">
                <SmartImage
                  src={n.cover}
                  alt={n.title}
                  fallbackKind="gram"
                  fallbackLabel="প্রকৃতির খবর"
                  width={500}
                  height={280}
                  className="aspect-[16/9] w-full"
                  imgClassName="transition duration-500 group-hover:scale-105"
                />
                <div className="p-4">
                  <span className="rounded-full bg-forest-50 px-2 py-0.5 text-[10px] font-medium text-forest-700">
                    {n.kind === 'conservation' ? 'সংরক্ষণ' : n.kind === 'research' ? 'গবেষণা' : n.tags?.[0] || 'সংবাদ'}
                  </span>
                  <h3 className="mt-2 text-sm font-bold leading-snug text-forest-900 group-hover:text-forest-700">
                    {n.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-black/60">{n.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- গ্রামবাংলার ছবি ---------- */}
      <section className="container-pb mt-12">
        <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="section-title">গ্রামবাংলার চোখে দেখা</h2><p className="text-xs text-black/50">মাঠ, উঠান, নৌকা আর মানুষের দৈনন্দিন জীবন</p></div><Link href="/grambangla" className="shrink-0 text-xs font-semibold text-forest-700 hover:underline">সব ছবি <ArrowRight size={13} className="ml-1 inline"/></Link></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { src: '/seed/village/paddy-1.jpg', label: 'ধানখেত ও ফসলের মাঠ' },
            { src: '/seed/village/homestead.jpg', label: 'গ্রামীণ বাড়ি ও উঠান' },
            { src: '/seed/village/nouka.jpg', label: 'নদীপাড় ও নৌকার ঘাট' },
            { src: '/seed/village/haat.jpg', label: 'হাটবাজার ও লোকজ জীবন' },
          ].map((photo) => <Link key={photo.src} href="/grambangla" className="card group overflow-hidden">
            <SmartImage src={photo.src} alt={photo.label} width={480} height={320} className="aspect-[4/3] w-full" imgClassName="transition duration-500 group-hover:scale-105" />
            <p className="p-2.5 text-xs font-semibold text-forest-900">{photo.label}</p>
          </Link>)}
        </div>
      </section>

      {/* ---------- কবির চোখে প্রকৃতি ---------- */}
      {poetEntries.length > 0 && (
        <section className="container-pb mt-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <Quote size={18} className="text-earth-500" /> কবির চোখে প্রকৃতি
              </h2>
              <p className="text-xs text-black/50">কবিরা কীভাবে দেখেছেন আমাদের পাখি, ফুল আর জন্তুজানোয়ার</p>
            </div>
            <Link href="/kobirchokhe" className="shrink-0 text-sm font-medium text-forest-700 hover:underline">
              সব <ArrowRight size={14} className="inline" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {poetEntries.map(({ s, pv }, i) => (
              <Link
                key={`${s.slug}-${i}`}
                href={(s.type === 'prani' ? `/prani/${s.slug}` : `/udbhid/${s.slug}`) + '#kobi'}
                className="card p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-forest-600">{pv.poet}</p>
                <p className="mt-1 text-sm font-bold text-forest-900">{s.nameBn}</p>
                <p className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-black/65">{pv.note}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- নদী, বন ও পাহাড়ের বাস্তুতন্ত্র ---------- */}
      <section className="container-pb mt-12">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="section-title">নদী, বন ও পাহাড়ি বাস্তুতন্ত্র</h2>
            <p className="mt-1 text-xs text-black/50">
              পদ্মা, সুন্দরবন ও পার্বত্য চট্টগ্রামের প্রাকৃতিক পরিবেশ
            </p>
          </div>
          <Link href="/gyan?type=sthan" className="shrink-0 text-xs font-semibold text-forest-700 hover:underline">
            সব স্থান <ArrowRight size={13} className="inline" />
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {PLACE_HIGHLIGHTS.map((place) => (
            <Link key={place.title} href={place.href} className="card group w-[78%] shrink-0 overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto">
              <SmartImage
                src={place.image}
                alt={`${place.title} — বাংলার প্রকৃতি`}
                width={720}
                height={405}
                unoptimized
                sizes="(max-width: 640px) 78vw, 33vw"
                className="aspect-[16/9] w-full"
                imgClassName="transition duration-500 group-hover:scale-105"
              />
              <div className="p-3">
                <h3 className="text-sm font-bold text-forest-900">{place.title}</h3>
                <p className="mt-0.5 text-xs text-black/60">{place.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- সংরক্ষণ ও দায়িত্বশীল ভ্রমণ ---------- */}
      <section className="container-pb mt-12">
        <Link href="/songrokkhon" className="group flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-5 transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="max-w-2xl"><span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">জীববৈচিত্র্য ও সংরক্ষণ</span><h2 className="mt-1 text-lg font-bold text-forest-900 sm:text-xl">জানুন, দেখুন, সংরক্ষণে পাশে থাকুন</h2><p className="mt-1 text-xs leading-relaxed text-black/55">বিপন্ন প্রজাতি, সংরক্ষিত বন, বৈজ্ঞানিক তথ্য ও যাচাই-অবস্থা—তথ্যসূত্রসহ দেখুন।</p></div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-xs font-semibold text-white group-hover:bg-forest-900">সংরক্ষণ বিভাগ <ArrowRight size={14}/></span>
        </Link>
      </section>

      {/* ---------- রূপসী বাংলায় অবদান রাখুন ---------- */}
      <section className="container-pb mt-12 mb-4">
        <div className="rounded-3xl bg-gradient-to-r from-forest-800 to-forest-900 p-6 text-white sm:p-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
              <Camera size={13} /> উন্মুক্ত জীববৈচিত্র্য আর্কাইভ
            </span>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">আপনার তোলা ছবি ও ভিডিও দিয়ে রূপসী বাংলাকে সমৃদ্ধ করুন</h2>
            <p className="mt-2 text-sm text-white/80">
              আপনার উঠোনের দোয়েল, ছাদের টুনটুনি কিংবা সুন্দরবনের বাঘ — যেকোনো ছবি মুক্ত লাইসেন্সে যুক্ত করুন আমাদের আর্কাইভে।
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/share" className="btn-primary bg-white text-forest-900 hover:bg-white/90">
                ছবি শেয়ার করুন
              </Link>
              <Link href="/jeno" className="btn-outline border-white/30 text-white hover:bg-white/10">
                নতুন তথ্য জানান
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
