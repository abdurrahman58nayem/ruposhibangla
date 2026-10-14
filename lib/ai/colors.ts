/** ছবির প্রধান রং থেকে বাংলা রঙের নাম বের করা (লোকাল ইমেজ ম্যাচিংয়ের জন্য) */

export type BnColor = {
  name: string
  h: number
  s: number
  l: number
}

export const BN_COLORS: BnColor[] = [
  { name: 'লাল', h: 0, s: 0.7, l: 0.45 },
  { name: 'কমলা', h: 28, s: 0.85, l: 0.55 },
  { name: 'হলুদ', h: 52, s: 0.85, l: 0.55 },
  { name: 'সোনালি', h: 42, s: 0.7, l: 0.5 },
  { name: 'সবুজ', h: 120, s: 0.55, l: 0.4 },
  { name: 'জলপাই', h: 80, s: 0.5, l: 0.35 },
  { name: 'নীল', h: 215, s: 0.7, l: 0.45 },
  { name: 'আকাশি', h: 197, s: 0.7, l: 0.6 },
  { name: 'বেগুনি', h: 280, s: 0.55, l: 0.5 },
  { name: 'গোলাপি', h: 340, s: 0.6, l: 0.7 },
  { name: 'বাদামি', h: 25, s: 0.55, l: 0.35 },
  { name: 'ধূসর', h: 210, s: 0.08, l: 0.5 },
  { name: 'সাদা', h: 0, s: 0.02, l: 0.9 },
  { name: 'কালো', h: 0, s: 0.05, l: 0.12 },
  { name: 'রূপালি', h: 210, s: 0.06, l: 0.75 },
]

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
    else if (max === g) h = ((b - r) / d + 2) * 60
    else h = ((r - g) / d + 4) * 60
  }
  return { h, s, l }
}

export function nearestBnColor(hex: string): string {
  const { h, s, l } = hexToHsl(hex)
  let best = BN_COLORS[0]
  let bestScore = Infinity
  for (const c of BN_COLORS) {
    const dh = Math.min(Math.abs(h - c.h), 360 - Math.abs(h - c.h)) / 180
    const score = dh * 1.6 + Math.abs(s - c.s) * 1.1 + Math.abs(l - c.l) * 1.4
    if (score < bestScore) {
      bestScore = score
      best = c
    }
  }
  return best.name
}

export function paletteToBnColors(palette: string[]): string[] {
  const out = new Set<string>()
  palette.forEach((hex) => out.add(nearestBnColor(hex)))
  return [...out]
}
