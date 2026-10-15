import Link from 'next/link'
import CategoryRail from '@/components/CategoryRail'
import { ArrowRight, Sparkles, Camera, Bird, Leaf, Map, Quote, Newspaper } from 'lucide-react'
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
    href: '/gyan?type=sthan&group=pahar',
    image: '/illustrations/landscapes/forest-placeholder.jpg',
    title: 'বন ও ম্যানগ্রোভ',
    note: 'সুন্দরবন, রাতারগুল ও দেশের বনাঞ্চল',
  },
  {
    href: '/gyan?type=sthan&group=pahar',
    image: '/illustrations/landscapes/hills-placeholder.jpg',
    title: 'পাহাড়ি অঞ্চল',
    note: 'রাঙামাটি, কাপ্তাই ও পাহাড়ি বাস্তুতন্ত্র',
  },
]

const CHIPS = [
  { href: '/prani?cat=পাখি', label: 'পাখি' },
  { href: '/prani?cat=স্তন্যপায়ী', label: 'স্তন্যপায়ী' },
  { href: '/prani?cat=সরীসৃপ', label: 'সরীসৃপ' },
  { href: '/prani?cat=মাছ', label: 'মাছ' },
  { href: '/udbhid?cat=ফল গাছ', label: 'ফল গাছ' },
  { href: '/udbhid?cat=বন গাছ', label: 'বন গাছ' },
  { href: '/udbhid?cat=ম্যানগ্রোভ', label: 'ম্যানগ্রোভ' },
  { href: '/udbhid?cat=ফুল গাছ', label: 'ফুল গাছ' },
  { href: '/udbhid?cat=ঔষধি গাছ', label: 'ঔষধি' },
  { href: '/grambangla', label: 'গ্রামবাংলা' },
]

export default async function HomePage() {
  const repo = getRepo()
  const [settings, stats, featured, news, feed, poetSpecies] = await Promise.all([
    repo.getSettings(),
    repo.stats(),
    repo.listSpecies({ featured: true, limit: 8 }),
    repo.listNews({ publishedOnly: true, limit: 3 }),
    buildFeedPage({ limit: 12, withSpecies: true }),
    repo.listSpecies({ limit: 200 }),
  ])

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
              <Map size={14} className="mr-1 inline" /> গ্রামবাংলা
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
                <dd className="text-2xl font-bold">{toBn(s.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- ১৭টি প্রধান ক্যাটাগরি ---------- */}
      <section className="container-pb mt-8">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-forest-900">জীববৈচিত্র্যের ক্যাটাগরি</h2>
          <Link href="/categories" className="text-xs font-semibold text-forest-700 hover:underline">
            সব ক্যাটাগরি →
          </Link>
        </div>
        <CategoryRail />
      </section>

      {/* ---------- দ্রুত প্রবেশপথ ---------- */}
      <section className="container-pb mt-4">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {CHIPS.map((c) => (
            <Link key={c.href} href={c.href} className="chip">
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Featured species ---------- */}
      <section className="container-pb mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">আজকের নির্বাচিত প্রজাতি</h2>
            <p className="text-xs text-black/50">বাংলাদেশের সবচেয়ে বেশি খোঁজা প্রাণী ও উদ্ভিদ</p>
          </div>
          <Link href="/prani" className="shrink-0 text-sm font-medium text-forest-700 hover:underline">
            সব দেখুন <ArrowRight size={14} className="inline" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {featured.slice(0, 8).map((s) => (
            <SpeciesCard key={s.slug} s={s} />
          ))}
        </div>
      </section>

      {/* ---------- নদী, বন, পাহাড়: অস্থায়ী ধারণামূলক ছবি ---------- */}
      <section className="container-pb mt-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="section-title">নদী, বন ও পাহাড়</h2>
            <p className="mt-1 text-xs text-black/50">
              অস্থায়ী AI-তৈরি ধারণামূলক ছবি — নির্দিষ্ট স্থানের নথিভুক্ত ছবি নয়; পরে আপনার বাস্তব ছবি দিয়ে বদলানো যাবে।
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
                alt={`${place.title} — অস্থায়ী ধারণামূলক ছবি`}
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
                <span className="mt-2 inline-block rounded-full bg-forest-50 px-2 py-0.5 text-[10px] font-medium text-forest-700">
                  AI-তৈরি অস্থায়ী ছবি
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Feed ---------- */}
      <section className="container-pb mt-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">প্রকৃতির স্রোত</h2>
            <p className="text-xs text-black/50">স্ক্রল করুন — মাঝে মাঝে প্রজাতির তথ্যও চলে আসবে</p>
          </div>
          <Link href="/feed" className="shrink-0 text-sm font-medium text-forest-700 hover:underline">
            ফিড <ArrowRight size={14} className="inline" />
          </Link>
        </div>
        <Feed initialItems={feed.items as any} initialCursor={feed.nextCursor} query={{}} />
      </section>

      {/* ---------- Poets ---------- */}
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

      {/* ---------- News ---------- */}
      {news.length > 0 && (
        <section className="container-pb mt-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <Newspaper size={18} className="text-forest-600" /> প্রকৃতির খবর
              </h2>
              <p className="text-xs text-black/50">জীববৈচিত্র্য ও পরিবেশের সর্বশেষ খবর</p>
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
                  <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-forest-900">{n.title}</h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-black/60">{n.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- CTA ---------- */}
      <section className="container-pb mt-12">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-forest-600 to-forest-900 p-6 text-white sm:p-10">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold sm:text-3xl">আপনার ক্যামেরায় ধরা প্রকৃতি — শেয়ার করুন</h2>
              <p className="mt-2 max-w-xl text-sm text-white/80">
                বাগানের দোয়েল হোক কিংবা গ্রামের পুকুর — ছবি বা ভিডিও আপলোড করুন, লিখুন আপনার গল্প। অ্যাকাউন্ট না থাকলেও
                শুধু নাম দিয়েই শেয়ার করা যায়।
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/share" className="btn-gold">
                <Camera size={16} /> ছবি শেয়ার করুন
              </Link>
              <Link href="/jeno" className="btn bg-white/10 text-white backdrop-blur hover:bg-white/20">
                তথ্য জানান
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
