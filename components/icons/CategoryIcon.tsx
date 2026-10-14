import type { GroupId } from '@/lib/types'

/**
 * রূপসী বাংলা — হাতে-আঁকা প্রিমিয়াম আইকন সেট (১৭টি ক্যাটাগরি)।
 *
 * কালার গ্রেডিং বাংলাদেশের প্রকৃতি ও ঐতিহ্য থেকে নেওয়া:
 *   সুন্দরবনের সবুজ · পদ্মা-মেঘনার নীল · ধানখেতের সোনালি · লাল মাটি · শাপলা গোলাপি
 * প্রতিটি আইকনে `from` → `to` গ্রেডিয়েন্ট; `currentColor` ফলে থিম-অনুযায়ীও কাজ করে।
 */

export type Tone = { from: string; to: string; soft: string; ink: string }

/** ক্যাটাগরি অনুযায়ী রঙ — আইকন, চিপ, কার্ড-বর্ডার সবখানে একই টোন */
export const CATEGORY_TONE: Record<string, Tone> = {
  pranijogot: { from: '#2E7D5B', to: '#1E4A35', soft: '#E8F3EC', ink: '#1E4A35' },
  pakhi: { from: '#2E8FA8', to: '#125C6E', soft: '#E4F3F7', ink: '#125C6E' },
  machh: { from: '#1F8A9E', to: '#0E5468', soft: '#E1F2F6', ink: '#0E5468' },
  stanapayi: { from: '#A9713C', to: '#7A3C25', soft: '#F7EDE1', ink: '#7A3C25' },
  sarisrip: { from: '#4E8C3A', to: '#2F6B22', soft: '#ECF5E6', ink: '#2F6B22' },
  ubhochor: { from: '#5FA34A', to: '#3A6B1C', soft: '#EDF6E6', ink: '#3A6B1C' },
  kitpotongo: { from: '#DFA62C', to: '#B5602B', soft: '#FBF1D9', ink: '#8A4E12' },
  ameruddondi: { from: '#D1663F', to: '#9A3A22', soft: '#FBEDE6', ink: '#9A3A22' },
  udbhidful: { from: '#E0708F', to: '#B8456E', soft: '#FCEAF0', ink: '#B8456E' },
  gachhbon: { from: '#2B754F', to: '#123324', soft: '#E7F2EA', ink: '#123324' },
  chhatrak: { from: '#8A6FA8', to: '#5B4478', soft: '#F2EDF8', ink: '#5B4478' },
  onujib: { from: '#3FA7A0', to: '#1D6C68', soft: '#E3F4F3', ink: '#1D6C68' },
  nadi: { from: '#2E7FB8', to: '#12557F', soft: '#E5F0F9', ink: '#12557F' },
  pahar: { from: '#5A7C6A', to: '#2F4A3C', soft: '#ECF2EE', ink: '#2F4A3C' },
  grambangla: { from: '#E0A62C', to: '#B5602B', soft: '#FBF2DC', ink: '#8A5A12' },
  sahitto: { from: '#B04A4A', to: '#7A2A2A', soft: '#FAECEC', ink: '#7A2A2A' },
  songrokkhon: { from: '#3D9163', to: '#1E4A35', soft: '#E8F3EC', ink: '#1E4A35' },
}

export const DEFAULT_TONE: Tone = { from: '#3D9163', to: '#1E4A35', soft: '#E8F3EC', ink: '#1E4A35' }

export function toneOf(id?: string): Tone {
  return (id && CATEGORY_TONE[id]) || DEFAULT_TONE
}

/** ডার্ক মোডে আইকনের রঙ — গাঢ় পটে হালকা গ্রেডিয়েন্ট */
function darkPair(t: Tone): [string, string] {
  return [t.from, t.to]
}

type Props = {
  id: string
  className?: string
  /** 24 এর আকার — সব আইকন একই গ্রিডে আঁকা */
  size?: number
  /** mono = currentColor (চিপ/ন্যাভে), auto = ক্যাটাগরি গ্রেডিয়েন্ট */
  variant?: 'auto' | 'mono'
  strokeWidth?: number
}

let uid = 0

