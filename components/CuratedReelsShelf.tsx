import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'
import { CURATED_REELS } from '@/lib/curated-reels'

export default function CuratedReelsShelf() {
  return (
    <section className="mt-6" aria-labelledby="channel-reels-title">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="channel-reels-title" className="section-title">
            রূপসী বাংলার মুক্ত প্রকৃতি-রিলস
          </h2>
          <p className="mt-1 text-xs text-black/55">
            বাইরের উন্মুক্ত-লাইসেন্স ভিডিও — প্রতিটির নির্মাতা, মূল উৎস ও লাইসেন্সের লিংক দেওয়া আছে।
          </p>
        </div>
        <Link href="/reels" className="shrink-0 text-sm font-semibold text-forest-700 hover:underline">
          সব রিলস দেখুন <ArrowUpRight size={14} className="inline" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CURATED_REELS.map((reel) => (
          <article key={reel.id} className="card overflow-hidden">
            <Link href={`/reels#${reel.id}`} className="group block">
              <div className="relative aspect-video overflow-hidden bg-black">
                {/* Wikimedia Commons provides this video preview; the original clip stays hosted there too. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reel.thumbUrl}
                  alt={reel.title || 'প্রকৃতির ভিডিওর থাম্বনেইল'}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white">
                  <Play size={11} fill="currentColor" /> রিল দেখুন
                </span>
              </div>
              <div className="p-3 pb-2">
                <h3 className="line-clamp-1 text-sm font-bold text-forest-900">{reel.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-black/60">{reel.body}</p>
              </div>
            </Link>
            {reel.curatedAttribution && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-black/5 px-3 py-2 text-[10px] text-black/55">
                <span>ক্রেডিট: {reel.curatedAttribution.credit}</span>
                <a
                  href={reel.curatedAttribution.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-forest-700 underline decoration-dotted underline-offset-2"
                >
                  মূল উৎস
                </a>
                <a
                  href={reel.curatedAttribution.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-forest-700 underline decoration-dotted underline-offset-2"
                >
                  {reel.curatedAttribution.license}
                </a>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
