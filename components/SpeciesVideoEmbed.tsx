/**
 * কপিরাইট-মুক্ত ভিডিও এম্বেড — ডাউনলোড করে আপলোড না করে, উৎসের লিংক থেকেই চলে।
 *
 * দুই ধরনের উৎস সমর্থিত:
 *  1. সরাসরি ফাইল (Wikimedia Commons / Internet Archive — CC লাইসেন্স) → <video>
 *  2. YouTube / Commons embed পেইজ → <iframe>
 *
 * প্রতিটি ভিডিওর নিচে ক্রেডিট ও লাইসেন্স দেখানো বাধ্যতামূলক (§12)।
 * পিক্সাবে-স্টাইলে "কোনো ভিডিও পাওয়া যায়নি" অবস্থায় কিছুই রেন্ডার হয় না।
 */

export type VideoEmbed = {
  /** সরাসরি ফাইলের URL (webm/mp4) অথবা embed পেইজের URL */
  url: string
  title: string
  credit?: string
  license?: string
  licenseUrl?: string
  sourceUrl?: string
  poster?: string
}

const YT_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
/** ল্যান্ডস্কেপ ভিডিও (YouTube watch / সরাসরি ফাইল) — 16:9; শর্টস ও রিলস 9:16 */
function isLandscape(url: string, yt: RegExpMatchArray | null): boolean {
  if (/\/shorts\//.test(url)) return false
  if (yt) return !/\/shorts\//.test(url)
  return /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i.test(url)
}
/** Wikimedia Commons এর embed প্লেয়ার */
const COMMONS_EMBED_RE = /^https?:\/\/commons\.wikimedia\.org\/wiki\/(File:.+)$/

function asDirectVideo(url: string): boolean {
  return /\.(webm|mp4|ogv|ogg|mov|m4v)(\?.*)?$/i.test(url)
}

export default function SpeciesVideoEmbed({ videos }: { videos: VideoEmbed[] }) {
  const list = (videos || []).filter((v) => v.url)
  if (!list.length) return null

  return (
    <section className="card mt-4 overflow-hidden">
      <h2 className="flex items-center gap-2 border-b border-black/5 px-5 py-3 font-display text-base font-bold text-forest-900">
        <span
          aria-hidden
          className="grid h-6 w-6 place-items-center rounded-md"
          style={{ backgroundImage: 'linear-gradient(135deg,#E0A62C,#B5602B)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff" aria-hidden>
            <path d="M8 5.6v12.8L19 12z" />
          </svg>
        </span>
        ভিডিও
      </h2>

      <div className="space-y-4 p-5">
        {list.map((v, i) => {
          const yt = v.url.match(YT_RE)
          const commons = v.url.match(COMMONS_EMBED_RE)

          return (
            <figure key={i} className="overflow-hidden rounded-xl bg-black/95">
              <div
                className={`relative mx-auto bg-black ${
                  isLandscape(v.url, yt) ? 'aspect-video w-full' : 'aspect-[9/16] w-full max-w-sm'
                }`}
              >
                {asDirectVideo(v.url) ? (
                  <video
                    className="h-full w-full object-contain"
                    controls
                    preload="metadata"
                    poster={v.poster}
                    playsInline
                  >
                    <source src={v.url} />
                    আপনার ব্রাউজার এই ভিডিওটি চালাতে পারছে না।
                  </video>
                ) : yt ? (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : commons ? (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://commons.wikimedia.org/wiki/${encodeURIComponent(decodeURIComponent(commons[1]))}?embedplayer=yes`}
                    title={v.title}
                    loading="lazy"
                    allowFullScreen
                  />
                ) : (
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-full place-items-center text-sm text-white/80 hover:text-white"
                  >
                    ভিডিওটি উৎসে দেখুন →
                  </a>
                )}
              </div>

              <figcaption className="bg-black/80 px-3 py-2 text-[11px] leading-relaxed text-white/70">
                <span className="font-medium text-white/90">{v.title}</span>
                {v.credit && <> · ক্রেডিট: {v.credit}</>}
                {v.license && (
                  <>
                    {' '}
                    · লাইসেন্স:{' '}
                    {v.licenseUrl ? (
                      <a href={v.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-white">
                        {v.license}
                      </a>
                    ) : v.license}
                  </>
                )}
                {v.sourceUrl && (
                  <>
                    {' '}
                    ·{' '}
                    <a
                      href={v.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dotted hover:text-white"
                    >
                      উৎস
                    </a>
                  </>
                )}
                {' · '}
                <a href="/reels" className="underline decoration-dotted hover:text-white">
                  রিলসে পূর্ণপর্দায় দেখুন
                </a>
              </figcaption>
            </figure>
          )
        })}

        <p className="text-[11px] leading-relaxed text-black/45">
          ভিডিওগুলো আমাদের সার্ভারে আপলোড করা হয় না — কপিরাইট-মুক্ত উৎস (Wikimedia Commons, Internet Archive)
          থেকে সরাসরি এম্বেড করা হয়। ক্রেডিট ও লাইসেন্স প্রতিটি ভিডিওর সাথেই দেওয়া আছে।
        </p>
      </div>
    </section>
  )
}