export default function CategoryIcon({ id, className = 'h-5 w-5', size = 24, variant = 'auto', strokeWidth = 1.75 }: Props) {
  const t = toneOf(id)
  const gid = `cg-${id}-${(uid = (uid + 1) % 100000)}`
  const [a, b] = darkPair(t)
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

  const grad = variant === 'auto' && (
    <defs>
      <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={a} />
        <stop offset="100%" stopColor={b} />
      </linearGradient>
    </defs>
  )

  switch (id) {
    /* ── প্রাণীজগৎ — পায়ের ছাপ ───────────────────────────── */
    case 'pranijogot':
      return (
        <svg {...common}>
          {grad}
          <ellipse cx="7.2" cy="8.6" rx="1.6" ry="2.1" />
          <ellipse cx="11.6" cy="7.2" rx="1.6" ry="2.1" />
          <ellipse cx="16" cy="8.6" rx="1.6" ry="2.1" />
          <path d="M5.4 14.2c0-2.2 1.7-3.6 3.9-3.6 1.3 0 2 .5 2.7.5s1.4-.5 2.7-.5c2.2 0 3.9 1.4 3.9 3.6 0 2.4-2 4.3-4.5 4.3-1.2 0-1.6-.4-2.1-.4s-.9.4-2.1.4c-2.5 0-4.5-1.9-4.5-4.3Z" />
        </svg>
      )

    /* ── পাখি ─────────────────────────────────────────── */
    case 'pakhi':
      return (
        <svg {...common}>
          {grad}
          <path d="M4.5 13.6c0-3.6 3-6.6 7-6.6 2.4 0 4.4 1 5.6 2.5l3.4-.8-1.5 3.2c.6 1 .9 2.1.9 3.3 0 3.6-3.2 6.3-7.4 6.3S4.5 17.2 4.5 13.6Z" />
          <path d="M12 7c0 2.2-1.6 4-3.6 4.4" />
          <path d="M19.5 8.7 21 13" />
          <circle cx="15.6" cy="12.4" r=".9" fill={stroke} stroke="none" />
        </svg>
      )

    /* ── মাছ ──────────────────────────────────────────── */
    case 'machh':
      return (
        <svg {...common}>
          {grad}
          <path d="M2.8 12c2.6-3.4 5.6-5.1 9-5.1 3.4 0 6.2 1.7 8.4 5.1-2.2 3.4-5 5.1-8.4 5.1-3.4 0-6.4-1.7-9-5.1Z" />
          <path d="M20.2 12c1 .9 1.7 1.7 2 2.7-.3 1-1 1.8-2 2.7" />
          <path d="M9.6 12.6c0 .9.6 1.6 1.3 1.6.5 0 .9-.3 1.1-.8l.8-2.6c.2-.8-.3-1.5-1-1.5-.9 0-1.6.7-1.8 1.9" />
          <path d="M12.8 14.6c1.5.6 3.2.8 4.9.5" />
          <circle cx="7.6" cy="10.9" r=".85" fill={stroke} stroke="none" />
        </svg>
      )

    /* ── স্তন্যপায়ী — হরিণের মাথা ─────────────────────────── */
    case 'stanapayi':
      return (
        <svg {...common}>
          {grad}
          <path d="M6.6 20c-1.3-2.8-.9-6.2.9-8.6 1.4-1.9 2.3-3.4 2.3-5.2 0-1.6.9-2.4 2.4-2.4s2.4.8 2.4 2.4c0 1.8.9 3.3 2.3 5.2 1.8 2.4 2.2 5.8.9 8.6" />
          <path d="M9.4 6.2 7.6 2.6" />
          <path d="M14.6 6.2 16.4 2.6" />
          <path d="M7.4 3.6c-.7-.6-1.6-.5-2 .2" />
          <path d="M16.6 3.6c.7-.6 1.6-.5 2 .2" />
          <circle cx="10.2" cy="11.6" r=".85" fill={stroke} stroke="none" />
          <circle cx="13.8" cy="11.6" r=".85" fill={stroke} stroke="none" />
          <path d="M10.6 15.6c.8.5 1.8.5 2.6 0" />
        </svg>
      )

    /* ── সরীসৃপ — কুণ্ডলী পাকানো সাপ ─────────────────────── */
    case 'sarisrip':
      return (
        <svg {...common}>
          {grad}
          <path d="M4.6 17.4c0-2.6 2.1-4.6 4.7-4.6h5.4c1.8 0 3.2-1.4 3.2-3.2s-1.4-3.2-3.2-3.2H9.3" />
          <path d="M4.6 17.4c0 2.6 2.1 4.6 4.7 4.6h4.2" />
          <path d="M11.6 4.6 9.3 6.4l2.3 1.8" />
          <path d="M18.6 13.2c1.2 0 2.2-1 2.2-2.2s-1-2.2-2.2-2.2" />
          <circle cx="16.4" cy="7.1" r=".8" fill={stroke} stroke="none" />
          <path d="M17.6 11.2c.9-.5 1.4-1.4 1.4-2.4" />
        </svg>
      )

    /* ── উভচর — ব্যাঙ ─────────────────────────────────── */
    case 'ubhochor':
      return (
        <svg {...common}>
          {grad}
          <path d="M12 3.6c2.4 0 4.3 1.9 4.3 4.3 0 2.3-1.8 4.2-4.1 4.3" />
          <path d="M7.9 11.9C5.6 11.8 3.8 9.9 3.8 7.7 3.8 5.4 5.7 3.6 8 3.6" />
          <path d="M3.8 21.4c0-2 1.6-3.6 3.6-3.6h9.2c2 0 3.6 1.6 3.6 3.6" />
          <path d="M7.4 17.8c-1.6 0-2.6-1.4-2.2-2.9.2-.8.9-1.4 1.7-1.5" />
          <path d="M16.6 17.8c1.6 0 2.6-1.4 2.2-2.9-.2-.8-.9-1.4-1.7-1.5" />
          <circle cx="9.6" cy="7.6" r=".95" fill={stroke} stroke="none" />
          <circle cx="14.4" cy="7.6" r=".95" fill={stroke} stroke="none" />
        </svg>
      )

    /* ── কীটপতঙ্গ — প্রজাপতি ─────────────────────────────── */
    case 'kitpotongo':
      return (
        <svg {...common}>
          {grad}
          <path d="M12 5.4v13.2" />
          <path d="M12 8.4C10 5.6 6.6 4.4 4.2 5.6 2.4 6.6 2.2 9.6 3.8 11.6c1.3 1.6 3.2 2 5.2 1.4" />
          <path d="M12 8.4c2-2.8 5.4-4 7.8-2.8 1.8 1 2 4 .4 6-1.3 1.6-3.2 2-5.2 1.4" />
          <path d="M9 13c-1.8 1.6-3 3.2-3 5.2 0 1.6 1.4 2.6 3.2 2.1 1.6-.4 2.6-2.2 2.8-4.5" />
          <path d="M15 13c1.8 1.6 3 3.2 3 5.2 0 1.6-1.4 2.6-3.2 2.1-1.6-.4-2.6-2.2-2.8-4.5" />
          <path d="M10.6 5.4c-.6-.8-.6-1.6 0-2.4" />
          <path d="M13.4 5.4c.6-.8.6-1.6 0-2.4" />
        </svg>
      )

    /* ── অমেরুদণ্ডী — কাঁকড়া/ঝিনুক ────────────────────────── */
    case 'ameruddondi':
      return (
        <svg {...common}>
          {grad}
          <path d="M12 4.2c4.4 0 7.8 3.4 7.8 7.6 0 2.6-1.3 4.6-3 6.1-.8.7-1.2 1.2-1.2 2.1v.6H8.4v-.6c0-.9-.4-1.4-1.2-2.1-1.7-1.5-3-3.5-3-6.1 0-4.2 3.4-7.6 7.8-7.6Z" />
          <path d="M4.4 12.4C3 12 2.2 11 2.4 9.8c.2-1.1 1.3-1.7 2.6-1.5" />
          <path d="M19.6 12.4c1.4-.4 2.2-1.4 2-2.6-.2-1.1-1.3-1.7-2.6-1.5" />
          <path d="M6.6 8.6 4.2 6.4" />
          <path d="M17.4 8.6 19.8 6.4" />
          <circle cx="9.8" cy="11" r=".85" fill={stroke} stroke="none" />
          <circle cx="14.2" cy="11" r=".85" fill={stroke} stroke="none" />
        </svg>
      )

    /* ── উদ্ভিদ ও ফুল — শাপলা ───────────────────────────── */
    case 'udbhidful':
      return (
        <svg {...common}>
          {grad}
          <path d="M12 20.4v-6.2" />
          <path d="M12 14.2c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4Z" />
          <path d="M12 6.2c-1.6-2-4.2-2.6-6.2-1.4-.4 2.4.6 4.8 3 5.8" />
          <path d="M12 6.2c1.6-2 4.2-2.6 6.2-1.4.4 2.4-.6 4.8-3 5.8" />
          <path d="M12 14.2c-2.4.6-4 2.6-4 5" />
          <path d="M12 14.2c2.4.6 4 2.6 4 5" />
          <circle cx="12" cy="10.2" r="1.5" />
        </svg>
      )

    /* ── গাছ ও বন ─────────────────────────────────────── */
    case 'gachhbon':
      return (
        <svg {...common}>
          {grad}
          <path d="M12 20.8v-6" />
          <path d="M12 15c-3.9 0-7-3-7-6.8C5 5.4 8.1 2.6 12 2.6s7 2.8 7 5.6c0 3.8-3.1 6.8-7 6.8Z" />
          <path d="M12 15c-2.2 0-4-1.6-4-3.6" />
          <path d="M12 15c2.2 0 4-1.6 4-3.6" />
          <path d="M9.4 20.8 7.6 17.6" />
          <path d="M14.6 20.8 16.4 17.6" />
        </svg>
      )

    /* ── ছত্রাক ও শৈবাল — মাশরুম ────────────────────────── */
    case 'chhatrak':
      return (
        <svg {...common}>
          {grad}
          <path d="M3.6 11.4C3.6 6.8 7.4 3.2 12 3.2s8.4 3.6 8.4 8.2c0 .9-.7 1.6-1.6 1.6H5.2c-.9 0-1.6-.7-1.6-1.6Z" />
          <path d="M9.2 14.8v2.4c0 1.6 1.2 2.8 2.8 2.8s2.8-1.2 2.8-2.8v-2.4" />
          <circle cx="9" cy="7.8" r="1.2" />
          <circle cx="14.6" cy="6.8" r=".9" />
          <circle cx="15.4" cy="10" r="1" />
        </svg>
      )

    /* ── অণুজীব ───────────────────────────────────────── */
    case 'onujib':
      return (
        <svg {...common}>
          {grad}
          <circle cx="12" cy="12" r="5.4" />
          <circle cx="10.2" cy="10.6" r="1.3" />
          <path d="M17.2 8.4 20 6" />
          <path d="M6.8 15.6 4 18" />
          <path d="M17.4 15.6 20.2 18" />
          <path d="M6.6 8.4 4 6" />
          <path d="M12 6.6V3.4" />
          <path d="M12 17.4v3.2" />
        </svg>
      )

    /* ── নদী ও জলাভূমি ─────────────────────────────────── */
    case 'nadi':
      return (
        <svg {...common}>
          {grad}
          <path d="M2.6 8.4c1.6-1.4 3.2-1.4 4.8 0s3.2 1.4 4.8 0 3.2-1.4 4.8 0 3.2 1.4 4.8 0" />
          <path d="M2.6 13c1.6-1.4 3.2-1.4 4.8 0s3.2 1.4 4.8 0 3.2-1.4 4.8 0 3.2 1.4 4.8 0" />
          <path d="M2.6 17.6c1.6-1.4 3.2-1.4 4.8 0s3.2 1.4 4.8 0 3.2-1.4 4.8 0 3.2 1.4 4.8 0" />
          <path d="M4.4 20.6c1.2-1 2.4-1 3.6 0" opacity=".55" />
          <path d="M16 20.6c1.2-1 2.4-1 3.6 0" opacity=".55" />
        </svg>
      )

    /* ── পাহাড় ও বনাঞ্চল ───────────────────────────────── */
    case 'pahar':
      return (
        <svg {...common}>
          {grad}
          <path d="M2.4 19.6 8.6 8.2l4 6.6 2.2-3.4 6.8 11.2Z" />
          <path d="M8.6 8.2l2.2 3.8" />
          <circle cx="17" cy="5.4" r="2.4" />
          <path d="M2.4 19.6h19.2" />
        </svg>
      )

    /* ── গ্রামবাংলা — খড়ের চালা ঘর ───────────────────────── */
    case 'grambangla':
      return (
        <svg {...common}>
          {grad}
          <path d="M2.8 11 12 3.4 21.2 11" />
          <path d="M5 9.6v10.8h14V9.6" />
          <path d="M9.4 20.4v-5.2h5.2v5.2" />
          <path d="M2.8 11h18.4" />
          <path d="M12 3.4V1.2" />
          <circle cx="12" cy="1.2" r=".6" fill={stroke} stroke="none" />
        </svg>
      )

    /* ── প্রকৃতি ও সাহিত্য — খোলা বই ─────────────────────── */
    case 'sahitto':
      return (
        <svg {...common}>
          {grad}
          <path d="M12 6.6C10.4 4.9 7.8 4 4.6 4v13.4c3.2 0 5.8.9 7.4 2.6 1.6-1.7 4.2-2.6 7.4-2.6V4c-3.2 0-5.8.9-7.4 2.6Z" />
          <path d="M12 6.6V20" />
          <path d="M6.8 8.2h3.4" opacity=".7" />
          <path d="M13.8 8.2h3.4" opacity=".7" />
        </svg>
      )

    /* ── পরিবেশ ও সংরক্ষণ — ঢালে পাতা ────────────────────── */
    case 'songrokkhon':
      return (
        <svg {...common}>
          {grad}
          <path d="M12 2.8 4.6 5.4v6c0 4.4 3 8.2 7.4 9.8 4.4-1.6 7.4-5.4 7.4-9.8v-6L12 2.8Z" />
          <path d="M12 8.4c0 3-2.2 5.4-5 6.2-.5-2.6 1.2-5.2 4-6.2Z" />
          <path d="M12 8.4c0 3 2.2 5.4 5 6.2.5-2.6-1.2-5.2-4-6.2Z" />
          <path d="M12 8.4v7.4" />
        </svg>
      )

    default:
      return (
        <svg {...common}>
          {grad}
          <circle cx="12" cy="12" r="8.6" />
          <path d="M12 7.4v5.2l3.4 2" />
        </svg>
      )
  }
}
