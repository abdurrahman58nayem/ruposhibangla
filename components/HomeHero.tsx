'use client'

import Link from 'next/link'
import { Bird, Leaf, Map as MapIcon, Sparkles } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import { useApp } from '@/components/Providers'
import { toBn } from '@/lib/utils'

/**
 * প্রথম পর্দার হিরো — ভাষা বদলালে সঙ্গে সঙ্গে বদলায়।
 *
 * সংখ্যাগুলো সার্ভার থেকেই আসে (স্ট্যাটস একবার হিসাব হয়), শুধু লেখা
 * ক্লায়েন্টে অনুবাদ হয়। বৈজ্ঞানিক নাম কখনো অনুবাদ হয় না — সে নিয়ম
 * এখানেও অটুট।
 */
export default function HomeHero({
  tagline,
  stats,
}: {
  tagline: string
  stats: { species: number; birds: number; plants: number; posts: number }
}) {
  const { lang } = useApp()
  const bn = lang === 'bn'

  const tiles = [
    { label: bn ? 'প্রজাতির তথ্য' : 'Species records', value: stats.species },
    { label: bn ? 'পাখি' : 'Birds', value: stats.birds },
    { label: bn ? 'উদ্ভিদ' : 'Plants', value: stats.plants },
    { label: bn ? 'শেয়ার করা ছবি' : 'Shared photos', value: stats.posts },
  ]

  return (
    <section className="hero-pattern relative overflow-hidden">
      <div className="absolute inset-0 opacity-25 [background-image:url('/seed/village/paddy-2.jpg')] bg-cover bg-center mix-blend-overlay" />
      <div className="container-pb relative py-12 text-white sm:py-16">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
          <Leaf size={13} /> {tagline}
        </p>
        <h1 className="text-balance text-3xl font-bold leading-tight sm:text-5xl">
          {bn ? (
            <>
              বাংলাদেশের প্রাণী, পাখি আর গাছপালার
              <br className="hidden sm:block" /> <span className="text-earth-300">সব খোঁজ এক জায়গায়</span>
            </>
          ) : (
            <>
              Every animal, bird and plant of Bangladesh
              <br className="hidden sm:block" /> <span className="text-earth-300">in one place</span>
            </>
          )}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
          {bn
            ? `${toBn(stats.species)}+ প্রজাতির তথ্যভাণ্ডার, গ্রামবাংলার ছবি, কবির চোখে প্রকৃতি আর আপনার নিজের তোলা ছবি শেয়ারের জায়গা — সব মিলিয়ে একটাই ঠিকানা।`
            : `Species records, photographs of village life, nature through poets' eyes and a place to share your own pictures — all at one address.`}
        </p>

        <div className="mt-6 max-w-2xl">
          <SearchBar />
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-xs sm:text-sm">
          <Link href="/prani" className="rounded-full bg-white/10 px-4 py-2 font-medium backdrop-blur transition hover:bg-white/20">
            <Bird size={14} className="mr-1 inline" /> {bn ? 'প্রাণী' : 'Animals'}
          </Link>
          <Link href="/udbhid" className="rounded-full bg-white/10 px-4 py-2 font-medium backdrop-blur transition hover:bg-white/20">
            <Leaf size={14} className="mr-1 inline" /> {bn ? 'উদ্ভিদ' : 'Plants'}
          </Link>
          <Link href="/grambangla" className="rounded-full bg-white/10 px-4 py-2 font-medium backdrop-blur transition hover:bg-white/20">
            <MapIcon size={14} className="mr-1 inline" /> {bn ? 'গ্রামবাংলা' : 'Village life'}
          </Link>
          <Link href="/ai" className="rounded-full bg-earth-400 px-4 py-2 font-medium text-white transition hover:bg-earth-500">
            <Sparkles size={14} className="mr-1 inline" /> {bn ? 'এআই সহচর' : 'AI companion'}
          </Link>
        </div>

        <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <dt className="text-[11px] text-white/70">{s.label}</dt>
              <dd className="num text-2xl font-bold">{toBn(s.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
