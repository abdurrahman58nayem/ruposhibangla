/**
 * রূপসী বাংলা — নিচের নেভিগেশনের ৬টি হাতে-আঁকা আইকন।
 *
 * CategoryIcon-এর মতোই ২৪-গ্রিডে আঁকা, একই স্ট্রোক-ওজন ও গোলাকার প্রান্ত।
 * রঙ বাংলাদেশের প্রকৃতি-ঐতিহ্যের প্যালেট থেকে:
 *   জ্ঞানভান্ডার → বন-সবুজ · ফিড → নদীর নীল · রিলস → ধান-সোনালি
 *   প্রোফাইল → লাল মাটি · এআই → শাপলা · সেটিংস → পাহাড়ের সবুজ-ধূসর
 */

export type NavKey = 'knowledge' | 'feed' | 'reels' | 'profile' | 'ai' | 'settings'

export const NAV_TONE: Record<NavKey, { from: string; to: string }> = {
  knowledge: { from: '#2E7D5B', to: '#1E4A35' },
  feed: { from: '#2E7FB8', to: '#12557F' },
  reels: { from: '#E0A62C', to: '#B5602B' },
  profile: { from: '#CC5F42', to: '#9C3A2B' },
  ai: { from: '#E0708F', to: '#B8456E' },
  settings: { from: '#5A7C6A', to: '#2F4A3C' },
}

type Props = {
  id: NavKey
  size?: number
  /** mono = currentColor, auto = ক্যাটাগরি গ্রেডিয়েন্ট */
  variant?: 'auto' | 'mono'
  strokeWidth?: number
  className?: string
}

let nuid = 0

export default function NavIcon({
  id,
  size = 22,
  variant = 'auto',
  strokeWidth = 1.8,
  className,
}: Props) {
  const t = NAV_TONE[id] ?? NAV_TONE.knowledge
  const gid = `nv-${id}-${(nuid = (nuid + 1) % 100000)}`
  const stroke = variant === 'mono' ? 'currentColor' : `url(#${gid})`

  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  }

  const grad =
    variant === 'auto' && (
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.from} />
          <stop offset="100%" stopColor={t.to} />
        </linearGradient>
      </defs>
    )

  switch (id) {
    /* ── জ্ঞানভান্ডার — খোলা বই + পাতার শিরা ─────────────── */
    case 'knowledge':
      return (
        <svg {...common}>
          {grad}
          <path d="M12 6.4c-1.7-1.1-3.9-1.6-6-1.6H4.4A1.4 1.4 0 0 0 3 6.2v11.2a1.4 1.4 0 0 0 1.4 1.4H6c2.1 0 4.3.5 6 1.6" />
          <path d="M12 6.4c1.7-1.1 3.9-1.6 6-1.6h1.6a1.4 1.4 0 0 1 1.4 1.4v11.2a1.4 1.4 0 0 1-1.4 1.4H18c-2.1 0-4.3.5-6 1.6" />
          <path d="M12 6.4v13.8" />
          <path d="M6.6 9.1h2.6M6.6 12h2.6M14.8 9.1h2.6M14.8 12h2.6" />
        </svg>
      )

    /* ── ফিড — পোস্টের স্তুপ + তরঙ্গ (নদীর ঢেউ) ───────────── */
    case 'feed':
      return (
        <svg {...common}>
          {grad}
          <rect x="3" y="4.4" width="18" height="15.2" rx="3" />
          <path d="M3 9.1h18" />
          <path d="M6.6 6.8h2.2M6.6 7.6h1.5" />
          <path d="M7.4 13.2c1.1 0 1.1 1.5 2.2 1.5s1.1-1.5 2.2-1.5 1.1 1.5 2.2 1.5 1.1-1.5 2.2-1.5" />
          <path d="M7.4 16.6c1.1 0 1.1 1.1 2.2 1.1s1.1-1.1 2.2-1.1 1.1 1.1 2.2 1.1 1.1-1.1 2.2-1.1" />
        </svg>
      )

    /* ── রিলস — উল্লম্ব স্ক্রিন + প্লে চিহ্ন ──────────────── */
    case 'reels':
      return (
        <svg {...common}>
          {grad}
          <rect x="4.6" y="2.8" width="14.8" height="18.4" rx="3.6" />
          <path d="M4.6 8.6h14.8M4.6 15.4h14.8" />
          <path d="M10.7 10.6l3.5 2.1-3.5 2.1z" fill={stroke} stroke="none" />
        </svg>
      )

    /* ── প্রোফাইল — মানুষ (মাথা + কাঁধ) ───────────────────── */
    case 'profile':
      return (
        <svg {...common}>
          {grad}
          <circle cx="12" cy="8.2" r="3.7" />
          <path d="M4.9 20.4c0-3.4 3.2-5.9 7.1-5.9s7.1 2.5 7.1 5.9" />
        </svg>
      )

    /* ── এআই — তারকা/স্পার্ক + বুদ্ধির জালি ────────────────── */
    case 'ai':
      return (
        <svg {...common}>
          {grad}
          <path d="M12 2.9l1.9 5.1 5.1 1.9-5.1 1.9L12 16.9l-1.9-5.1L5 9.9l5.1-1.9z" />
          <path d="M18.4 16.1l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8z" />
          <circle cx="5.6" cy="17.4" r="1.15" />
          <circle cx="8.4" cy="20.2" r="0.9" />
        </svg>
      )

    /* ── সেটিংস — গিয়ার + কেন্দ্রের ছিদ্র ─────────────────── */
    case 'settings':
      return (
        <svg {...common}>
          {grad}
          <circle cx="12" cy="12" r="3.1" />
          <path d="M12 2.6v2.4M12 19v2.4M4.4 12H2M22 12h-2.4M6.3 6.3L4.6 4.6M19.4 19.4l-1.7-1.7M17.7 6.3l1.7-1.7M4.6 19.4l1.7-1.7" />
          <circle cx="12" cy="12" r="7.4" />
        </svg>
      )

    default:
      return <svg {...common}>{grad}</svg>
  }
}
