import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

export function toBn(n: number | string): string {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)])
}

export function compactBn(n: number): string {
  if (n >= 100000) return toBn(Math.round(n / 1000)) + 'K'
  if (n >= 1000) return toBn((n / 1000).toFixed(1).replace('.0', '')) + 'K'
  return toBn(n)
}

export function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[\u09E6-\u09EF]/g, (d) => String(d.charCodeAt(0) - 0x09e6))
    .replace(/[\s_/\\]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return base || 'item-' + Math.random().toString(36).slice(2, 8)
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

const MONTHS_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর',
]

export function bnDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${toBn(d.getDate())} ${MONTHS_BN[d.getMonth()]} ${toBn(d.getFullYear())}`
}

export function timeAgoBn(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diff = Math.max(0, Date.now() - then)
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'এইমাত্র'
  if (min < 60) return `${toBn(min)} মিনিট আগে`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${toBn(hr)} ঘণ্টা আগে`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${toBn(day)} দিন আগে`
  const mon = Math.floor(day / 30)
  if (mon < 12) return `${toBn(mon)} মাস আগে`
  return `${toBn(Math.floor(mon / 12))} বছর আগে`
}

export function excerpt(text: string, len = 140): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim()
  return clean.length > len ? clean.slice(0, len) + '…' : clean
}

export const IUCN: Record<string, { label: string; short: string; color: string }> = {
  EX: { label: 'বিলুপ্ত', short: 'EX', color: 'bg-black text-white' },
  EW: { label: 'বনে বিলুপ্ত', short: 'EW', color: 'bg-zinc-800 text-white' },
  CR: { label: 'মহাবিপন্ন', short: 'CR', color: 'bg-red-700 text-white' },
  EN: { label: 'বিপন্ন', short: 'EN', color: 'bg-orange-600 text-white' },
  VU: { label: 'সংকটাপন্ন', short: 'VU', color: 'bg-amber-500 text-white' },
  NT: { label: 'সংকট-নিকটবর্তী', short: 'NT', color: 'bg-yellow-600 text-white' },
  LC: { label: 'ন্যূনতম বিপদগ্রস্ত', short: 'LC', color: 'bg-emerald-600 text-white' },
  DD: { label: 'তথ্য-স্বল্পতা', short: 'DD', color: 'bg-slate-500 text-white' },
  NE: { label: 'মূল্যায়িত নয়', short: 'NE', color: 'bg-slate-400 text-white' },
}

export const CATEGORY_ICON: Record<string, string> = {
  পাখি: 'bird',
  স্তন্যপায়ী: 'paw',
  সরীসৃপ: 'reptile',
  উভচর: 'frog',
  মাছ: 'fish',
  পতঙ্গ: 'bug',
  'বন গাছ': 'tree',
  'ফল গাছ': 'apple',
  'ফুল গাছ': 'flower',
  'ঔষধি গাছ': 'leaf',
  'জলজ উদ্ভিদ': 'water',
  'ম্যানগ্রোভ': 'mangrove',
  'তাল-জাতীয়': 'palm',
  'বট-জাতীয়': 'fig',
  'ঘাস-জাতীয়': 'grass',
  ফসল: 'wheat',
}

export const POST_CATEGORIES = [
  { id: 'all', label: 'সব' },
  { id: 'prani', label: 'প্রাণী' },
  { id: 'udbhid', label: 'উদ্ভিদ' },
  { id: 'grambangla', label: 'গ্রামবাংলা' },
  { id: 'manush', label: 'মানুষ' },
] as const
