import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Conservation } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * সংখ্যা রূপান্তর — সংখ্যা যেন স্পষ্টভাবে পড়া যায় (UI):
 * লেখা বাংলায় থাকে, কিন্তু সংখ্যা ল্যাটিন অঙ্কে (0–9) দেখানো হয়,
 * আর globals.css-এর `.num` / 'RB Digits' ফন্ট অঙ্কগুলোকে আরও স্পষ্ট করে।
 * পুরনো বাংলা অঙ্ক (০–৯) চাইলে `toBnBengali` ব্যবহার করা যাবে।
 */
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

export function toBn(n: number | string): string {
  return String(n)
}

/** ঐচ্ছিক — পুরনো আচরণ: সংখ্যাকে বাংলা অঙ্কে দেখানো */
export function toBnBengali(n: number | string): string {
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

/* ------------------------------------------------------------------ */
/* IUCN Red List — চিহ্ন, শ্রেণিবিভাগ ও রঙ (Categories & Criteria v3.1)       */
/* ------------------------------------------------------------------ */
/**
 * উৎস: IUCN Red List Categories and Criteria, Version 3.1 (IUCN SSC, 2001)
 *       https://www.iucnredlist.org/resources/categories-and-criteria
 * রঙ:  IUCN-এর আনুষ্ঠানিক রঙের ধারণা রেখে, রূপসী বাংলার থিম (forest/earth/mati/kantha) অনুযায়ী
 *       প্রিমিয়াম-ভাইবে সাজানো হয়েছে — যেন ব্যাজগুলো সাইটের সাথে সামঞ্জস্যপূর্ণ দেখায়।
 *
 * ইংরেজি শ্রেণি, সংক্ষিপ্ত চিহ্ন (EX–NE) ও রঙ — IUCN-এর আনুষ্ঠানিক মানদণ্ড অনুযায়ী যাচাইকৃত।
 * মূল্যায়নটি বৈশ্বিক: প্রজাতির সারা পৃথিবীর অবস্থা ধরে হয় (বাংলাদেশের আঞ্চলিক অবস্থা আলাদা হতে পারে)।
 */
export type IUCNInfo = {
  /** আনুষ্ঠানিক চিহ্ন (EX, EW, CR, EN, VU, NT, LC, DD, NE) */
  code: Conservation
  /** পূর্ববর্তী কোডের সাথে সামঞ্জস্যের জন্য (`code`-এর সমান) */
  short: Conservation
  /** ব্যাজে দেখানো বাংলা অর্থ */
  label: string
  /** চিহ্নের পূর্ণ বাংলা অর্থ */
  meaning: string
  /** আনুষ্ঠানিক ইংরেজি শ্রেণি */
  en: string
  /** বাংলায় সংক্ষিপ্ত ব্যাখ্যা (IUCN v3.1 অনুযায়ী) */
  detailBn: string
  /** আনুষ্ঠানিক ইংরেজি ব্যাখ্যা (সংক্ষিপ্ত) */
  enDesc: string
  /** IUCN-এর আনুষ্ঠানিক রঙ (HEX) */
  hex: string
  /** ব্যাজের লেখার রঙ (কনট্রাস্টের জন্য) */
  on: 'light' | 'dark'
  /** Tailwind ক্লাস (ব্যাজ রেন্ডারিংয়ের জন্য) */
  color: string
  /** “বিপন্ন” (Threatened) শ্রেণি কি না — শুধু CR, EN ও VU */
  threatened: boolean
}

/** ঝুঁকির ক্রমানুসারে ৯টি শ্রেণি: সবচেয়ে বেশি ঝুঁকি (EX) → মূল্যায়ন বাকি (NE) */
export const IUCN_ORDER: Conservation[] = ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE']

export const IUCN: Record<string, IUCNInfo> = {
  EX: {
    code: 'EX',
    short: 'EX',
    label: 'পৃথিবী থেকে বিলুপ্ত',
    meaning: 'পৃথিবী থেকে বিলুপ্ত',
    en: 'Extinct',
    detailBn: 'সন্দেহাতীতভাবে প্রমাণিত যে পৃথিবীতে প্রজাতিটির শেষ জীবিত সদস্যটিও মারা গেছে।',
    enDesc: 'No reasonable doubt that the last individual has died.',
    hex: '#2b2733',
    on: 'light',
    color: 'bg-[#2b2733] text-white',
    threatened: false,
  },
  EW: {
    code: 'EW',
    short: 'EW',
    label: 'বন্য পরিবেশে বিলুপ্ত',
    meaning: 'বন্য পরিবেশে বিলুপ্ত',
    en: 'Extinct in the Wild',
    detailBn: 'প্রাকৃতিক বা বন্য আবাসে আর টিকে নেই; কেবল চাষাবাদে, বন্দিদশায় বা ঐতিহাসিক আবাসের বাইরে টিকে আছে।',
    enDesc: 'Survives only in cultivation, in captivity or as a naturalized population well outside its past range.',
    hex: '#4a2b3a',
    on: 'light',
    color: 'bg-[#4a2b3a] text-white',
    threatened: false,
  },
  CR: {
    code: 'CR',
    short: 'CR',
    label: 'অত্যন্ত সংকটাপন্ন',
    meaning: 'অত্যন্ত সংকটাপন্ন',
    en: 'Critically Endangered',
    detailBn: 'বন্য পরিবেশে বিলুপ্ত হওয়ার চরম ও অতি উচ্চ ঝুঁকির মুখে রয়েছে (IUCN মানদণ্ড A–E)।',
    enDesc: 'Facing an extremely high risk of extinction in the wild.',
    hex: '#8f2d2d',
    on: 'light',
    color: 'bg-[#8f2d2d] text-white',
    threatened: true,
  },
  EN: {
    code: 'EN',
    short: 'EN',
    label: 'বিপন্ন',
    meaning: 'বিপন্ন',
    en: 'Endangered',
    detailBn: 'বন্য পরিবেশে বিলুপ্ত হওয়ার খুব উচ্চ ঝুঁকির মুখে রয়েছে (IUCN মানদণ্ড A–E)।',
    enDesc: 'Facing a very high risk of extinction in the wild.',
    hex: '#b45f2c',
    on: 'light',
    color: 'bg-[#b45f2c] text-white',
    threatened: true,
  },
  VU: {
    code: 'VU',
    short: 'VU',
    label: 'ঝুঁকিপূর্ণ',
    meaning: 'ঝুঁকিপূর্ণ',
    en: 'Vulnerable',
    detailBn: 'বন্য পরিবেশে বিলুপ্ত হওয়ার উচ্চ ঝুঁকির মুখে রয়েছে (IUCN মানদণ্ড A–E)।',
    enDesc: 'Facing a high risk of extinction in the wild.',
    hex: '#c69334',
    on: 'dark',
    color: 'bg-[#c69334] text-[#2c2208]',
    threatened: true,
  },
  NT: {
    code: 'NT',
    short: 'NT',
    label: 'নিকট ভবিষ্যতে ঝুঁকিতে পড়তে পারে',
    meaning: 'নিকট ভবিষ্যতে ঝুঁকিতে পড়তে পারে',
    en: 'Near Threatened',
    detailBn: 'এখনই CR, EN বা VU শ্রেণিতে না পড়লেও খুব কাছাকাছি আছে এবং নিকট ভবিষ্যতে বিপন্ন শ্রেণিতে পড়ার আশঙ্কা রয়েছে।',
    enDesc: 'Close to qualifying for, or likely to qualify for, a threatened category in the near future.',
    hex: '#7c8648',
    on: 'light',
    color: 'bg-[#7c8648] text-white',
    threatened: false,
  },
  LC: {
    code: 'LC',
    short: 'LC',
    label: 'তুলনামূলক কম ঝুঁকিতে',
    meaning: 'তুলনামূলক কম ঝুঁকিতে',
    en: 'Least Concern',
    detailBn: 'মূল্যায়নে বিপন্ন বা ঝুঁকির কাছাকাছি শ্রেণিতে পড়েনি; বিস্তৃত ও প্রাচুর্যময় প্রজাতি এই শ্রেণিভুক্ত।',
    enDesc: 'Does not qualify as threatened; widespread and abundant taxa are included in this category.',
    hex: '#2f7d52',
    on: 'light',
    color: 'bg-[#2f7d52] text-white',
    threatened: false,
  },
  DD: {
    code: 'DD',
    short: 'DD',
    label: 'ঝুঁকি নির্ধারণের মতো তথ্য অপর্যাপ্ত',
    meaning: 'ঝুঁকি নির্ধারণের মতো তথ্য অপর্যাপ্ত',
    en: 'Data Deficient',
    detailBn: 'বিস্তৃতি বা সংখ্যা সম্পর্কে পর্যাপ্ত তথ্যের অভাবে বিলুপ্তির ঝুঁকি সরাসরি বা পরোক্ষভাবে নির্ধারণ করা যায়নি।',
    enDesc: 'Inadequate information to make a direct or indirect assessment of extinction risk.',
    hex: '#d5cec1',
    on: 'dark',
    color: 'bg-[#d5cec1] text-[#3a3428] ring-1 ring-black/10',
    threatened: false,
  },
  NE: {
    code: 'NE',
    short: 'NE',
    label: 'এখনো মূল্যায়ন করা হয়নি',
    meaning: 'এখনো মূল্যায়ন করা হয়নি',
    en: 'Not Evaluated',
    detailBn: 'IUCN-এর মানদণ্ড অনুযায়ী এখনো এই প্রজাতিটির সংরক্ষণ অবস্থা মূল্যায়ন করা হয়নি।',
    enDesc: 'Has not yet been evaluated against the criteria.',
    hex: '#f2ede2',
    on: 'dark',
    color: 'bg-[#f2ede2] text-[#2c2a22] ring-1 ring-black/10',
    threatened: false,
  },
}

/** যেকোনো চিহ্ন থেকে তথ্য — অচেনা কোড হলে NE ধরা হয় */
export function iucnInfo(code?: string | null): IUCNInfo {
  return (code && (IUCN[code] as IUCNInfo | undefined)) || IUCN.NE
}

/**
 * পুরোনো বা ভিন্ন অনুবাদের `conservationBn` লেখাকে প্রমিত IUCN বাংলা অর্থে রূপান্তর করে,
 * তবে বাংলাদেশের আঞ্চলিক অবস্থা বা অতিরিক্ত টীকা (যেমন "বাংলাদেশে বিরল", "চাষকৃত") অক্ষত রাখে।
 */
export function normalizeConservationBn(code?: string | null, raw?: string | null): string {
  const info = iucnInfo(code)
  const trimmed = (raw || '').trim()
  if (!trimmed) return `${info.meaning} (${info.code})`

  let out = trimmed
    .replace(/ন্যূনতম বিপদগ্রস্ত/g, 'তুলনামূলক কম ঝুঁকিতে')
    .replace(/প্রা[য়য়]-বিপদগ্রস্ত|প্রা[য়য়]-বিপন্ন|প্রা[য়য়]-হুমকিপ্রাপ্ত|সংকট-নিকটবর্তী|সংকটের কাছাকাছি/g, 'নিকট ভবিষ্যতে ঝুঁকিতে পড়তে পারে')
    .replace(/চরম সংকটাপন্ন|মারাত্মক বিপদগ্রস্ত/g, 'অত্যন্ত সংকটাপন্ন')
    .replace(/সংকটাপন্ন\s*\(\s*VU/g, 'ঝুঁকিপূর্ণ (VU')
    .replace(/তথ্যের অভাব|তথ্য-অপ্রতুল|তথ্য-স্বল্পতা/g, 'ঝুঁকি নির্ধারণের মতো তথ্য অপর্যাপ্ত')
    .replace(/মূল্যা[য়য়]ন হ[য়য়]নি|মূল্যা[য়য়]িত ন[য়য়]/g, 'এখনো মূল্যায়ন করা হয়নি')
    .replace(/বনে বিলুপ্ত/g, 'বন্য পরিবেশে বিলুপ্ত')

  if (info.code === 'VU' && (out === 'সংকটাপন্ন' || out === 'বিপদগ্রস্ত' || out === 'অসুরক্ষিত')) {
    out = info.meaning
  }
  if (info.code === 'CR' && out === 'মহাবিপন্ন') {
    out = info.meaning
  }
  if (info.code === 'EX' && out === 'বিলুপ্ত') {
    out = info.meaning
  }
  return out
}

/**
 * প্রজাতির পাতায় বৈশ্বিক IUCN ব্যাজের পাশাপাশি কেবল অতিরিক্ত আঞ্চলিক/প্রাসঙ্গিক টীকা থাকলে সেটি ফেরত দেয়
 * (যাতে একই অর্থ দুবার না দেখায়)।
 */
export function extraConservationNote(code?: string | null, raw?: string | null): string {
  if (!raw || !raw.trim()) return ''
  const info = iucnInfo(code)
  const norm = normalizeConservationBn(code, raw)
    .replace(/^(বিশ্ব\s*IUCN|আইইউসিএন|IUCN)\s*:\s*/i, '')
    .replace(/[।.]+$/g, '')
    .trim()

  const bare = norm
    .replace(new RegExp(`\(\s*${info.code}\s*\)`, 'gi'), '')
    .replace(/^[-—;,:·\s]+|[-—;,:·\s]+$/g, '')
    .trim()

  if (!bare || bare === info.meaning || bare === info.label) return ''

  // যদি "তুলনামূলক কম ঝুঁকিতে; বাংলাদেশে বিরল" ধরনের লেখা হয়, পরের অংশটুকু আলাদা করে দেখানো ভালো
  if (bare.startsWith(info.meaning)) {
    const rest = bare
      .slice(info.meaning.length)
      .replace(/^[-—;,:·\s]+/, '')
      .trim()
    if (!rest || rest === '(বিশ্বে)') return ''
    return rest
  }
  return norm
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
